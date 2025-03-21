import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-crear-ruta-calendario',
  standalone: false,
  templateUrl: './crear-ruta-calendario.component.html',
  styleUrls: ['./crear-ruta-calendario.component.scss'],
})
export class CrearRutaCalendarioComponent implements OnInit {
  date: string = '';
  name: string = '';
  type: string = '';

  // Si tu ruta requiere más datos (vehículo, trabajadores, etc.), declara aquí
  // vehicle: any = {};
  // users: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    // Obtenemos la fecha enviada como parámetro en la URL
    this.date = this.route.snapshot.paramMap.get('date') || '';
  }

  async onCreateRuta() {
    let rutaExiste: boolean = false
    let idRuta: any
    try {
      let rutasN: any = []
      const res = await this.apiService.getRutasN();
      res.subscribe(async (res: any) => {
        if (res.ok) {
          rutasN = res.rutas

          rutasN.forEach((element: any) => {
            if (element.name == this.name) {
              console.log("existe")
              rutaExiste = true
              idRuta = element._id
              console.log(this.name)
            }
          });

          if (rutaExiste == false) {
            console.error('Error al crear la ruta. No existe.');
            return;
          }

          const data = {
            date: this.date,
            name: idRuta,
            type: this.type
            // ...incluye aquí más campos si tu API los necesita
          };
          // Llamada al servicio que crea la ruta
          const req = await this.apiService.createRuta(data);
          req.subscribe((res: any) => {
            if (res.ok && res.ruta) {
              // Al crear la ruta con éxito, navegamos de vuelta al calendario
              this.navCtrl.navigateRoot('/calendario');
            } else {
              console.error('Error al crear la ruta:', res?.message);
            }
          });

        }
      })




    } catch (error) {
      console.error('Error al crear la ruta:', error);
    }
  }

  cancelar() {
    // Si el usuario cancela, regresa al calendario
    this.navCtrl.back();
  }
}
