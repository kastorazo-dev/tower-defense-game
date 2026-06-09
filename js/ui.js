class UI {
    constructor(canvas) {
        this.canvas = canvas;
        this.selectedTower = null;
        this.sellMode = false;
        this.towerPlacementPoints = [];
    }
    
    initializeGame() {
        // Crear puntos de colocación de torres
        this.createTowerPlacementPoints();
        
        // Event listeners
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
        this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.handleRightClick(e);
        });
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        
        // Tower buttons
        document.querySelectorAll('.tower-btn').forEach(btn => {
            btn.addEventListener('click', () => this.selectTower(btn.dataset.tower));
        });
    }
    
    createTowerPlacementPoints() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const margin = 60;
        const spacing = 80;
        
        for (let x = margin; x < width - margin; x += spacing) {
            for (let y = margin; y < height - margin; y += spacing) {
                this.towerPlacementPoints.push({ x, y });
            }
        }
    }
    
    selectTower(type) {
        this.selectedTower = this.selectedTower === type ? null : type;
        this.sellMode = false;
        this.updateTowerButtons();
    }
    
    updateTowerButtons() {
        document.querySelectorAll('.tower-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tower === this.selectedTower) {
                btn.classList.add('active');
            }
        });
    }
    
    handleKeyDown(e) {
        if (e.key === 'v' || e.key === 'V') {
            this.sellMode = true;
            this.selectedTower = null;
            this.updateTowerButtons();
        }
        if (e.key === 'Escape') {
            this.selectedTower = null;
            this.sellMode = false;
            this.updateTowerButtons();
        }
    }
    
    handleKeyUp(e) {
        if (e.key === 'v' || e.key === 'V') {
            this.sellMode = false;
        }
    }
    
    handleCanvasClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (this.selectedTower) {
            game.placeTower(x, y, this.selectedTower);
        } else if (this.sellMode) {
            game.sellTower(x, y);
        } else {
            this.selectedTower = null;
            this.updateTowerButtons();
        }
    }
    
    handleRightClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        game.upgradeTower(x, y);
    }
    
    handleMouseMove(e) {
        // Para efectos visuales futuros
    }
    
    updateStats(money, health, wave) {
        document.getElementById('money').textContent = money;
        document.getElementById('health').textContent = health;
        document.getElementById('wave').textContent = wave;
    }
    
    showGameOver(reason) {
        const gameOverDiv = document.getElementById('gameOver');
        document.getElementById('gameOverText').textContent = reason;
        gameOverDiv.style.display = 'block';
    }
    
    drawTowerPlacementPoints(ctx) {
        ctx.fillStyle = 'rgba(52, 152, 219, 0.3)';
        ctx.strokeStyle = 'rgba(52, 152, 219, 0.6)';
        ctx.lineWidth = 1.5;
        
        for (let point of this.towerPlacementPoints) {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }
    }
    
    drawTowerPreview(ctx, mouseX, mouseY, towerType) {
        if (!towerType) return;
        
        const tower = new Tower(mouseX, mouseY, towerType);
        
        ctx.fillStyle = `rgba(${this.hexToRgb(tower.color)}, 0.3)`;
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, tower.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = `rgba(${this.hexToRgb(tower.color)}, 0.7)`;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Rango
        ctx.strokeStyle = `rgba(${this.hexToRgb(tower.color)}, 0.2)`;
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, tower.range, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
    }
    
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 0, 0';
    }
}