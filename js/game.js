class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Configurar canvas
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        
        // Game state
        this.money = 200;
        this.baseHealth = 100;
        this.isGameOver = false;
        
        // Entidades
        this.towers = [];
        this.enemies = [];
        this.projectiles = [];
        this.explosions = [];
        
        // Sistema de oleadas
        this.waveSpawner = new WaveSpawner();
        this.path = this.createPath();
        
        // UI
        this.ui = new UI(canvas);
        this.ui.initializeGame();
        this.mouseX = 0;
        this.mouseY = 0;
        
        // Game loop
        this.running = true;
        this.fps = 60;
        this.frameTime = 1000 / this.fps;
        this.lastFrameTime = Date.now();
        
        this.gameLoop();
    }
    
    createPath() {
        // Camino para los enemigos
        return [
            { x: -30, y: this.canvas.height / 2 },
            { x: 150, y: this.canvas.height / 2 - 80 },
            { x: 350, y: this.canvas.height / 2 + 100 },
            { x: 550, y: this.canvas.height / 2 - 80 },
            { x: 750, y: this.canvas.height / 2 + 100 },
            { x: this.canvas.width + 30, y: this.canvas.height / 2 }
        ];
    }
    
    placeTower(x, y, type) {
        // Encontrar punto de colocación más cercano
        let closestPoint = null;
        let minDist = 40;
        
        for (let point of this.ui.towerPlacementPoints) {
            const dist = Math.hypot(point.x - x, point.y - y);
            if (dist < minDist) {
                minDist = dist;
                closestPoint = point;
            }
        }
        
        if (!closestPoint) {
            console.log('No tower placement point nearby');
            return false;
        }
        
        // Verificar que no haya otra torre
        for (let tower of this.towers) {
            if (tower.x === closestPoint.x && tower.y === closestPoint.y) {
                console.log('Tower already placed here');
                return false;
            }
        }
        
        // Configuración de costos
        const costs = {
            basic: 50,
            fast: 60,
            area: 80
        };
        
        const cost = costs[type];
        if (this.money < cost) {
            console.log('Not enough money');
            return false;
        }
        
        // Crear torre
        const tower = new Tower(closestPoint.x, closestPoint.y, type);
        this.towers.push(tower);
        this.money -= cost;
        
        this.updateUI();
        return true;
    }
    
    upgradeTower(x, y) {
        for (let tower of this.towers) {
            const dist = Math.hypot(tower.x - x, tower.y - y);
            if (dist < 20) {
                const cost = tower.upgrade();
                if (cost) {
                    this.money -= cost;
                    this.updateUI();
                    return true;
                }
                return false;
            }
        }
        return false;
    }
    
    sellTower(x, y) {
        for (let i = 0; i < this.towers.length; i++) {
            const tower = this.towers[i];
            const dist = Math.hypot(tower.x - x, tower.y - y);
            if (dist < 20) {
                const sellValue = tower.getSellValue();
                this.money += sellValue;
                this.towers.splice(i, 1);
                this.updateUI();
                return true;
            }
        }
        return false;
    }
    
    update() {
        if (this.isGameOver) return;
        
        // Spawner de enemigos
        const newEnemy = this.waveSpawner.update(this.path);
        if (newEnemy) {
            this.enemies.push(newEnemy);
        }
        
        // Actualizar enemigos
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const reachedBase = this.enemies[i].update(this.path);
            if (reachedBase) {
                this.baseHealth -= 10;
                this.enemies.splice(i, 1);
                
                if (this.baseHealth <= 0) {
                    this.gameOver();
                }
            }
        }
        
        // Actualizar torres
        for (let tower of this.towers) {
            const projectile = tower.update(this.enemies);
            if (projectile) {
                this.projectiles.push(projectile);
            }
        }
        
        // Actualizar proyectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const expired = this.projectiles[i].update();
            if (expired) {
                this.projectiles.splice(i, 1);
                continue;
            }
            
            // Colisiones
            for (let j = this.enemies.length - 1; j >= 0; j--) {
                if (this.projectiles[i].checkHit(this.enemies[j])) {
                    const enemy = this.enemies[j];
                    const isDead = enemy.takeDamage(this.projectiles[i].damage);
                    
                    // Crear explosión si es torre de área
                    if (this.projectiles[i].towerType === 'area') {
                        const explosion = new Explosion(
                            this.projectiles[i].x,
                            this.projectiles[i].y,
                            50,
                            this.projectiles[i].damage
                        );
                        this.explosions.push(explosion);
                        
                        // Daño a otros enemigos
                        for (let k = this.enemies.length - 1; k >= 0; k--) {
                            if (k !== j && explosion.checkHit(this.enemies[k])) {
                                if (this.enemies[k].takeDamage(this.projectiles[i].damage * 0.5)) {
                                    this.money += this.enemies[k].reward;
                                    this.enemies.splice(k, 1);
                                }
                            }
                        }
                    }
                    
                    if (isDead) {
                        this.money += enemy.reward;
                        this.enemies.splice(j, 1);
                    }
                    
                    this.projectiles.splice(i, 1);
                    break;
                }
            }
        }
        
        // Actualizar explosiones
        for (let i = this.explosions.length - 1; i >= 0; i--) {
            if (!this.explosions[i].isActive()) {
                this.explosions.splice(i, 1);
            }
        }
        
        // Siguiente ola
        if (this.waveSpawner.waveComplete && this.enemies.length === 0) {
            this.waveSpawner.nextWave();
        }
        
        this.updateUI();
    }
    
    draw() {
        // Limpiar canvas
        this.ctx.fillStyle = 'rgba(30, 60, 114, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Dibujar puntos de colocación
        this.ui.drawTowerPlacementPoints(this.ctx);
        
        // Dibujar camino
        this.drawPath();
        
        // Dibujar proyectiles
        for (let projectile of this.projectiles) {
            projectile.draw(this.ctx);
        }
        
        // Dibujar explosiones
        for (let explosion of this.explosions) {
            explosion.draw(this.ctx);
        }
        
        // Dibujar enemigos
        for (let enemy of this.enemies) {
            enemy.draw(this.ctx);
        }
        
        // Dibujar torres
        for (let tower of this.towers) {
            tower.draw(this.ctx);
        }
        
        // Preview de torre si está seleccionada
        if (this.ui.selectedTower) {
            this.ui.drawTowerPreview(this.ctx, this.mouseX, this.mouseY, this.ui.selectedTower);
        }
        
        // Información en pantalla
        this.drawHUD();
    }
    
    drawPath() {
        this.ctx.strokeStyle = 'rgba(52, 152, 219, 0.3)';
        this.ctx.lineWidth = 30;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.beginPath();
        
        for (let i = 0; i < this.path.length; i++) {
            if (i === 0) {
                this.ctx.moveTo(this.path[i].x, this.path[i].y);
            } else {
                this.ctx.lineTo(this.path[i].x, this.path[i].y);
            }
        }
        
        this.ctx.stroke();
    }
    
    drawHUD() {
        const padding = 15;
        const lineHeight = 25;
        
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(padding, padding, 200, 100);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 14px Arial';
        this.ctx.fillText(`Ola: ${this.waveSpawner.wave}`, padding + 10, padding + 25);
        this.ctx.fillText(`Enemigos: ${this.enemies.length}`, padding + 10, padding + 25 + lineHeight);
        this.ctx.fillText(`Torres: ${this.towers.length}`, padding + 10, padding + 25 + lineHeight * 2);
        this.ctx.fillText(`HP Base: ${this.baseHealth}`, padding + 10, padding + 25 + lineHeight * 3);
    }
    
    gameOver() {
        this.isGameOver = true;
        this.running = false;
        this.ui.showGameOver('¡Perdiste! Los enemigos alcanzaron tu base.');
    }
    
    updateUI() {
        this.ui.updateStats(this.money, this.baseHealth, this.waveSpawner.wave);
    }
    
    gameLoop() {
        const now = Date.now();
        const deltaTime = now - this.lastFrameTime;
        
        if (deltaTime >= this.frameTime) {
            this.update();
            this.draw();
            
            this.canvas.addEventListener('mousemove', (e) => {
                const rect = this.canvas.getBoundingClientRect();
                this.mouseX = e.clientX - rect.left;
                this.mouseY = e.clientY - rect.top;
            });
            
            this.lastFrameTime = now;
        }
        
        if (this.running) {
            requestAnimationFrame(() => this.gameLoop());
        }
    }
}

// Iniciar juego cuando se carga la página
let game;
window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    game = new Game(canvas);
});