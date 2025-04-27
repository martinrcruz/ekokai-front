import { Directive, ElementRef, HostBinding, Input, OnDestroy, OnInit, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[formControlName], [ngModel], [formControl]',
  standalone: false
})
export class FormValidationDirective implements OnInit, OnDestroy {
  @HostBinding('class.invalid') get isInvalid() {
    return this.control && this.control.invalid && (this.control.dirty || this.control.touched);
  }

  @HostBinding('class.required') get isRequired() {
    if (!this.control || !this.control.validator) {
      return false;
    }
    const validator = this.control.validator({} as any);
    return validator && validator['required'];
  }

  @Input() errorMessages: { [key: string]: string } = {
    required: 'Este campo es obligatorio',
    email: 'Ingrese un email válido',
    minlength: 'Valor demasiado corto',
    maxlength: 'Valor demasiado largo',
    pattern: 'Formato incorrecto'
  };

  private statusChanges: Subscription | null = null;
  private errorElement: HTMLElement | null = null;

  constructor(
    @Optional() private control: NgControl,
    private el: ElementRef
  ) {}

  ngOnInit() {
    if (!this.control) {
      return;
    }

    // Suscribirse a cambios en el estado del control
    const subscription = this.control.statusChanges?.subscribe(() => {
      this.updateErrorMessages();
    });
    
    if (subscription) {
      this.statusChanges = subscription;
    }
  }

  ngOnDestroy() {
    if (this.statusChanges) {
      this.statusChanges.unsubscribe();
    }
    this.removeErrorElement();
  }

  private updateErrorMessages() {
    this.removeErrorElement();

    // Solo mostrar errores si el control es inválido y ha sido tocado/modificado
    if (this.control && this.control.invalid && (this.control.dirty || this.control.touched)) {
      const errors = this.control.errors;
      if (errors) {
        const errorKey = Object.keys(errors)[0];
        const message = this.errorMessages[errorKey] || `Error: ${errorKey}`;
        this.addErrorElement(message);
      }
    }
  }

  private addErrorElement(message: string) {
    const parentElement = this.el.nativeElement.closest('ion-item') || this.el.nativeElement.parentElement;
    if (!parentElement) return;

    this.errorElement = document.createElement('span');
    this.errorElement.className = 'form-error';
    this.errorElement.innerText = message;
    parentElement.appendChild(this.errorElement);
  }

  private removeErrorElement() {
    if (this.errorElement && this.errorElement.parentNode) {
      this.errorElement.parentNode.removeChild(this.errorElement);
      this.errorElement = null;
    }
  }
} 