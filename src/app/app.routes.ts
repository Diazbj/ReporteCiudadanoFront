import { Routes } from '@angular/router';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { LoginComponent } from './paginas/login/login.component';
import { RegistroComponent } from './paginas/usuarios/registro/registro.component';
import { HomeUsuarioComponent } from './paginas/home-usuario/home-usuario.component';


export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  {
    path: 'home-usuario',
    component: HomeUsuarioComponent,
    children: [
      { path: '', redirectTo: 'home-usuario-inicio-reportes', pathMatch: 'full' }, // Redirige a 'categorias' por defecto

    ]
  },

  
];