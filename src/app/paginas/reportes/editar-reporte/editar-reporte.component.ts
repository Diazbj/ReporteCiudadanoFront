import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EditarReporteDTO } from '../../../dto/editar-reporte-dto';
import { MapaService } from '../../../servicios/mapa.service';
import { ReporteService } from '../../../servicios/reporte.service';
import { ModeradorService } from '../../../servicios/moderador.service';
import { ObtenerCategoriaDTO } from '../../../dto/obtener-categoria-dto';
import Swal from 'sweetalert2';
import { ImagenService } from '../../../servicios/imagen.service';
import { forkJoin } from 'rxjs';
import { ReporteDTO } from '../../../dto/reporte-dto';
import { UbicacionDTO } from '../../../dto/ubicacion-dto';

@Component({
  selector: 'app-editar-reporte',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './editar-reporte.component.html',
  styleUrls: ['./editar-reporte.component.css']
})
export class EditarReporteComponent implements OnInit {
  reporteForm!: FormGroup;
  reporteId!: string;
  selectedFiles: File[] = [];
  ubicacionSeleccionada: { latitud: number, longitud: number } | null = null;
  categoria: ObtenerCategoriaDTO[] = [];
  reporteActual: ReporteDTO | null = null;
  imagenesExistentes: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private mapaService: MapaService,
    private reporteService: ReporteService,
    private moderadorService: ModeradorService,
    private imagenService: ImagenService
  ) {}

  ngOnInit(): void {
    this.obtenerCategorias();
    this.reporteForm = this.formBuilder.group({
      titulo: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],
      categoria: ['', [Validators.required]]
    });

    this.route.params.subscribe(params => {
      this.reporteId = params['codigo'];
      if (this.reporteId) {
        this.cargarReporte(this.reporteId);
      }
    });

    this.mapaService.crearMapa();
    this.mapaService.agregarMarcador().subscribe((coords) => {
      this.ubicacionSeleccionada = {
        latitud: coords.lat,
        longitud: coords.lng
      };
    });
  }

  cargarReporte(id: string): void {
    this.reporteService.obtenerReportePorId(id).subscribe({
      next: (data: ReporteDTO) => {
        this.reporteActual = data;
        this.imagenesExistentes = data.imagenes;
        this.reporteForm.patchValue({
          titulo: data.titulo,
          descripcion: data.descripcion,
          ciudad: data.ciudad,
          categoria: data.categoria
        });
        this.ubicacionSeleccionada = data.ubicacion;
        this.mapaService.setMarcador(data.ubicacion.latitud, data.ubicacion.longitud);
      },
      error: (err) => {
        console.error('Error al cargar el reporte', err);
        Swal.fire('Error', 'No se pudo cargar el reporte.', 'error');
        this.router.navigate(['/home-usuario']);
      }
    });
  }

  formEditarReporte() {
    if (!this.reporteForm.valid || !this.ubicacionSeleccionada) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor llena todos los campos y selecciona una ubicación en el mapa.',
        confirmButtonText: 'Cerrar'
      });
      return;
    }

    Swal.fire({
      title: 'Guardando cambios...',
      text: 'Por favor espera.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    if (this.selectedFiles.length > 0) {
      this.subirImagenesYEditarReporte();
    } else {
      this.editarReporte(this.imagenesExistentes);
    }
  }

  private subirImagenesYEditarReporte() {
    const uploadObservables = this.selectedFiles.map(file => this.imagenService.subir(file));

    forkJoin(uploadObservables).subscribe({
      next: (responses) => {
        const nuevasImagenes = responses;
        const todasLasImagenes = [...this.imagenesExistentes, ...nuevasImagenes];
        this.editarReporte(todasLasImagenes);
      },
      error: (err) => {
        Swal.close();
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Error al subir imágenes',
          text: 'Hubo un error al subir una o más imágenes. Por favor, inténtalo de nuevo.',
          confirmButtonText: 'Cerrar'
        });
      }
    });
  }

  private editarReporte(imageUrls: string[]) {
    const dto: EditarReporteDTO = {
      titulo: this.reporteForm.value.titulo,
      descripcion: this.reporteForm.value.descripcion,
      ciudad: this.reporteForm.value.ciudad,
      categoria: this.reporteForm.value.categoria,
      ubicacion: this.ubicacionSeleccionada as UbicacionDTO,
      imagenes: imageUrls
    };

    this.reporteService.editarReporte(this.reporteId, dto).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Reporte actualizado',
          text: 'Tu reporte ha sido actualizado exitosamente.',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/home-usuario']);
        });
      },
      error: (err) => {
        Swal.close();
        console.error('Error al editar el reporte:', err);
        const mensaje = (err.error && typeof err.error.mensaje === 'string') ? err.error.mensaje : 'Hubo un error al actualizar el reporte.';
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: mensaje,
          confirmButtonText: 'Cerrar'
        });
      }
    });
  }

  goToInicio() {
    this.router.navigate(['/home-usuario']);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
    }
  }

  eliminarImagenExistente(index: number): void {
    this.imagenesExistentes.splice(index, 1);
  }

  public obtenerCategorias(){
    this.moderadorService.obtenerCategorias().subscribe({
      next: (data) => {
        this.categoria = data.mensaje;
      },
      error: (error) => {
        console.log(error.error.contenido);
      }
    });
  }
}