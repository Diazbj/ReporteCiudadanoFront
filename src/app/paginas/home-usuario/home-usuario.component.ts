import { Component } from '@angular/core';
import { HeaderComponent } from '../../componentes/header/header.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-usuario',
  standalone: true,
  imports: [HeaderComponent, RouterModule],
  templateUrl: './home-usuario.component.html',
  styleUrl: './home-usuario.component.css'
})

export class HomeUsuarioComponent {

}
