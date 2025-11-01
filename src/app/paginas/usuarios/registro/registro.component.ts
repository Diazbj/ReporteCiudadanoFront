import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../../servicios/usuario.service';
import { CrearUsuarioDTO } from '../../../dto/usuarios/crear-usuario-dto';
import { MensajeDTO } from '../../../dto/mensaje-dto';
import { CommonModule } from '@angular/common';

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
          this.goToActivarCuenta(); // Redirige al home u otra vista
        },
        error: (error) => {
          console.error("Error al crear usuario:", error);
        }
      });
    } else {
      console.warn("Formulario inválido");
    }
  }

  public goToActivarCuenta(){
    this.router.navigate(["/activar-usuario"])  
  }

  public goToInicio() {
    this.router.navigate(["/"]);
  }

}