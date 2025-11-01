import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../servicios/usuario.service';
import Swal from 'sweetalert2';
import { UsuarioActivacionDTO } from '../../../dto/usuarios/usuario-activacion-dto';

@Component({
  selector: 'app-activar-usuario',
  imports: [ReactiveFormsModule],
  templateUrl: './activar-usuario.component.html',
  styleUrls: ['./activar-usuario.component.css']
})

export class ActivarUsuarioComponent {

  activarForm!: FormGroup;
   
  constructor(private formBuilder: FormBuilder, public router: Router,private usuarioService: UsuarioService){
    this.activarForm = this.formBuilder.group({
      correoElectronicoUsuario: ['', [Validators.required]],
      codigoAutenticacionUsuario: ['', [Validators.required]]
    });
  }

  public activarUsuario(): void {
    if (this.activarForm.invalid) return;

    const datos: UsuarioActivacionDTO = {
    email: this.activarForm.value.correoElectronicoUsuario,
    codigo: this.activarForm.value.codigoAutenticacionUsuario
    };

    this.usuarioService.activarCuenta(datos).subscribe({
      next: (resp) => {
        Swal.fire({
          icon: 'success',
          title: 'Cuenta activada',
          text: 'Tu cuenta ha sido activada exitosamente. Ahora puedes iniciar sesión.',
          confirmButtonText: 'Ir al login',
          confirmButtonColor: '#198754'
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (err) => {
        const mensaje = typeof err.error === 'string' ? err.error : 'Error al activar cuenta.';
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: mensaje,
          confirmButtonText: 'Cerrar',
          confirmButtonColor: '#dc3545'
        });
      }
    });
  }

  public goToInicio(){
    this.router.navigate(["/"]);
  }

}