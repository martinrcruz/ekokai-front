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
  };
  
  // Configuración de premios destacados
  featured: {
    showSection: boolean;
    title: string;
    maxItems: number;
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
      'Otros': 'medium'
    }
  },
  
  featured: {
    showSection: true,
    title: 'Premios Destacados',
    maxItems: 6
  },
  
  list: {
    itemsPerRow: {
      mobile: 1,
      tablet: 2,
      desktop: 3
    },
    showStock: true,
    showCupones: true
  },
  
  whatsapp: {
    buttonText: 'Canjear por WhatsApp',
    buttonColor: 'primary',
    buttonIcon: 'bi-whatsapp',
    messageTemplate: '¡Hola! Quiero canjear el premio "{nombre}" (Código: {codigo}) por {cupones} cupones.'
  }
};
