class Enemy {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.vx = 0;
        this.vy = 0;
        
        // Configuración por tipo
        const configs = {
            basic: {
                speed: 1.5,
                maxHealth: 30,
                reward: 50,
                color: '#2ecc71',
                icon: '👤',
                size: 10
            },
            fast: {
                speed: 3,
                maxHealth: 15,
                reward: 40,
                color: '#f39c12',
                icon: '⚡',
                size: 8
            },
            tank: {
                speed: 0.8,
                maxHealth: 60,
                reward: 100,
                color: '#e74c3c',
                icon: '🛡️',
                size: 12
            }
        };
        
        const config = configs[type];
        this.speed = config.speed;
        this.maxHealth = config.maxHealth;
        this.health = config.maxHealth;
        this.reward = config.reward;
        this.color = config.color;
        this.icon = config.icon;
        this.size = config.size;
        
        this.targetIndex = 0;
        this.pathProgress = 0;
    }
    
    update(path) {
        if (this.targetIndex >= path.length - 1) {
            return true; // Llegó a la base
        }
        
        const currentWaypoint = path[this.targetIndex];
        const nextWaypoint = path[this.targetIndex + 1];
        
        const dx = nextWaypoint.x - this.x;
        const dy = nextWaypoint.y - this.y;
        const dist = Math.hypot(dx, dy);
        
        if (dist < this.speed) {
            this.targetIndex++;
            return this.targetIndex >= path.length - 1;
        }
        
        // Movimiento hacia el siguiente waypoint
        const angle = Math.atan2(dy, dx);
        this.vx = Math.cos(angle) * this.speed;
        this.vy = Math.sin(angle) * this.speed;
        
        this.x += this.vx;
        this.y += this.vy;
        
        return false;
    }
    
    takeDamage(damage) {
        this.health -= damage;
        return this.health <= 0;
    }
    
    draw(ctx) {
        // Cuerpo
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Borde
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        // Icono
        ctx.font = `${this.size - 2}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.icon, this.x, this.y);
        
        // Barra de vida
        this.drawHealthBar(ctx);
    }
    
    drawHealthBar(ctx) {
        const barWidth = this.size * 2.5;
        const barHeight = 4;
        const barX = this.x - barWidth / 2;
        const barY = this.y - this.size - 8;
        
        // Fondo
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // Barra de vida
        const healthPercent = this.health / this.maxHealth;
        const healthColor = healthPercent > 0.5 ? '#2ecc71' : healthPercent > 0.25 ? '#f39c12' : '#e74c3c';
        ctx.fillStyle = healthColor;
        ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
        
        // Borde
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
    }
}

class WaveSpawner {
    constructor() {
        this.wave = 1;
        this.enemiesSpawned = 0;
        this.waveComplete = false;
        this.lastSpawnTime = Date.now();
        this.spawnRate = 800;
    }
    
    getWaveConfig(wave) {
        // Cada ola es más difícil
        const baseDifficulty = Math.min(wave * 0.2, 2);
        const basicCount = Math.floor(3 + wave * 1.5);
        const fastCount = Math.floor(wave * 0.8);
        const tankCount = Math.floor(wave * 0.3);
        
        return {
            basic: basicCount,
            fast: fastCount,
            tank: tankCount,
            totalEnemies: basicCount + fastCount + tankCount
        };
    }
    
    update(path) {
        const config = this.getWaveConfig(this.wave);
        
        if (Date.now() - this.lastSpawnTime > this.spawnRate && this.enemiesSpawned < config.totalEnemies) {
            this.lastSpawnTime = Date.now();
            const enemies = [];
            
            // Determinamos qué tipo de enemigo spawneamos
            const totalEnemies = config.totalEnemies;
            const remaining = totalEnemies - this.enemiesSpawned;
            
            let type = 'basic';
            if (remaining <= config.tank && config.tank > 0) {
                type = 'tank';
            } else if (remaining <= config.tank + config.fast && config.fast > 0) {
                type = 'fast';
            }
            
            const enemy = new Enemy(path[0].x, path[0].y, type);
            this.enemiesSpawned++;
            
            return enemy;
        }
        
        if (this.enemiesSpawned >= config.totalEnemies) {
            this.waveComplete = true;
        }
        
        return null;
    }
    
    nextWave() {
        this.wave++;
        this.enemiesSpawned = 0;
        this.waveComplete = false;
        this.spawnRate = Math.max(400, 800 - this.wave * 20);
    }
}