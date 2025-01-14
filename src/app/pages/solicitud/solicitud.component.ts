import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SolicitudService } from '../../services/solicitud.service';
import { RequerimientoService } from '../../services/requerimiento.service';
import { SoporteService } from '../../services/soporte.service';
import { Solicitud } from '../../interfaces/solicitud';
import { Requerimiento } from '../../interfaces/requerimiento';
import { Soporte } from '../../interfaces/soporte';

@Component({
  selector: 'app-solicitud',
  standalone: true,
  imports: [MatInputModule,MatFormFieldModule,MatIconModule,MatButtonModule,ReactiveFormsModule,MatCardModule,MatTableModule,MatSelectModule],
  templateUrl: './solicitud.component.html',
  styleUrl: './solicitud.component.scss'
})
export class SolicitudComponent implements OnInit {
  
public idSolicitud!: string;
  public listaSolicitud: Solicitud[] = [];
  public listaRequerimiento: Requerimiento[] = [];
  public listaSoporte: Soporte[] = [];
  public displayedColumns: string[] = ['comentario', 'estado', 'fecha solucion'];

  public formSolicitud: FormGroup;

  constructor(
    private solicitudServicio: SolicitudService,
    private requerimientoServicio: RequerimientoService,
    private soporteServicio: SoporteService,
    public formBuild: FormBuilder,
    private router: Router, // Importa de '@angular/router'
    private route: ActivatedRoute
  ) {
    this.formSolicitud = this.formBuild.group({
      nombre: [''],
      apellido: [''],
      correo: [''],
      fecha_ingres: [''],
      solicitud: [''],
      tecnico: [''],
    });
  }

  ngOnInit(): void {

  }

  guardar() {
    const fechaIngres = this.formSolicitud.get('fecha_ingres')?.value;

    const objeto: Solicitud = {
      nombre: this.formSolicitud.get('nombre')?.value,
      apellido: this.formSolicitud.get('apellido')?.value,
      correo: this.formSolicitud.get('correo')?.value,
      solicitud: this.formSolicitud.get('solicitud')?.value,
      fecha_ingres: fechaIngres ? this.formatDate(new Date(fechaIngres)) : null // Formatear la fecha
    };

    this.solicitudServicio.crear(objeto).subscribe({
      next:(data)=>{
          this.router.navigate(["/"]);
      }
    })
    console.log('Objeto a guardar:', objeto);
    // Llama al servicio para guardar el objeto
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Meses van de 0 a 11, por eso sumamos 1
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  volver(){
    this.router.navigate(['/'])
  }
}