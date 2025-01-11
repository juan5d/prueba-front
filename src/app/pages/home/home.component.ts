import { Component, inject } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { SolicitudService } from '../../services/solicitud.service';
import { Solicitud } from '../../interfaces/solicitud';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule,MatTableModule,MatIconModule,MatButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  public listaSolicitud:Solicitud[]=[]
  public displayedColumns: string[] = ["nombre","apellido","correo","fecha","accion"]

  constructor(
    private solicitudServicio: SolicitudService,
    private router:Router)
    {}
  ngOnInit() {
    this.obtenerSolicitudes(); // Llamar al método para cargar los datos al inicio
  }

  obtenerSolicitudes() {
    this.solicitudServicio.lista().subscribe({
      next: (data) => {
        if (data.length > 0) {
          this.listaSolicitud = data;
        }
      },
      error: (err) => {
        console.error('Error al obtener las solicitudes:', err.message);
      },
    });
  }

  nuevo(){
    this.router.navigate(['/solicitud/crear'])
  }

  editar(objeto:Solicitud){
    this.router.navigate(['/solicitud',objeto.id])
  }

  detalle(objeto:Solicitud){
    this.router.navigate(['/solicitud/detalle',objeto.id])
  }

  
}
