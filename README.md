# Tower Defense Game 🎮

Un juego de defensa de torres inmersivo desarrollado con React Native, Expo y FastAPI.

## Características Principales

### 🏰 Sistema de Torres (3 tipos)
- **Torre Básica**: Equilibrada (50 monedas) - Daño y velocidad moderada
- **Torre Rápida**: Disparo rápido, menor daño (60 monedas) - Mayor frecuencia de ataque
- **Torre de Área**: Daño explosivo en área (80 monedas) - AOE damage

### ⬆️ Sistema de Mejoras
- 5 niveles de mejora por torre
- Aumenta daño, alcance y velocidad de disparo
- Coste escalonado por nivel

### 👾 Sistema de Enemigos (3 tipos)
- **Enemigo Básico**: Velocidad y vida equilibrada
- **Enemigo Rápido**: Alta velocidad, baja vida
- **Enemigo Tanque**: Lenta pero muy resistente

### 🎮 Mecánicas de Juego
- Base central con 100 HP
- Oleadas infinitas con dificultad creciente
- Sistema de monedas (ganar por matar enemigos)
- Game loop a 60 FPS
- Colocación libre de torres con validación
- Venta de torres por 70% del costo invertido

### 📱 Controles Táctiles
- Toca para colocar torres seleccionadas
- Mantén presionado para mejorar/vender/mover torres
- Botón de pausa durante el juego
- Menú táctil para construir y mejorar

## Tecnología

- **Frontend**: React Native + Expo + react-native-reanimated
- **Backend**: FastAPI
- **Database**: MongoDB
- **Visualización**: SVG Canvas
- **Estado**: Zustand

## Estructura del Proyecto

```
tower-defense-game/
├── frontend/              # Aplicación React Native
│   ├── src/
│   │   ├── components/    # Componentes de UI
│   │   ├── screens/       # Pantallas del juego
│   │   ├── game/          # Lógica del juego
│   │   ├── utils/         # Utilidades
│   │   └── assets/        # Imágenes y recursos
│   ├── app.json
│   └── package.json
├── backend/               # API REST FastAPI
│   ├── app/
│   │   ├── main.py
│   │   ├── models/
│   │   ├── routes/
│   │   └── database/
│   └── requirements.txt
└── docs/                  # Documentación

```

## Instalación

### Frontend
```bash
cd frontend
npm install
npm start
```

### Backend
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

## Estadísticas Tracked
- Récord de puntos
- Oleada máxima alcanzada
- Enemigos eliminados totales
- Partidas jugadas
- Mejor racha

## Contribución
Las contribuciones son bienvenidas. Por favor, crea una rama para tu feature.

## Licencia
MIT