class Tower {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.level = 1;
        this.totalCost = 0;
        
        // Configuración base por tipo
        const configs = {
            basic: {
                cost: 50,
                damage: 20,
                range: 120,
                fireRate: 1000,
                color: '#3498db',
                icon: '⚔️'
            },
            fast: {
                cost: 60,
                damage: 12,
                range: 110,
                fireRate: 500,
                color: '#f39c12',
                icon: '⚡'
            },
            area: {
                cost: 80,
                damage: 25,
                range: 130,
                fireRate: 1500,
                color: '#e74c3c',
                icon: '💥'
            }
        };
        
        const config = configs[type];
        this.damage = config.damage;
        this.range = config.range;
        this.fireRate = config.fireRate;
        this.color = config.color;
        this.icon = config.icon;
        this.totalCost = config.cost;
        
        this.lastFire = Date.now();
        this.radius = 12;
    }
    
    upgrade() {
        if (this.level >= 5) return false;
        
        const upgradeCosts = [0, 50, 75, 100, 150, 200];
        const cost = upgradeCosts[this.level + 1];
        
        if (game.money < cost) return false;
        
        this.level++;
        this.totalCost += cost;
        
        // Mejoras escaladas
        this.damage *= 1.2;
        this.range *= 1.05;
        this.fireRate *= 0.9; // Más rápido
        
        return cost;
    }
    
    canFire() {
        return Date.now() - this.lastFire >= this.fireRate;
    }
    
    fire(enemy) {
        if (!this.canFire()) return null;
        
        this.lastFire = Date.now();
        
        const projectile = new Projectile(
            this.x,
            this.y,
            enemy.x,
            enemy.y,
            this.damage,
            this.type
        );
        
        return projectile;
    }
    
    findTarget(enemies) {
        let closest = null;
        let closestDist = this.range;
        
        for (let enemy of enemies) {
            const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
            if (dist < closestDist) {
                closestDist = dist;
                closest = enemy;
            }
        }
        
        return closest;
    }
    
    update(enemies) {
        const target = this.findTarget(enemies);
        if (target) {
            return this.fire(target);
        }
        return null;
    }
    
    draw(ctx) {
        // Base de la torre
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Borde
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Rango (línea punteada)
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 + this.level * 0.05})`;
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Icono
        ctx.font = `${10 + this.level}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.icon, this.x, this.y);
        
        // Nivel
        ctx.font = 'bold 10px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(this.level, this.x + this.radius - 3, this.y - this.radius + 3);
    }
    
    getUpgradeCost() {
        if (this.level >= 5) return null;
        const costs = [0, 50, 75, 100, 150, 200];
        return costs[this.level + 1];
    }
    
    getSellValue() {
        return Math.floor(this.totalCost * 0.7);
    }
}