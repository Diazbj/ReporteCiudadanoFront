import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../../servicios/token.service';

@Component({
  selector: 'app-inicio',
  imports: [CommonModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})

export class InicioComponent implements OnInit {

  constructor(public router: Router, private tokenService: TokenService) { }

  ngOnInit(): void {
    if (this.tokenService.isLogged()) {
      this.router.navigate(['/home-usuario/home-usuario-inicio-reportes']);
    }
  }

  public irLogin() {
    this.router.navigate(["/login"]);
  }

  public irRegistro() {
    this.router.navigate(["/registro"])
  }

}
