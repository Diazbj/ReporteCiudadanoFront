import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { TokenService } from './service/token.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RouterModule,ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'ProyectoAlertas';
  footer = 'Universidad del Quindío  2025-1';
  isUserLogged: boolean = false;

  constructor(private tokenService: TokenService) {
  }

  ngOnInit() {
    this.isUserLogged = this.tokenService.isLogged();
  }
}