# 🎁 Imágenes de Premios - Ekokai

Este directorio contiene las imágenes automáticamente asignadas a los premios basándose en su nombre y categoría.

## 📋 Sistema de Mapeo Inteligente

El sistema analiza el nombre del premio y su categoría para asignar automáticamente la imagen más apropiada.

### 🔍 Prioridad de Asignación

1. **Por nombre específico**: Si el premio contiene palabras clave específicas (ej: "audífonos", "laptop")
2. **Por categoría**: Si no hay coincidencia por nombre, se asigna por categoría general
3. **Imagen por defecto**: Si no hay coincidencias, se usa el favicon

### 🎯 Palabras Clave por Tipo

#### Tecnología
- `audífonos`, `headphone`, `auricular` → `audifonos.png`
- `celular`, `teléfono`, `smartphone`, `iphone` → `celular.png`
- `laptop`, `notebook`, `computadora`, `portátil` → `laptop.png`
- `tablet`, `ipad` → `tablet.png`

#### Bebidas
- `café`, `coffee` → `cafe.png`

#### Literatura
- `libro`, `book` → `libro.png`

#### Deportes
- `pelota`, `ball`, `fútbol`, `futbol` → `pelota.png`

#### Ropa y Accesorios
- `remera`, `camiseta`, `shirt`, `tshirt` → `remera.png`
- `gorra`, `cap`, `sombrero` → `gorra.png`
- `mochila`, `backpack`, `bolso` → `mochila.png`

#### Hogar
- `taza`, `mug`, `vaso` → `taza.png`
- `planta`, `maceta`, `flower`, `jardín` → `planta.png`

#### Entretenimiento
- `juego`, `juguete`, `toy`, `game` → `juego.png`
- `música`, `music`, `instrumento` → `musica.png`
- `arte`, `pintura`, `dibujo`, `manualidad` → `arte.png`

#### Mascotas
- `mascota`, `perro`, `gato`, `pet` → `mascota.png`

#### Herramientas
- `herramienta`, `martillo`, `destornillador`, `tool` → `herramienta.png`

#### Belleza
- `belleza`, `cosmético`, `cosmetico`, `crema` → `belleza.png`

#### Deportes
- `deporte`, `gimnasio`, `fitness`, `ejercicio` → `deporte.png`

#### Hogar
- `hogar`, `casa`, `doméstico`, `domestico` → `hogar.png`

#### Transporte
- `auto`, `carro`, `vehículo`, `vehiculo` → `auto.png`

### 🏷️ Categorías por Defecto

- **Electrónicos/Tech/Digital** → `electronico.png`
- **Hogar/Casa/Doméstico** → `hogar.png`
- **Deporte/Fitness/Ejercicio** → `deporte.png`
- **Ropa/Vestimenta/Accesorios** → `ropa.png`
- **Libros/Lectura/Educación** → `libro.png`
- **Comida/Alimento/Bebida** → `comida.png`
- **Belleza/Cosmético/Cuidado** → `belleza.png`
- **Juegos/Juguetes/Entretenimiento** → `juego.png`
- **Jardín/Planta/Naturaleza** → `planta.png`
- **Música/Instrumento/Audio** → `musica.png`
- **Arte/Manualidad/Creatividad** → `arte.png`
- **Mascota/Animal/Veterinaria** → `mascota.png`
- **Auto/Vehículo/Transporte** → `auto.png`
- **Herramienta/Construcción/Bricolaje** → `herramienta.png`

## 📱 Uso en la Aplicación

Las imágenes se muestran en:
- Catálogo de premios público
- Modal de detalle del premio
- Panel de administración de premios

## 🎨 Personalización

Para usar una imagen personalizada para un premio específico, simplemente asigna la URL de la imagen al campo `imagen` del premio en la base de datos.

## 📝 Notas

- Todas las imágenes deben estar en formato PNG
- Tamaño recomendado: 200x200px para el catálogo, 300x300px para el detalle
- Las imágenes se redimensionan automáticamente con `object-fit: cover`
- El sistema es case-insensitive y maneja acentos
