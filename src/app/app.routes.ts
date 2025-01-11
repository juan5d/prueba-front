import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SolicitudDetalleComponent } from './pages/solicitud-detalle/solicitud-detalle.component';
import { SolicitudComponent } from './pages/solicitud/solicitud.component';

export const routes: Routes = [
    {path:'', component:HomeComponent},
    {path:'home', component:HomeComponent},
    {path:'solicitud/crear', component:SolicitudComponent},
    {path:'solicitud/detalle/:id', component:SolicitudDetalleComponent},
];
