import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { catchError, map, throwError } from 'rxjs';
import { Soporte } from '../interfaces/soporte';

@Injectable({
  providedIn: 'root'
})
export class SoporteService {
private http = inject(HttpClient);
  private apiUrl:string = environment.apiUrl+"soporte"
  
  constructor() { }

  lista(){
    return this.http.get<{ success: boolean; data: Soporte[] }>(this.apiUrl).pipe(
      map(response => response.data),
      catchError(err =>{
        console.log("error",err);
        return throwError(()=>new Error("error al obtener las Soporte"))
      })
    );
  }
  obtener(id:string){
    return this.http.get<{ success: boolean; data: Soporte[] }>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data[0]),
      catchError(err =>{
        console.log("error",err);
        return throwError(()=>new Error("error al obtener las Soporte"))
      })
    );
  }
  crear(objeto:Soporte){
    return this.http.post<Response>(this.apiUrl,objeto);
  }
  editar(objeto:Soporte){
    return this.http.put<Response>(this.apiUrl,objeto);
  }
  eliminar(id:string){
    return this.http.delete<Soporte[]>(`${this.apiUrl}/${id}`);
  }
}
