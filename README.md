# Tower Defense Game 🎮

Un juego de defensa de torres inmersivo con sistema de mejoras, múltiples tipos de torres y enemigos, y oleadas infinitas con dificultad creciente.

## Características Principales

### Sistema de Torres (3 tipos)
- **Torre Básica** (50 monedas): Equilibrada - Daño y velocidad moderada
- **Torre Rápida** (60 monedas): Disparo rápido, menor daño - Mayor frecuencia de ataque
- **Torre de Área** (80 monedas): Daño explosivo en área - AOE damage

### Sistema de Mejoras
- 5 niveles de mejora por torre
- Aumenta daño, alcance y velocidad de disparo
- Coste escalonado por nivel
- Venta de torres por 70% del costo invertido

### Sistema de Enemigos (3 tipos)
- **Enemigo Básico**: Velocidad y vida equilibrada
- **Enemigo Rápido**: Alta velocidad, baja vida
- **Enemigo Tanque**: Lenta pero muy resistente

### Mecánicas de Juego
- Base central con 100 HP
- Oleadas infinitas con dificultad creciente
- Sistema de monedas (ganar por matar enemigos)
- Game loop a 60 FPS
- Colocación libre de torres con validación
- Colocación sobre puntos predefinidos de torres
- Interfaz intuitiva

## Cómo Jugar

1. Abre `index.html` en tu navegador
2. **Selecciona una torre** haciendo clic en los botones de la izquierda
3. **Coloca torres** en el mapa (puntos azules)
4. **Mejora torres** haciendo clic derecho en ellas
5. **Vende torres** presionando V y haciendo clic en la torre
6. Defiende tu base de los enemigos

## Controles

| Acción | Control |
|--------|----------|
| Seleccionar Torre | Click en botón de torre |
| Colocar Torre | Click en punto azul |
| Mejorar Torre | Click derecho en torre |
| Vender Torre | Presionar V + Click en torre |
| Cancelar Selección | Click en área vacía o ESC |

## Estructura del Proyecto

```
.
├── index.html          # Archivo principal del juego
├── css/
│   └── style.css       # Estilos del juego
├── js/
│   ├── game.js         # Lógica principal del juego
│   ├── tower.js        # Sistema de torres
│   ├── enemy.js        # Sistema de enemigos
│   ├── projectile.js   # Sistema de proyectiles
│   └── ui.js           # Interfaz del usuario
└── README.md           # Este archivo
```

## Requisitos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Sin dependencias externas

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/kastorazo-dev/tower-defense-game.git
cd tower-defense-game
```

2. Abre `index.html` en tu navegador o sirve con un servidor local:
```bash
python -m http.server 8000
# o
npx http-server
```

3. Visita `http://localhost:8000`

## Gameplay

- Gana monedas eliminando enemigos
- Usa las monedas para construir y mejorar torres
- Cada oleada es más difícil que la anterior
- ¡No dejes que los enemigos alcancen tu base!

## Características del Código

- ✅ Arquitectura orientada a objetos
- ✅ Game loop optimizado a 60 FPS
- ✅ Sistema de física simplificado
- ✅ Gestión de eventos interactiva
- ✅ Código modular y extensible
- ✅ Sin librerías externas (vanilla JavaScript)

## Licencia

MIT