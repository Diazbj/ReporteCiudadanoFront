import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../../servicios/usuario.service';
import { CrearUsuarioDTO } from '../../../dto/usuarios/crear-usuario-dto';
import { MensajeDTO } from '../../../dto/mensaje-dto';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent implements OnInit {

  registroForm!: FormGroup;

  ciudades: string[] = [
    'ARMENIA',
    'BOGOTA',
    'MEDELLIN',
    'CALI',
    'MANIZALES',
    'PEREIRA'
  ];

  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    private usuarioServicio: UsuarioService
  ) {

    this.registroForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.minLength(10)]],
      ciudad: ['', Validators.required],
      direccion: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(7)]]
    });

  }

  ngOnInit(): void {}

  crearUsuario() {

    if (this.registroForm.valid) {

      const nuevoUsuario: CrearUsuarioDTO = this.registroForm.value;

      this.usuarioServicio.crearUsuario(nuevoUsuario).subscribe({

        next: (respuesta: MensajeDTO) => {

          Swal.fire({
            icon: 'success',
            title: 'Cuenta Creada',
            text: 'Su cuenta ha sido creada exitosamente.',
            confirmButtonText: 'OK'
          }).then(() => {
            this.router.navigate(['/activar-usuario']);
          });

        },

        error: (error) => {

          console.error("Error al crear usuario:", error);
          const mensajeError = error.error?.respuesta || error.error?.message || 'No se pudo registrar el usuario. Por favor, intente de nuevo.';

          if (error.status === 409) {

            Swal.fire({
              icon: 'warning',
              title: 'Usuario ya registrado',
              text: error.error?.respuesta || 'Ya existe una cuenta con este correo electrónico.',
              confirmButtonText: 'Aceptar'
            });

          } else if (error.status === 400) {
            Swal.fire({
              icon: 'error',
              title: 'Datos inválidos',
              text: mensajeError,
              confirmButtonText: 'Aceptar'
            });

          } else {

            Swal.fire({
              icon: 'error',
              title: 'Error en el registro',
              text: mensajeError,
              confirmButtonText: 'Aceptar'
            });

          }

        }
      });

    } else {
      console.warn("Formulario inválido");
    }

  }

  public goToInicio() {
    this.router.navigate(["/"]);
  }

}