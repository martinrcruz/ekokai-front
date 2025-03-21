import { UserService } from './../../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-form-usuario',
  standalone: false,
  templateUrl: './form-usuario.component.html',
  styleUrls: ['./form-usuario.component.scss']
})
export class FormUsuarioComponent implements OnInit {

  usuarioForm!: FormGroup;
  isEdit = false;
  usuarioId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private authService: AuthService,
    private apiService: ApiService,
    private userService: UserService
  ) {}

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
      name:       ['', [Validators.required]],
      code:       ['', [Validators.required]],
      email:      ['', [Validators.required, Validators.email]],
      phone:      ['', Validators.required],
      role:       ['worker', Validators.required],
      junior:     [false],
      password:   ['', [Validators.required]]
    });
  }

  async cargarUsuario(id: string) {
    try {
      const req = await this.apiService.getUserById(id);
      req.subscribe((res: any) => {
        if (res.ok && res.user) {
          // Cargar datos en el form
          this.usuarioForm.patchValue({
            name:     res.user.name,
            code:     res.user.code,
            email:    res.user.email,
            phone:    res.user.phone,
            role:     res.user.role,
            junior:   res.user.junior,
            // password: '' -> No solemos mostrar la pass real
          });
        }
      });
    } catch (error) {
      console.error('Error al cargar usuario:', error);
    }
  }

  async guardar() {
    if (this.usuarioForm.invalid) { return; }

    const data = this.usuarioForm.value;
    try {
      if (!this.isEdit) {
        // Crear usuario
        const req = await this.userService.createUser(data);
        req.subscribe((resp: any) => {
          if (resp.ok) {
            this.navCtrl.navigateRoot('/usuarios');
          }
        });
      } else {
        // Actualizar usuario
        // Se suele incluir el id en el body, o como param en la API
        data._id = this.usuarioId;
        const req = await this.userService.updateUser(data);
        req.subscribe((resp: any) => {
          if (resp.ok) {
            this.navCtrl.navigateRoot('/usuarios');
          }
        });
      }
    } catch (error) {
      console.error('Error al guardar usuario:', error);
    }
  }
}
