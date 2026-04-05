import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModeradorService } from '../../servicios/moderador.service';
import { TokenService } from '../../servicios/token.service';
import { ComentarioDTO } from '../../dto/comentario-dto';
import { CrearComentarioDTO } from '../../dto/crear-comentario-dto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-comentarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.css']
})
export class ComentariosComponent implements OnChanges {

  @Input() reporteId: string = '';
  comentarios: ComentarioDTO[] = [];
  comentarioForm: FormGroup;

  constructor(
    private moderadorService: ModeradorService,
    private tokenService: TokenService,
    private formBuilder: FormBuilder
  ) {
    this.comentarioForm = this.formBuilder.group({
      mensaje: ['', [Validators.required]]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reporteId'] && this.reporteId) {
      this.obtenerComentarios();
    }
  }

  public obtenerComentarios() {
    this.moderadorService.obtenerComentarios(this.reporteId).subscribe({
      next: (data) => {
        this.comentarios = data.mensaje;
      },
      error: (error) => {
        console.error('Error al obtener comentarios:', error);
      }
    });
  }

  public crearComentario() {
    if (this.comentarioForm.invalid) {
      return;
    }
    const crearComentarioDTO: CrearComentarioDTO = this.comentarioForm.value;
    this.moderadorService.crearComentario(this.reporteId, crearComentarioDTO).subscribe({
      next: () => {
        this.obtenerComentarios();
        this.comentarioForm.reset();
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo crear el comentario.',
          confirmButtonText: 'Cerrar'
        });
      }
    });
  }

  public esMiComentario(comentario: ComentarioDTO): boolean {
    const miId = this.tokenService.getIdUsuario();
    // Validar por si el backend mandó el id de MongoDB mapeado, o su interior.
    if (comentario.clienteId) {
      return comentario.clienteId === miId;
    }
    
    return false;
  }

  public eliminarComentario(comentario: ComentarioDTO) {
    if (!comentario.id) {
      Swal.fire('Error', 'No se pudo identificar el comentario para eliminarlo.', 'error');
      return;
    }
    Swal.fire({
      title: '¿Eliminar comentario?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.moderadorService.eliminarComentario(comentario.id).subscribe({
          next: () => {
            Swal.fire('¡Eliminado!', 'El comentario ha sido borrado.', 'success');
            this.obtenerComentarios();
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Error', 'No se pudo eliminar el comentario', 'error');
          }
        });
      }
    });
  }

  public isLoggedIn(): boolean {
    return this.tokenService.isLogged();
  }
}
