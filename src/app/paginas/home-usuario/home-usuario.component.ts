import { Component } from '@angular/core';
import { MenuComponent } from '../../componentes/menu/menu.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-usuario',
  imports: [MenuComponent, RouterModule],
  templateUrl: './home-usuario.component.html',
  styleUrl: './home-usuario.component.css'
})

export class HomeUsuarioComponent {

}
