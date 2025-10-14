import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  imports: [CommonModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})

export class InicioComponent {

  constructor(public router:Router){

  }

  public irLogin(){
    this.router.navigate(["/login"]);
  }

  public irRegistro(){
    this.router.navigate(["/registro"])
  }

}