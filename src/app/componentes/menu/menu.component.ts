import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../../service/token.service';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../service/usuario.service';
import { MensajeDTO } from '../../dto/mensaje-dto';

@Component({
  selector: 'app-menu',
  imports: [],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})

export class MenuComponent {

  constructor(public router: Router, public tokenService: TokenService, public usuarioServicio: UsuarioService) {
    
  }

  public eliminarUsuario(){
    Swal.fire({
      icon: 'warning',
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará tu usuario. ¿Deseas continuar?',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if(result.isConfirmed){
        this.usuarioServicio.eliminarUsuario().subscribe({
          next: (respuesta: MensajeDTO) => {
            Swal.fire({
              icon: 'success',
              title: 'Usuario Eliminado',
              text: 'Tu usuario ha sido eliminado exitosamente.',
              confirmButtonText: 'OK'
            }).then(() => {
              this.cerrarSesion();
            });
          },
          error: (error) => {
            const mensaje = typeof error.error === 'string' ? error.error : 'Error al actualizar el usuario.';
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: mensaje,
              confirmButtonText: 'Cerrar'
            });
          }
        });
      }
    });
  }

  public cerrarSesion(): void {
    this.tokenService.logout();
  }

  public isAdmin():boolean{
    if(this.tokenService.getRol() == "ROLE_CLIENTE"){
      return false;
    } else {
      return true;
    }
  }

}