const fs = require('fs');
const path = require('path');

// Crear directorio de premios si no existe
const premiosDir = path.join(__dirname, '../src/assets/premios');
if (!fs.existsSync(premiosDir)) {
    fs.mkdirSync(premiosDir, { recursive: true });
}

// Definir los premios con sus iconos y colores
const premios = [
    { nombre: 'audifonos', icon: '🎧', color: '#2196F3' },
    { nombre: 'celular', icon: '📱', color: '#4CAF50' },
    { nombre: 'laptop', icon: '💻', color: '#FF9800' },
    { nombre: 'tablet', icon: '📱', color: '#9C27B0' },
    { nombre: 'cafe', icon: '☕', color: '#795548' },
    { nombre: 'libro', icon: '📚', color: '#607D8B' },
    { nombre: 'pelota', icon: '⚽', color: '#FF5722' },
    { nombre: 'remera', icon: '👕', color: '#E91E63' },
    { nombre: 'gorra', icon: '🧢', color: '#3F51B5' },
    { nombre: 'mochila', icon: '🎒', color: '#009688' },
    { nombre: 'taza', icon: '☕', color: '#795548' },
    { nombre: 'planta', icon: '🌱', color: '#8BC34A' },
    { nombre: 'juego', icon: '🎮', color: '#FF5722' },
    { nombre: 'musica', icon: '🎵', color: '#9C27B0' },
    { nombre: 'arte', icon: '🎨', color: '#E91E63' },
    { nombre: 'mascota', icon: '🐕', color: '#FF9800' },
    { nombre: 'herramienta', icon: '🔧', color: '#607D8B' },
    { nombre: 'belleza', icon: '💄', color: '#E91E63' },
    { nombre: 'deporte', icon: '🏃', color: '#4CAF50' },
    { nombre: 'hogar', icon: '🏠', color: '#795548' },
    { nombre: 'auto', icon: '🚗', color: '#2196F3' },
    { nombre: 'electronico', icon: '⚡', color: '#FF9800' },
    { nombre: 'ropa', icon: '👔', color: '#9C27B0' },
    { nombre: 'comida', icon: '🍕', color: '#FF5722' }
];

// Generar SVG para cada premio
function generarSVG(nombre, icon, color) {
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" fill="${color}" rx="15"/>
    <text x="50" y="60" font-size="40" text-anchor="middle" fill="white">${icon}</text>
    <text x="50" y="85" font-size="8" text-anchor="middle" fill="white" font-family="Arial">${nombre}</text>
</svg>`;
}

// Generar archivos SVG
console.log('🎁 Generando imágenes SVG para premios...');

premios.forEach(premio => {
    const svgContent = generarSVG(premio.nombre, premio.icon, premio.color);
    const filePath = path.join(premiosDir, `${premio.nombre}.svg`);
    
    fs.writeFileSync(filePath, svgContent);
    console.log(`✅ Generado: ${premio.nombre}.svg`);
});

// Crear archivo de índice
const indexContent = `// Índice de imágenes de premios generado automáticamente
export const PREMIO_IMAGENES = {
${premios.map(p => `  '${p.nombre}': 'assets/premios/${p.nombre}.svg'`).join(',\n')}
};

export function getImagenPremio(nombre: string): string {
  return PREMIO_IMAGENES[nombre] || 'assets/icon/favicon.png';
}
`;

const indexPath = path.join(premiosDir, 'index.ts');
fs.writeFileSync(indexPath, indexContent);
console.log(`✅ Generado: index.ts`);

console.log('\n🎉 ¡Imágenes de premios generadas exitosamente!');
console.log(`📁 Ubicación: ${premiosDir}`);
console.log('\n📝 Nota: Para convertir a PNG, puedes usar herramientas online o editores de imagen.');
console.log('   También puedes usar librerías como sharp o jimp para conversión programática.');
