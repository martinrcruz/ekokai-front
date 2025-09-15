# Guía de Botones de Agregar - Ekokai Frontend

## Descripción
Este archivo contiene los estilos compartidos para todos los botones de "Agregar" en las vistas administrativas de Ekokai.

## Color del Botón
- **Color principal**: `#2d5016` (Verde oscuro)
- **Color hover**: `#3d6b26` (Verde oscuro más claro)
- **Texto**: Blanco

## Estructura HTML Recomendada

```html
<!-- En el header de la página -->
<div class="page-header">
  <div class="header-content">
    <!-- Contenido del header existente -->
  </div>
  
  <!-- Botones de agregar - CENTRADOS Y ANCHO COMPLETO -->
  <div class="header-actions">
    <ion-button (click)="metodoCrear()" style="--background: #2d5016; --color: white;" fill="solid" class="add-button">
      <ion-icon name="add-outline" slot="start"></ion-icon>
      Agregar Elemento
    </ion-button>
  </div>
</div>
```

## Cómo Implementar en un Componente

### 1. Importar los estilos en el archivo SCSS del componente:

```scss
// En el archivo component.scss
@import '../shared/add-buttons.scss';
```

### 2. Usar las clases CSS proporcionadas:

- `.header-actions`: Contenedor para los botones en el header (centrado y ancho completo)
- `.add-button`: Clase para el botón de agregar (ancho completo con máximo de 300px)
- `.section-header`: Para headers de sección (como en marketplace, también centrado)

### 3. Estructura completa del header:

```html
<div class="page-header">
  <div class="header-content">
    <div class="header-icon">
      <i class="bi bi-icon-name"></i>
    </div>
    <div class="header-text">
      <h1>Título de la Vista</h1>
      <p>Descripción de la funcionalidad</p>
    </div>
    <div class="header-stats">
      <div class="stat-item">
        <div class="stat-number">{{ total }}</div>
        <div class="stat-label">Total</div>
      </div>
    </div>
  </div>
  
  <!-- Botones de agregar -->
  <div class="header-actions">
    <ion-button (click)="crearElemento()" style="--background: #2d5016; --color: white;" fill="solid" class="add-button">
      <ion-icon name="add-outline" slot="start"></ion-icon>
      Agregar Elemento
    </ion-button>
  </div>
</div>
```

## Vistas que ya Implementan estos Estilos

1. ✅ **usuarios-gestion.component.html** - Agregar Vecino / Encargado
2. ✅ **ecopuntos.component.html** - Agregar Ecopunto
3. ✅ **tipos-residuo-gestion.component.html** - Agregar Tipo de Residuo
4. ✅ **premios-gestion.component.html** - Agregar Premio
5. ✅ **usuarios-staff.component.html** - Agregar Encargado
6. ✅ **usuarios-vecinos.component.html** - Agregar Vecino
7. ✅ **lista-usuarios.component.html** - Agregar Usuario
8. ✅ **cupones-activos.component.html** - Agregar Cupón
9. ✅ **marketplace.component.html** - Agregar Cupón/Producto

## Características de Diseño

### Responsivo
- **Desktop**: Botones centrados con ancho máximo de 300px
- **Mobile**: Botones ocupan todo el ancho disponible
- **Tablet**: Adaptación automática según el espacio disponible

### Efectos Visuales
- Sombra prominente para mayor profundidad
- Efecto hover con elevación de 2px
- Transiciones suaves de 0.3s
- Bordes redondeados de 12px
- Tamaño de fuente más grande (16px)

### Accesibilidad
- Altura mínima de 52px para fácil toque (56px en estados vacíos)
- Contraste adecuado entre texto blanco y fondo verde oscuro
- Iconos descriptivos más grandes (20px)
- Centrado para mejor acceso visual

## Personalización Adicional

Si necesitas personalizar un botón específico, puedes sobrescribir los estilos:

```scss
.mi-boton-especial {
  --background: #1a4d0a !important; // Verde más oscuro
  --border-radius: 12px;
  
  &:hover {
    --background: #2d5016 !important;
  }
}
```

## Notas de Mantenimiento

- Mantener consistencia de color en todos los botones
- Verificar que los métodos de creación estén implementados en los componentes TypeScript
- Testear responsividad en diferentes tamaños de pantalla
- Verificar accesibilidad con lectores de pantalla
