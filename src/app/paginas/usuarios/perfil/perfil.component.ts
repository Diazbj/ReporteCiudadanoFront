import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EditarUsuarioDTO } from '../../../dto/editar-usuario-dto';
import { UsuarioService } from '../../../servicios/usuario.service';
import { MensajeDTO } from '../../../dto/mensaje-dto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  imports: [RouterModule,ReactiveFormsModule,CommonModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})

export class PerfilComponent implements OnInit{
  actualizarPerfilForm!: FormGroup;
  ciudades: string[] = ['ARMENIA', 'BOGOTA', 'MEDELLIN', 'CALI', 'MANIZALES', 'PEREIRA'];
  editando: boolean = false;

  constructor(private formBuilder: FormBuilder, public router: Router, public usuarioServicio: UsuarioService){
    this.actualizarPerfilForm = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.minLength(10)]],
      ciudad: ['', [Validators.required]],
      direccion: ['', [Validators.required]]
    });
    this.actualizarPerfilForm.disable();
  }

  ngOnInit(): void {
    this.usuarioServicio.obtenerUsuario().subscribe({
      next: (res: any) => {
        const info = res.respuesta || res.mensaje || res;
        if (info) {
          this.actualizarPerfilForm.patchValue({
            nombre: info.nombre,
            telefono: info.telefono,
            ciudad: info.ciudad,
            direccion: info.direccion
          });
        }
      },
      error: (err) => {
        console.error("Error al cargar el perfil:", err);
      }
    });
  }

  activarEdicion() {
    this.editando = true;
    this.actualizarPerfilForm.enable();
  }

  public onSubmit(){
    if (this.actualizarPerfilForm.valid) {
      const actualizarUsuario: EditarUsuarioDTO = this.actualizarPerfilForm.value;
      this.usuarioServicio.editarUsuario(actualizarUsuario).subscribe({
        next: (respuesta: MensajeDTO) => {
          Swal.fire({
            icon: 'success',
            title: 'Usuario Actualizado',
            text: 'Tu usuario ha sido actualizado exitosamente.',
            confirmButtonText: 'OK'
          }).then(() => {
            this.editando = false;
            this.actualizarPerfilForm.disable();
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
    } else {
      console.warn("Formulario inválido");
    }
  }

  public cancelar(){
    if (this.editando) {
      this.editando = false;
      this.actualizarPerfilForm.disable();
      this.ngOnInit(); 
    } else {
      this.router.navigate(["/home-usuario"]);
    }
  }

}