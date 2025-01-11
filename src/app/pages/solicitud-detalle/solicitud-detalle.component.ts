import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {MatSelectModule} from '@angular/material/select';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';
import { SolicitudService } from '../../services/solicitud.service';
import { Solicitud } from '../../interfaces/solicitud';
import { Requerimiento } from '../../interfaces/requerimiento';
import { RequerimientoService } from '../../services/requerimiento.service';
import { SoporteService } from '../../services/soporte.service';
import { Soporte } from '../../interfaces/soporte';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, map } from 'rxjs';

import { MatNativeDateModule } from '@angular/material/core';
import {FormsModule} from '@angular/forms';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
@Component({
  selector: 'app-solicitud-detalle',
  standalone: true,
  imports: [MatNativeDateModule,FormsModule,MatDatepickerModule,CommonModule,MatInputModule,MatFormFieldModule,MatIconModule,MatButtonModule,ReactiveFormsModule,MatCardModule,MatTableModule,MatSelectModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './solicitud-detalle.component.html',
  styleUrl: './solicitud-detalle.component.scss'
})
export class SolicitudDetalleComponent implements OnInit {
  @Input('id') idSolicitud!: string;
  public idSoporte: string = '';
  public listaSolicitud: Solicitud[] = [];
  public listaRequerimiento: Requerimiento[] = [];
  public displayedColumns: string[] = ["comentario", "estado", "tecnico", "fecha_solucion"];
  public estados: string[] = ['Creado', 'Asignado', 'En Proceso', 'Finalizado'];
  public listaSoporte: Soporte[] = [];

  constructor(
    private solicitudServicio: SolicitudService,
    private requerimientoServicio: RequerimientoService,
    private soporteServicio: SoporteService,
    public formBuild: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  public formSolicitud: FormGroup = this.formBuild.group({
    nombre: [''],
    apellido: [''],
    correo: [''],
    fecha_ingres: [''],
    solicitud: [''],
    tecnico: [''],
  });

  public formRequerimiento: FormGroup = this.formBuild.group({
    comentario: [''],
    estado: [''],
    fecha_solucion: [null]
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id && !isNaN(Number(id))) {
        this.idSolicitud = id;
      } else {
        console.error('El ID de la solicitud no es válido');
        this.router.navigate(['/error']); // Redirigir a una página de error
      }
    });
    if (!this.idSolicitud) {
      console.error('El idSolicitud es inválido o no se ha asignado');
      return;
    }
console.log(this.idSolicitud)
    this.solicitudServicio.obtener(this.idSolicitud).subscribe({
      next: (data) => {
        if (data) {
          this.formSolicitud.patchValue({
            nombre: data[0].nombre,
            apellido: data[0].apellido,
            correo: data[0].correo,
            fecha_ingres: data[0].fecha_ingres,
            solicitud: data[0].solicitud
          });
        }
      },
      error: (err) => {
        console.error('Error al obtener las solicitudes:', err.message);
      },
    });
    this.requerimientoServicio.obtener(this.idSolicitud).subscribe({
      next: (data) => {
        if (data.length > 0) {
          // Crear un array de observables para obtener los datos de soporte
          const soporteObservables = data.map((item: any) => {
            console.log('Procesando item:', item); // Verificar el contenido del item
            return this.soporteServicio.obtener(item.soporte_id.toString()).pipe(
              map((soporteData: any) => {
                console.log('Datos del soporte recibido:', soporteData); // Verificar el soporteData
                this.idSoporte = soporteData.id;
                return {
                  solicitud_id: item.solicitud_id,
                  soporte_id: item.soporte_id,
                  comentario: item.comentario,
                  estado: item.estado,
                  tecnico: (soporteData.nombre || 'Sin nombre') + ' ' + (soporteData.apellido || ''), // Combinar nombre y apellido
                  fecha_solucion: item.fecha_solucion
                };
              })
            );
          });
    
          // Usar forkJoin para esperar todas las solicitudes de soporte
          forkJoin(soporteObservables).subscribe({
            next: (result) => {
              this.listaRequerimiento = result; // Asignar los datos combinados
              console.log('Lista de requerimientos:', this.listaRequerimiento);
            },
            error: (err) => {
              console.error('Error al obtener datos de soporte:', err.message);
            },
          });
        }
      },
      error: (err) => {
        console.error('Error al obtener los requerimientos:', err.message);
      },
    });
  }


  guardar() {
    const fechaSolucion = this.formRequerimiento.get('fecha_solucion')?.value;

    const objeto: Requerimiento = {
      solicitud_id: this.idSolicitud,
      soporte_id: this.idSoporte.toString(),
      comentario: this.formRequerimiento.get('comentario')?.value,
      estado: this.formRequerimiento.get('estado')?.value,
      fecha_solucion: fechaSolucion ? this.formatDate(new Date(fechaSolucion)) : null // Formatear la fecha
    };

    this.requerimientoServicio.crear(objeto).subscribe({
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

  volver(objeto:Solicitud){
    this.router.navigate(['/'])
  }
}