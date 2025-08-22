/**
 * Configuración del Catálogo de Premios
 * Este archivo permite personalizar el comportamiento y apariencia del catálogo
 */

export interface CatalogoConfig {
  // Configuración de búsqueda
  search: {
    placeholder: string;
    debounceTime: number;
    showClearButton: boolean;
  };
  
  // Configuración de filtros
  filters: {
    showCategories: boolean;
    showClearButton: boolean;
    categoryColors: { [key: string]: string };
    categoryIcons: { [key: string]: string };
  };
  
  // Configuración de la lista de premios
  list: {
    itemsPerRow: {
      mobile: number;
      tablet: number;
      desktop: number;
    };
    showStock: boolean;
    showCupones: boolean;
  };
  
  // Configuración de WhatsApp
  whatsapp: {
    buttonText: string;
    buttonColor: string;
    buttonIcon: string;
    messageTemplate: string;
  };
}

export const CATALOGO_CONFIG: CatalogoConfig = {
  search: {
    placeholder: 'Buscar premios por nombre, descripción o categoría...',
    debounceTime: 500,
    showClearButton: true
  },
  
  filters: {
    showCategories: true,
    showClearButton: true,
    categoryColors: {
      'Electrónicos': 'primary',
      'Hogar': 'secondary',
      'Deportes': 'success',
      'Moda': 'warning',
      'Libros': 'info',
      'Otros': 'medium',
      'Alimentación': 'danger',
      'Belleza': 'tertiary',
      'Juguetes': 'success',
      'Jardín': 'success',
      'Música': 'tertiary',
      'Arte': 'warning',
      'Tecnología': 'primary',
      'Fitness': 'success',
      'Viajes': 'primary',
      'Educación': 'info',
      'Salud': 'danger',
      'Automotriz': 'medium',
      'Mascotas': 'tertiary',
      'Construcción': 'medium'
    },
    categoryIcons: {
      'Electrónicos': 'bi-phone',
      'Hogar': 'bi-house',
      'Deportes': 'bi-trophy',
      'Moda': 'bi-bag',
      'Libros': 'bi-book',
      'Otros': 'bi-gift',
      'Alimentación': 'bi-cup-hot',
      'Belleza': 'bi-mirror',
      'Juguetes': 'bi-controller',
      'Jardín': 'bi-flower1',
      'Música': 'bi-music-note',
      'Arte': 'bi-palette',
      'Tecnología': 'bi-laptop',
      'Fitness': 'bi-heart-pulse',
      'Viajes': 'bi-airplane',
      'Educación': 'bi-mortarboard',
      'Salud': 'bi-heart',
      'Automotriz': 'bi-car-front',
      'Mascotas': 'bi-heart-pulse',
      'Construcción': 'bi-tools'
    }
  },
  
  list: {
    itemsPerRow: {
      mobile: 1,
      tablet: 2,
      desktop: 3
    },
    showStock: true,
    showCupones: false // Ya no se muestran cupones, siempre es 1
  },
  
  whatsapp: {
    buttonText: 'Canjear por WhatsApp',
    buttonColor: 'primary',
    buttonIcon: 'bi-whatsapp',
    messageTemplate: '¡Hola! Quiero canjear el premio "{nombre}" (Código: {codigo}) por 1 cupón.'
  }
};
