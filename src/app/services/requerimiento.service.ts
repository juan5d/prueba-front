import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { catchError, map, throwError } from 'rxjs';
import { Requerimiento } from '../interfaces/requerimiento';

@Injectable({
  providedIn: 'root'
})
export class RequerimientoService {

  private http = inject(HttpClient);
  private apiUrl:string = environment.apiUrl+"requerimiento"
  
  constructor() { }

  lista(){
    return this.http.get<{ success: boolean; data: Requerimiento[] }>(this.apiUrl).pipe(
      map(response => response.data),
      catchError(err =>{
        console.log("error",err);
        return throwError(()=>new Error("error al obtener los Requerimientos"))
      })
    );
  }
  obtener(id:string){
      return this.http.get<{ success: boolean; data: Requerimiento[] }>(`${this.apiUrl}/${id}`).pipe(
        map(response => response.data),
        catchError(err =>{
          console.log("error",err);
          return throwError(()=>new Error("error al obtener las solicitudes"))
        })
      );
    }
  crear(objeto:Requerimiento){
    return this.http.post<Requerimiento>(this.apiUrl,objeto);
  }
  editar(objeto:Requerimiento){
    return this.http.put<Response>(this.apiUrl,objeto);
  }
  eliminar(id:string){
    return this.http.delete<Requerimiento[]>(`${this.apiUrl}/${id}`);
  }
}
