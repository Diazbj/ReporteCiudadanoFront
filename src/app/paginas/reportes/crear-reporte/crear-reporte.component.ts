import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CrearReporteDTO } from '../../../dto/crear-reporte-dto';
import { MapaService } from '../../../servicios/mapa.service';
import { ReporteService } from '../../../servicios/reporte.service';
import { ModeradorService } from '../../../servicios/moderador.service';
import { ObtenerCategoriaDTO } from '../../../dto/obtener-categoria-dto';
import Swal from 'sweetalert2';
import { ImagenService } from '../../../servicios/imagen.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-crear-reporte',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './crear-reporte.component.html',
  styleUrls: ['./crear-reporte.component.css']
})
export class CrearReporteComponent implements OnInit {
  reporteForm!: FormGroup;
  selectedFiles: File[] = [];
  ubicacionSeleccionada: { latitud: number, longitud: number } | null = null;
  categoria: ObtenerCategoriaDTO[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
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

    this.mapaService.crearMapa();

    this.mapaService.agregarMarcador().subscribe((coords) => {
      this.ubicacionSeleccionada = {
        latitud: coords.lat,
        longitud: coords.lng
      };
    });
  }

  formCrearReporte() {
    if (!this.reporteForm.valid || !this.ubicacionSeleccionada) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor llena todos los campos y selecciona una ubicación en el mapa.',
        confirmButtonText: 'Cerrar'
      });
      return;
    }

    if (this.selectedFiles.length > 0) {
      this.subirImagenesYCrearReporte();
    } else {
      this.crearReporte([]);
    }
  }

  private subirImagenesYCrearReporte() {
    Swal.fire({
      title: 'Subiendo imágenes...',
      text: 'Por favor espera.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const uploadObservables = this.selectedFiles.map(file => this.imagenService.subir(file));

    forkJoin(uploadObservables).subscribe({
      next: (responses) => {
        const imageUrls = responses;
        this.crearReporte(imageUrls);
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

  private crearReporte(imageUrls: string[]) {
    const dto: CrearReporteDTO = {
      titulo: this.reporteForm.value.titulo,
      descripcion: this.reporteForm.value.descripcion,
      ciudad: this.reporteForm.value.ciudad,
      categoria: this.reporteForm.value.categoria,
      ubicacion: this.ubicacionSeleccionada!,
      imagenes: imageUrls
    };

    this.reporteService.crearReporte(dto).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Reporte creado',
          text: 'Tu reporte ha sido creado exitosamente.',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/home-usuario']);
        });
      },
      error: (err) => {
        Swal.close();
        console.error(err);
        const mensaje = (err.error && typeof err.error.mensaje === 'string') ? err.error.mensaje : 'Hubo un error al crear el reporte.';
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