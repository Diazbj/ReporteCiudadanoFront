import { Routes } from '@angular/router';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { LoginComponent } from './paginas/login/login.component';
import { RegistroComponent } from './paginas/usuarios/registro/registro.component';
import { ActivarUsuarioComponent } from './paginas/usuarios/activar-usuario/activar-usuario.component';
import { PerfilComponent } from './paginas/usuarios/perfil/perfil.component';
import { ActualizarPasswordComponent } from './paginas/usuarios/actualizar-password/actualizar-password.component';
import { RecuperarPasswordComponent } from './paginas/recuperar-password/recuperar-password.component';
import { CrearReporteComponent } from './paginas/reportes/crear-reporte/crear-reporte.component';
import { EditarReporteComponent } from './paginas/usuarios/editar-reporte/editar-reporte.component';
import { VerReporteComponent } from './paginas/reportes/ver-reporte/ver-reporte.component';
import { ListarReportesComponent } from './paginas/reportes/listar-reportes/listar-reportes.component';
import { CategoriasComponent } from './paginas/categorias/categorias.component';
import { HistorialEstadosComponent } from './paginas/reportes/historial-estados/historial-estados.component';
import { HomeUsuarioComponent } from './paginas/home-usuario/home-usuario.component';
import { HomeUsuarioInicioReportesComponent } from './paginas/home-usuario-inicio-reportes/home-usuario-inicio-reportes.component';
import { ReportesUsuarioComponent } from './paginas/usuarios/reportes-usuario/reportes-usuario.component';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'activar-usuario', component: ActivarUsuarioComponent },
  { path: 'recuperar-password', component: RecuperarPasswordComponent },
  {
    path: 'home-usuario',
    component: HomeUsuarioComponent,
    children: [
      { path: '', redirectTo: 'home-usuario-inicio-reportes', pathMatch: 'full' }, // Redirige a 'categorias' por defecto
      { path: 'home-usuario-inicio-reportes', component: HomeUsuarioInicioReportesComponent },
      { path: 'perfil', component: PerfilComponent },
      { path: 'actualizar-password', component: ActualizarPasswordComponent },
      { path: 'categorias', component: CategoriasComponent },
      { path: 'editar-reporte/:id', component: EditarReporteComponent },
      { path: 'reporte/:id', component: VerReporteComponent },
      { path: 'reportes', component: ListarReportesComponent },
      { path: 'reportesUsuario' ,component: ReportesUsuarioComponent},
      { path: 'historial-estados/:idReporte', component: HistorialEstadosComponent },
      { path: 'crear-reporte', component: CrearReporteComponent}
    ]
  },

  
];