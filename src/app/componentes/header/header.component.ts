import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TokenService } from '../../servicios/token.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(private tokenService: TokenService) { }

  public isLoggedIn(): boolean {
    return this.tokenService.isLogged();
  }

  public logout() {
    this.tokenService.logout();
  }

  public isAdmin(): boolean {
    return this.tokenService.getRol() === 'ROLE_MODERADOR';
  }
}
