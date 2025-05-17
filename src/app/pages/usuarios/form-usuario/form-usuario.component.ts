import { UserService } from './../../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

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
    private _user: UserService
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
      name: ['', [Validators.required]],
      code: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      role: ['worker', Validators.required],
      junior: [false],
      password: ['']
    });
  }
  async cargarUsuario(id: string) {
    const req = await this._user.getUserById(id);
    req.subscribe(({ ok, data }) => {
      if (ok && data.user) {
        const u = data.user;
        this.usuarioForm.patchValue({
          name: u.name, code: u.code, email: u.email,
          phone: u.phone, role: u.role, junior: u.junior
        });
      }
    });
  }

  async guardar() {
    if (this.usuarioForm.invalid) { return; }

    const data = this.usuarioForm.value;
    try {
      const req = this.isEdit
        ? await this._user.updateUser({ ...data, _id: this.usuarioId! })
        : this._user.createUser(data);

      req.subscribe(({ ok }) => ok && this.navCtrl.navigateRoot('/usuarios'));


    } catch (error) {
      console.error('Error al guardar usuario:', error);
    }
  }

  cancelar() {
    // Navegar de vuelta a la lista de usuarios
    this.navCtrl.navigateBack('/usuarios');
  }
}
