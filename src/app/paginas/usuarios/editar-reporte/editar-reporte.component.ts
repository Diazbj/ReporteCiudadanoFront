import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReporteService } from '../../../servicios/reporte.service';
import { ReporteDTO } from '../../../dto/reporte-dto';
import { CommonModule } from '@angular/common';
import { MapaService } from '../../../servicios/mapa.service';
import { forkJoin, of } from 'rxjs';
import { EditarReporteDTO } from '../../../dto/editar-reporte-dto';
import { ImagenService } from '../../../servicios/imagen.service';
import Swal from 'sweetalert2';
import { ModeradorService } from '../../../servicios/moderador.service';
import { ObtenerCategoriaDTO } from '../../../dto/obtener-categoria-dto';

interface ImageControl {
  url: string;
  file: File | null;
  isNew: boolean;
}

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
  
  imagenesEliminadas: string[] = [];
  categorias: ObtenerCategoriaDTO[] = [];

  constructor(
    private fb: FormBuilder,
    private reporteService: ReporteService,
    private route: ActivatedRoute,
    private router: Router,
    private mapaService: MapaService,
    private imagenService: ImagenService,
    private moderadorService: ModeradorService
  ) {}

  ngOnInit(): void {
    this.reporteId = this.route.snapshot.paramMap.get('id') ?? '';

    this.reporteForm = this.fb.group({
      titulo: ['', Validators.required],
      categoria: ['', Validators.required],
      ciudad: ['', Validators.required],
      descripcion: ['', Validators.required],
      imagenes: this.fb.array([]),
      ubicacion: this.fb.group({
        latitud: ['', Validators.required],
        longitud: ['', Validators.required]
      })
    });

    this.cargarDatosIniciales();
  }

  private cargarDatosIniciales() {
    const sources = {
      reporte: this.reporteService.obtenerReportePorId(this.reporteId),
      categorias: this.moderadorService.obtenerCategorias()
    };

    forkJoin(sources).subscribe({
      next: (data) => {
        const reporte = data.reporte;
        this.categorias = data.categorias.mensaje;

        const categoriaActual = this.categorias.find(c => c.nombre === reporte.categoria);

        this.reporteForm.patchValue({
          titulo: reporte.titulo,
          categoria: categoriaActual ? categoriaActual.id : '',
          ciudad: reporte.ciudad,
          descripcion: reporte.descripcion,
          ubicacion: {
            latitud: reporte.ubicacion.latitud,
            longitud: reporte.ubicacion.longitud
          }
        });

        const imagenFormArray = this.reporteForm.get('imagenes') as FormArray;
        imagenFormArray.clear();
        reporte.imagenes.forEach(imgUrl => {
          const imageControl: ImageControl = { url: imgUrl, file: null, isNew: false };
          imagenFormArray.push(this.fb.control(imageControl));
        });

        this.mapaService.crearMapa();
        this.mapaService.pintarMarcador(reporte.ubicacion.latitud, reporte.ubicacion.longitud);
      },
      error: (err) => console.error('Error al cargar datos iniciales:', err)
    });
  }

  get imagenesFormArray(): FormArray {
    return this.reporteForm.get('imagenes') as FormArray;
  }

  onImagenSeleccionada(event: any): void {
    const files: File[] = Array.from(event.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imageControl: ImageControl = { url: e.target.result, file: file, isNew: true };
        this.imagenesFormArray.push(this.fb.control(imageControl));
      };
      reader.readAsDataURL(file);
    });
  }

  eliminarImagen(index: number): void {
    const imageControl = this.imagenesFormArray.at(index).value as ImageControl;
    if (!imageControl.isNew) {
      this.imagenesEliminadas.push(imageControl.url);
    }
    this.imagenesFormArray.removeAt(index);
  }

  onSubmit(): void {
    if (this.reporteForm.invalid) return;

    Swal.fire({
      title: 'Guardando cambios...',
      text: 'Por favor espera.',
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); }
    });

    const deletion$ = this.imagenesEliminadas.map(url => this.imagenService.eliminar(url));
    
    const newImageFiles = this.imagenesFormArray.controls
      .map(control => control.value as ImageControl)
      .filter(img => img.isNew)
      .map(img => img.file!);

    const upload$ = newImageFiles.map(file => this.imagenService.subir(file));

    forkJoin([...deletion$, ...upload$]).subscribe({
      next: (results) => {
        const uploadResults = results.slice(deletion$.length) as string[];
        const existingImageUrls = this.imagenesFormArray.controls
          .map(control => control.value as ImageControl)
          .filter(img => !img.isNew)
          .map(img => img.url);

        const imagenesFinales = [...existingImageUrls, ...uploadResults];

        const datos: EditarReporteDTO = {
          titulo: this.reporteForm.value.titulo,
          categoria: this.reporteForm.value.categoria,
          ciudad: this.reporteForm.value.ciudad,
          descripcion: this.reporteForm.value.descripcion,
          ubicacion: this.reporteForm.value.ubicacion,
          imagenes: imagenesFinales
        };

        this.reporteService.editarReporte(this.reporteId, datos).subscribe({
          next: () => {
            Swal.fire('¡Éxito!', 'Reporte actualizado correctamente', 'success');
            this.router.navigate(['/home-usuario/reportesUsuario']);
          },
          error: (err) => {
            Swal.fire('Error', 'No se pudo actualizar el reporte.', 'error');
            console.error(err);
          }
        });
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudieron subir o eliminar las imágenes.', 'error');
        console.error(err);
      }
    });
  }
}
