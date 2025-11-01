import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../../servicios/usuario.service';

@Component({
  selector: 'app-actualizar-password',
  imports: [RouterModule,ReactiveFormsModule],
  templateUrl: './actualizar-password.component.html',
  styleUrl: './actualizar-password.component.css'
})

export class ActualizarPasswordComponent {
  actualizarPasswordForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, public router: Router, private usuarioService: UsuarioService){
    this.actualizarPasswordForm = this.formBuilder.group({
      actualPassword: ['', [Validators.required]],
      nuevoPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  public onSubmit(){
    const datos = this.actualizarPasswordForm.value;
    this.usuarioService.cambiarPassword(datos).subscribe({
      next: (resp) => {
        Swal.fire({
          icon: 'success',
          title: 'Contraseña actualizada',
          text: 'Tu contraseña ha sido cambiada exitosamente.',
          confirmButtonText: 'Iniciar sesión'
        }).then(() => {
          //this.router.navigate(['/login']);
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

  public cancelar(){
    this.router.navigate(["/home-usuario"]);
  }

}