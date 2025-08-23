/**
 * Configuración para el Catálogo como Sitio Independiente
 * Este archivo controla el comportamiento del catálogo cuando se accede como sitio web independiente
 */

export interface CatalogoStandaloneConfig {
  // Configuración de navegación
  navigation: {
    showBackButton: boolean;
    showHomeButton: boolean;
    allowNavigation: boolean;
    redirectUnauthenticated: string;
  };
  
  // Configuración de la interfaz
  interface: {
    showSidebar: boolean;
    showHeader: boolean;
    showFooter: boolean;
    theme: 'light' | 'dark' | 'auto';
  };
  
  // Configuración de SEO y metadatos
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
  };
  
  // Configuración de branding
  branding: {
    logo: string;
    companyName: string;
    tagline: string;
    primaryColor: string;
    accentColor: string;
  };
}

export const CATALOGO_STANDALONE_CONFIG: CatalogoStandaloneConfig = {
  navigation: {
    showBackButton: false,
    showHomeButton: true,
    allowNavigation: false,
    redirectUnauthenticated: '/auth/login'
  },
  
  interface: {
    showSidebar: false,
    showHeader: true,
    showFooter: true,
    theme: 'light'
  },
  
  seo: {
    title: 'Catálogo de Premios Ekokai - Recicla y Gana',
    description: 'Descubre todos los premios disponibles para canjear con los puntos que obtienes al reciclar. Catálogo completo de Ekokai.',
    keywords: ['catálogo', 'premios', 'ekokai', 'reciclaje', 'puntos', 'canje', 'whatsapp'],
    ogImage: 'assets/icon/logo-ekokai.jpeg'
  },
  
  branding: {
    logo: 'assets/icon/logo-ekokai.jpeg',
    companyName: 'Ekokai',
    tagline: 'Recicla, gana puntos y canjea premios',
    primaryColor: '#667eea',
    accentColor: '#ffd700'
  }
};


