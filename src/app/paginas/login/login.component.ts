import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { TokenService } from '../../servicios/token.service';
import { LoginDTO } from '../../dto/login-dto';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { UsuarioNuevoCodigoDTO } from '../../dto/usuarios/usuario-nuevo-codigo-dto';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

  loginForm!: FormGroup;
  cargando: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    private authService: AuthService,
    private tokenService: TokenService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  public login() {
    this.cargando = true;

    // Espera 1 segundo antes de hacer la petición al backend
    setTimeout(() => {
      const loginDTO = this.loginForm.value as LoginDTO;
      this.authService.iniciarSesion(loginDTO).subscribe({
        next: (data) => {
          this.tokenService.login(data.mensaje.token);
          console.log('Token recibido:', data.mensaje.token);
          console.log('Token almacenado:', sessionStorage.getItem("AuthToken"));
          console.log(data.mensaje.token);
          this.cargando = false; // Oculta el spinner
        },
        error: (error) => {
          this.cargando = false;

          const mensaje = typeof error.error === 'string' ? error.error : 'Ocurrió un error inesperado.';

          if (mensaje === 'El usuario no esta activo') {
            Swal.fire({
              icon: 'warning',
              title: 'Cuenta no verificada',
              text: '¿Deseas que te enviemos un nuevo código de activación?',
              showCancelButton: true,
              confirmButtonColor: '#ffc107',
              cancelButtonText: 'Cancelar',
              confirmButtonText: 'Sí, reenviar código'
            }).then(result => {
              if (result.isConfirmed) {
                this.enviarNuevoCodigoActivacion();
              }
            });
          }
          else if (mensaje === 'Usuario o contraseña incorrectos') {
            Swal.fire({
              icon: 'error',
              title: 'Credenciales inválidas',
              text: 'La contraseña ingresada es incorrecta.',
              confirmButtonColor: '#dc3545',
              confirmButtonText: 'Reintentar'
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error al iniciar sesión',
              text: mensaje || 'Ocurrió un error inesperado. Inténtalo de nuevo más tarde.',
              confirmButtonColor: '#dc3545',
              confirmButtonText: 'Cerrar'
            });
          }
        }
        ,
      });
    }, 1000); // 1 segundo de espera
  }

  public enviarNuevoCodigoActivacion(): void {
    const email = this.loginForm.get('email')?.value;

    if (!email) {
      Swal.fire('Correo requerido', 'Por favor ingresa tu correo electrónico.', 'warning');
      return;
    }

    const dto = { email } as UsuarioNuevoCodigoDTO;

    this.authService.recuperarPassword(dto).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Código enviado',
          text: 'Se ha enviado un nuevo código de verificación a tu correo.',
          confirmButtonText: 'Ir a Activación',
          confirmButtonColor: '#198754'
        }).then(() => {
          this.router.navigate(['/activar-usuario'], { queryParams: { email } });
        });
      },
      error: () => {
        Swal.fire('Error', 'No se pudo generar un nuevo código. Inténtalo más tarde.', 'error');
      }
    });
  }
  
  public goToInicio() {
    this.router.navigate(["/"]);
  }

}