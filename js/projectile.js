class Projectile {
    constructor(x, y, targetX, targetY, damage, towerType) {
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.damage = damage;
        this.towerType = towerType;
        
        this.vx = 0;
        this.vy = 0;
        this.speed = 4;
        
        // Dirección al objetivo
        const dx = targetX - x;
        const dy = targetY - y;
        const dist = Math.hypot(dx, dy);
        
        if (dist > 0) {
            this.vx = (dx / dist) * this.speed;
            this.vy = (dy / dist) * this.speed;
        }
        
        this.radius = 5;
        this.color = '#FFD700';
        this.lifespan = 300; // ms
        this.createdAt = Date.now();
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        
        // Verificar si ha expirado
        return (Date.now() - this.createdAt) > this.lifespan;
    }
    
    checkHit(enemy) {
        const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
        return dist < this.radius + enemy.size;
    }
    
    getExplosionRadius() {
        if (this.towerType === 'area') {
            return 50;
        }
        return 0;
    }
    
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Efecto de brillo
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        // Trail
        ctx.strokeStyle = `rgba(255, 215, 0, ${0.3})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.vx * 2, this.y - this.vy * 2);
        ctx.stroke();
    }
}

class Explosion {
    constructor(x, y, radius, damage) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.damage = damage;
        this.createdAt = Date.now();
        this.duration = 150;
    }
    
    isActive() {
        return (Date.now() - this.createdAt) < this.duration;
    }
    
    checkHit(enemy) {
        const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
        return dist < this.radius + enemy.size;
    }
    
    draw(ctx) {
        const progress = (Date.now() - this.createdAt) / this.duration;
        const alpha = 1 - progress;
        const currentRadius = this.radius * progress;
        
        // Círculo exterior
        ctx.fillStyle = `rgba(255, 150, 0, ${alpha * 0.5})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Círculo interior
        ctx.fillStyle = `rgba(255, 200, 0, ${alpha * 0.7})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, currentRadius * 0.6, 0, Math.PI * 2);
        ctx.fill();
        
        // Efecto de chispas
        ctx.fillStyle = `rgba(255, 255, 100, ${alpha})`;
        for (let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 / 5) * i + progress * Math.PI * 2;
            const distance = currentRadius * 0.8;
            const px = this.x + Math.cos(angle) * distance;
            const py = this.y + Math.sin(angle) * distance;
            ctx.beginPath();
            ctx.arc(px, py, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}