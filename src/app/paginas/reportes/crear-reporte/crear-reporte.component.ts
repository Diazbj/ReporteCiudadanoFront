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
    private moderadorService: ModeradorService
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

    const dto: CrearReporteDTO = {
      titulo: this.reporteForm.value.titulo,
      descripcion: this.reporteForm.value.descripcion,
      ciudad: this.reporteForm.value.ciudad,
      categoria: this.reporteForm.value.categoria,
      ubicacion: this.ubicacionSeleccionada,
      imagenes: this.selectedFiles.map(file => URL.createObjectURL(file)) // Aquí puedes ajustar si necesitas subir imágenes al backend
    };

    this.reporteService.crearReporte(dto).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Reporte creado',
          text: 'Tu reporte ha sido creado exitosamente.',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/']);
        });
      },
      error: (err) => {
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
    this.router.navigate(['/']);
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
        console.log(this.categoria);
      },
      error: (error) => {
        console.log(error.error.contenido);
      }
    });
  }

  
}
