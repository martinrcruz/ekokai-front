// Índice de imágenes de premios generado automáticamente
export const PREMIO_IMAGENES = {
  'audifonos': 'assets/premios/audifonos.svg',
  'celular': 'assets/premios/celular.svg',
  'laptop': 'assets/premios/laptop.svg',
  'tablet': 'assets/premios/tablet.svg',
  'cafe': 'assets/premios/cafe.svg',
  'libro': 'assets/premios/libro.svg',
  'pelota': 'assets/premios/pelota.svg',
  'remera': 'assets/premios/remera.svg',
  'gorra': 'assets/premios/gorra.svg',
  'mochila': 'assets/premios/mochila.svg',
  'taza': 'assets/premios/taza.svg',
  'planta': 'assets/premios/planta.svg',
  'juego': 'assets/premios/juego.svg',
  'musica': 'assets/premios/musica.svg',
  'arte': 'assets/premios/arte.svg',
  'mascota': 'assets/premios/mascota.svg',
  'herramienta': 'assets/premios/herramienta.svg',
  'belleza': 'assets/premios/belleza.svg',
  'deporte': 'assets/premios/deporte.svg',
  'hogar': 'assets/premios/hogar.svg',
  'auto': 'assets/premios/auto.svg',
  'electronico': 'assets/premios/electronico.svg',
  'ropa': 'assets/premios/ropa.svg',
  'comida': 'assets/premios/comida.svg'
};

export function getImagenPremio(nombre: string): string {
  return PREMIO_IMAGENES[nombre as keyof typeof PREMIO_IMAGENES] || 'assets/icon/favicon.png';
}
