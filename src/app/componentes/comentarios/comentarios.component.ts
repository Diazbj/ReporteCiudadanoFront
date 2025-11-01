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

  public isLoggedIn(): boolean {
    return this.tokenService.isLogged();
  }
}
