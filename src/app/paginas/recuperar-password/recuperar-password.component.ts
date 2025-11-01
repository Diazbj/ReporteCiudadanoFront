import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../servicios/auth.service';
import Swal from 'sweetalert2';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../login/login.component';
import { UsuarioNuevoCodigoDTO } from '../../dto/usuarios/usuario-nuevo-codigo-dto';

@Component({
  selector: 'app-recuperar-password',
  standalone:true,
  imports: [ReactiveFormsModule, RouterOutlet, RouterModule, CommonModule],

  templateUrl: './recuperar-password.component.html',
  styleUrls: ['./recuperar-password.component.css']
})
export class RecuperarPasswordComponent {

  recuperarForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.recuperarForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      codigo: ['', Validators.required],
      nuevoPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmarPassword: ['', Validators.required]
    }, {
      validators: [this.passwordsIgualesValidator]
    });
  }

  onSubmit(): void {
    if (this.recuperarForm.invalid) return;

    const datos = this.recuperarForm.value;

    this.authService.actualizarPassword(datos).subscribe({
      next: (resp) => {
        Swal.fire({
          icon: 'success',
          title: 'Contraseña actualizada',
          text: 'Tu contraseña ha sido cambiada exitosamente.',
          confirmButtonText: 'Iniciar sesión'
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (err) => {
        const mensaje = typeof err.error === 'string' ? err.error : 'Error al cambiar la contraseña.';
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: mensaje,
          confirmButtonText: 'Cerrar'
        });
      }
    });
  }

  passwordsIgualesValidator(form: FormGroup) {
    const pass = form.get('nuevoPassword')?.value;
    const confirm = form.get('confirmarPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  cancelar(): void {
    this.router.navigate(['/']);
  }

  enviarCodigo(): void {
    const email = this.recuperarForm.get('email')?.value;

    if (!email || this.recuperarForm.get('email')?.invalid) {
      Swal.fire('Correo requerido', 'Por favor ingresa un correo válido.', 'warning');
      return;
    }

    const dto = { email } as UsuarioNuevoCodigoDTO;

    this.authService.recuperarPassword(dto).subscribe({
      next: () => {
        Swal.fire('Código enviado', 'Revisa tu correo para obtener el código.', 'success');
      },
      error: (err) => {
        const mensaje = typeof err.error === 'string' ? err.error : 'Error al enviar el código.';
        Swal.fire('Error', mensaje, 'error');
      }
    });
  }

}