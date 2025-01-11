import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { Solicitud } from '../interfaces/solicitud';
import { catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {
  private http = inject(HttpClient);
  private apiUrl: string = `${environment.apiUrl}solicitud`;

  private handleError(operation: string) {
    return (err: any) => {
      console.error(`${operation} falló:`, err);
      return throwError(() => new Error(err.error?.message || `Error al realizar ${operation}`));
    };
  }

  lista() {
    return this.http.get<{ success: boolean; data: Solicitud[] }>(this.apiUrl).pipe(
      map((response) => response.data),
      catchError(this.handleError('obtener la lista de solicitudes'))
    );
  }

  obtener(id: string) {
    return this.http.get<{ success: boolean; data: Solicitud[] }>(`${this.apiUrl}/${id}`).pipe(
      map((response) => response.data),
      catchError(this.handleError('obtener la solicitud'))
    );
  }

  crear(objeto: Solicitud) {
    return this.http.post<{ success: boolean; data: Solicitud }>(this.apiUrl, objeto).pipe(
      map((response) => response.data),
      catchError(this.handleError('crear la solicitud'))
    );
  }

  editar(objeto: Solicitud) {
    return this.http.put<{ success: boolean; data: Solicitud }>(this.apiUrl, objeto).pipe(
      map((response) => response.data),
      catchError(this.handleError('editar la solicitud'))
    );
  }

  eliminar(id: string) {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${id}`).pipe(
      map((response) => response.success),
      catchError(this.handleError('eliminar la solicitud'))
    );
  }
}