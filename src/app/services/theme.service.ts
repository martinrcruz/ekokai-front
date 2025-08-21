import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type ThemeMode = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentThemeSubject = new BehaviorSubject<ThemeMode>('system');
  public currentTheme$: Observable<ThemeMode> = this.currentThemeSubject.asObservable();

  constructor() {
    this.initializeTheme();
  }

  /**
   * Inicializa el tema basado en las preferencias guardadas o del sistema
   */
  private initializeTheme(): void {
    const savedTheme = localStorage.getItem('ekokai-theme') as ThemeMode;
    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      this.setTheme('system');
    }
  }

  /**
   * Obtiene el tema actual
   */
  getCurrentTheme(): ThemeMode {
    return this.currentThemeSubject.value;
  }

  /**
   * Establece el tema especificado
   */
  setTheme(theme: ThemeMode): void {
    this.currentThemeSubject.next(theme);
    localStorage.setItem('ekokai-theme', theme);
    this.applyTheme(theme);
  }

  /**
   * Aplica el tema especificado al DOM
   */
  private applyTheme(theme: ThemeMode): void {
    const body = document.body;
    
    // Remover clases de tema anteriores
    body.classList.remove('theme-light', 'theme-dark');
    
    if (theme === 'system') {
      // Detectar preferencia del sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      body.classList.add(prefersDark ? 'theme-dark' : 'theme-light');
    } else {
      body.classList.add(`theme-${theme}`);
    }
  }

  /**
   * Cambia al siguiente tema en el ciclo
   */
  cycleTheme(): void {
    const current = this.getCurrentTheme();
    const themes: ThemeMode[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(current);
    const nextIndex = (currentIndex + 1) % themes.length;
    this.setTheme(themes[nextIndex]);
  }

  /**
   * Obtiene si el tema actual es oscuro
   */
  isDarkTheme(): boolean {
    const theme = this.getCurrentTheme();
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return theme === 'dark';
  }

  /**
   * Escucha cambios en la preferencia del sistema
   */
  listenToSystemThemeChanges(): void {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (this.getCurrentTheme() === 'system') {
        this.applyTheme('system');
      }
    });
  }
}
