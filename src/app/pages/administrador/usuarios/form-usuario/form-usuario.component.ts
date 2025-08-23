
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-form-usuario',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  templateUrl: './form-usuario.component.html',
  styleUrls: ['./form-usuario.component.scss']
})
export class FormUsuarioComponent implements OnInit {

  usuarioForm!: FormGroup;
  isEdit = false;
  usuarioId: string | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _user: UserService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.initForm();

    // Revisar si hay :id en la ruta, para modo edición
    this.route.paramMap.subscribe(params => {
      this.usuarioId = params.get('id');
      if (this.usuarioId) {
        this.isEdit = true;
        this.cargarUsuario(this.usuarioId);
      }
    });
  }

  initForm() {
    this.usuarioForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s-()]+$/)]],
      address: ['', [Validators.required, Validators.minLength(10)]],
      role: ['vecino', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      active: [true]
    }, { validators: this.passwordMatchValidator });
  }

  // Validador personalizado para confirmar contraseña
  passwordMatchValidator(control: AbstractControl): {[key: string]: any} | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { 'passwordMismatch': true };
    }
    return null;
  }

  async cargarUsuario(id: string) {
    try {
    const req = await this._user.getUserById(id);
    req.subscribe(({ ok, data }) => {
      if (ok && data.user) {
        const u = data.user;
        this.usuarioForm.patchValue({
            name: u.name,
            email: u.email,
            phone: u.phone,
            address: u.address || '',
            role: u.role,
            active: u.active !== false
          });

          // Remover validación de contraseña en modo edición
          this.usuarioForm.get('password')?.clearValidators();
          this.usuarioForm.get('confirmPassword')?.clearValidators();
          this.usuarioForm.get('password')?.updateValueAndValidity();
          this.usuarioForm.get('confirmPassword')?.updateValueAndValidity();
      }
    });
    } catch (error) {
      console.error('Error al cargar usuario:', error);
      this.showToast('Error al cargar los datos del usuario', 'danger');
    }
  }

  async guardar() {
    if (this.usuarioForm.invalid) {
      this.showToast('Por favor, completa todos los campos requeridos', 'warning');
      return;
    }

    this.loading = true;
    const formData = this.usuarioForm.value;

    try {
      // Preparar datos para envío
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        role: formData.role,
        password: formData.password,
        active: formData.active
      };

      const req = this.isEdit
        ? await this._user.updateUser({ ...userData, _id: this.usuarioId! })
        : this._user.createUser(userData);

      req.subscribe(({ ok, message }) => {
        this.loading = false;
        if (ok) {
          this.showToast(
            this.isEdit ? 'Usuario actualizado exitosamente' : 'Vecino creado exitosamente',
            'success'
          );
          this.router.navigate(['/administrador/usuarios/lista']);
        } else {
          this.showToast(message || 'Error al guardar el usuario', 'danger');
        }
      });

    } catch (error) {
      this.loading = false;
      console.error('Error al guardar usuario:', error);
      this.showToast('Error inesperado al guardar el usuario', 'danger');
    }
  }

  cancelar() {
    this.router.navigate(['/administrador/usuarios/lista']);
  }

  async showToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top'
    });
    toast.present();
  }

  // Getters para validación en el template
  get nameError(): string {
    const control = this.usuarioForm.get('name');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'El nombre es requerido';
      if (control.errors['minlength']) return 'El nombre debe tener al menos 2 caracteres';
    }
    return '';
  }

  get emailError(): string {
    const control = this.usuarioForm.get('email');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'El email es requerido';
      if (control.errors['email']) return 'Ingresa un email válido';
    }
    return '';
  }

  get passwordError(): string {
    const control = this.usuarioForm.get('password');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'La contraseña es requerida';
      if (control.errors['minlength']) return 'La contraseña debe tener al menos 6 caracteres';
    }
    return '';
  }

  get confirmPasswordError(): string {
    const control = this.usuarioForm.get('confirmPassword');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Confirma la contraseña';
    }
    return '';
  }

  get passwordMismatchError(): boolean {
    return this.usuarioForm.errors?.['passwordMismatch'] &&
           this.usuarioForm.get('confirmPassword')?.touched;
  }
}
