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
  imports: [RouterModule, ReactiveFormsModule,CommonModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})

export class RegistroComponent implements OnInit {
  registroForm!: FormGroup;
  ciudades: string[] = ['ARMENIA', 'BOGOTA', 'MEDELLIN', 'CALI', 'MANIZALES', 'PEREIRA'];

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

  ngOnInit(): void {
  }

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
            this.router.navigate(['/']);
          });
        },
        error: (error) => {
          console.error("Error al crear usuario:", error);
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