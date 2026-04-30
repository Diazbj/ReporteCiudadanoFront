import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EditarUsuarioDTO } from '../../../dto/editar-usuario-dto';
import { UsuarioService } from '../../../servicios/usuario.service';
import { MapaService } from '../../../servicios/mapa.service';

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
  ubicacionActual: any = null;

  constructor(private formBuilder: FormBuilder, public router: Router, public usuarioServicio: UsuarioService, private mapaService: MapaService){

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
          this.ubicacionActual = info.ubicacion;
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
    
    // Inicializar mapa al entrar en modo edición
    setTimeout(() => {
      this.mapaService.crearMapa('mapa-perfil');
      
      if (this.ubicacionActual) {
        this.mapaService.setMarcador(this.ubicacionActual.latitud, this.ubicacionActual.longitud);
      } else {
        this.mapaService.getPosicionActual().then(pos => {
          this.mapaService.setMarcador(pos.lat, pos.lng);
          this.ubicacionActual = { latitud: pos.lat, longitud: pos.lng };
        });
      }

      this.mapaService.agregarMarcador().subscribe(lngLat => {
        this.ubicacionActual = {
          latitud: lngLat.lat,
          longitud: lngLat.lng
        };
      });
    }, 100);
  }


  public onSubmit(){
    if (this.actualizarPerfilForm.valid) {
      const actualizarUsuario: EditarUsuarioDTO = this.actualizarPerfilForm.value;
      
      if (this.ubicacionActual) {
        actualizarUsuario.ubicacion = this.ubicacionActual;
      }

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

  public actualizarUbicacion() {
    this.mapaService.getPosicionActual().then((pos) => {
      this.ubicacionActual = {
        latitud: pos.lat,
        longitud: pos.lng
      };
      Swal.fire({
        icon: 'success',
        title: 'Ubicación Detectada',
        text: 'Tu ubicación actual ha sido capturada. No olvides guardar los cambios.',
        timer: 2000,
        showConfirmButton: false
      });
    }).catch((err) => {
      Swal.fire({
        icon: 'error',
        title: 'Error de Ubicación',
        text: 'No se pudo obtener tu ubicación actual. Asegúrate de dar permisos al navegador.'
      });
    });
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