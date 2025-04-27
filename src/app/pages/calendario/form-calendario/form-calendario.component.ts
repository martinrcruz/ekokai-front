import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { CalendarioService } from '../../../services/calendario.service';
import { RutasService } from '../../../services/rutas.service';

@Component({
  selector: 'app-form-calendario',
  standalone: false,
  templateUrl: './form-calendario.component.html',
  styleUrls: ['./form-calendario.component.scss'],
})
export class FormCalendarioComponent  implements OnInit {

  calendarioForm!: FormGroup;
  isEdit = false;
  eventoId: string | null = null;
  fecha: string = '';
  rutas: any[] = [];
  partesNoAsignados: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private calendarioService: CalendarioService,
    private rutasService: RutasService
  ) {}

  ngOnInit() {
    this.initForm();
    this.route.paramMap.subscribe(params => {
      this.eventoId = params.get('id');
      if (this.eventoId) {
        this.isEdit = true;
        this.cargarEvento(this.eventoId);
      }
    });
  }

  initForm() {
    // Ajusta campos según tu modelo de eventos
    this.calendarioForm = this.fb.group({
      title:  ['', Validators.required],
      start:  ['', Validators.required],
      end:    [''],  // O required, según tu lógica
      allDay: [false]
    });
  }

  async cargarEvento(id: string) {
    // try {
    //   const req = await this.apiService.getCalendarEventById(id); // Ajusta si tienes un endpoint
    //   req.subscribe((res: any) => {
    //     if (res.ok && res.evento) {
    //       this.calendarioForm.patchValue({
    //         title:  res.evento.title,
    //         start:  res.evento.start,
    //         end:    res.evento.end,
    //         allDay: res.evento.allDay
    //       });
    //     }
    //   });
    // } catch (error) {
    //   console.error('Error al cargar evento calendario:', error);
    // }
  }

  async guardar() {
    // if (this.calendarioForm.invalid) return;

    // const data = this.calendarioForm.value;
    // try {
    //   if (!this.isEdit) {
    //     // Crear evento
    //     const req = await this.apiService.createCalendarEvent(data);
    //     req.subscribe((resp: any) => {
    //       if (resp.ok) {
    //         this.navCtrl.navigateRoot('/calendario');
    //       }
    //     });
    //   } else {
    //     // Actualizar evento
    //     data._id = this.eventoId;
    //     const req = await this.apiService.updateCalendarEvent(data);
    //     req.subscribe((resp: any) => {
    //       if (resp.ok) {
    //         this.navCtrl.navigateRoot('/calendario');
    //       }
    //     });
    //   }
    // } catch (error) {
    //   console.error('Error al guardar evento calendario:', error);
    // }
  }

  async loadRutas() {
    try {
      const req = await this.calendarioService.getRutasByDate(this.fecha);
      req.subscribe(
        (res: any) => {
          if (res.ok) {
            this.rutas = res.rutas;
          }
        },
        (error) => {
          console.error('Error al cargar rutas:', error);
        }
      );
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async loadPartesNoAsignados() {
    try {
      const req = await this.calendarioService.getPartesNoAsignadosEnMes(this.fecha);
      req.subscribe(
        (res: any) => {
          if (res.ok) {
            this.partesNoAsignados = res.partes;
          }
        },
        (error) => {
          console.error('Error al cargar partes no asignados:', error);
        }
      );
    } catch (error) {
      console.error('Error:', error);
    }
  }

}
