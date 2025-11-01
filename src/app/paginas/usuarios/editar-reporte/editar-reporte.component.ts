import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReporteService } from '../../../servicios/reporte.service';
import { ReporteDTO } from '../../../dto/reporte-dto';
import { CommonModule } from '@angular/common';
import { MapaService } from '../../../servicios/mapa.service';
import { Subscription } from 'rxjs';
import { EditarReporteDTO } from '../../../dto/editar-reporte-dto';
import { LngLat } from 'mapbox-gl';

@Component({
  selector: 'app-editar-reporte',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './editar-reporte.component.html',
  styleUrls: ['./editar-reporte.component.css']
})
export class EditarReporteComponent implements OnInit, OnDestroy {

  reporteForm!: FormGroup;
  reporteId!: string;
  marcadorSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private reporteService: ReporteService,
    private route: ActivatedRoute,
    private router: Router,
    private mapaService: MapaService
  ) {}

  ngOnInit(): void {
    this.reporteId = this.route.snapshot.paramMap.get('id') ?? '';

    this.reporteForm = this.fb.group({
      titulo: ['', Validators.required],
      categoria: ['', Validators.required],
      descripcion: ['', Validators.required],
      imagen: this.fb.array([]),
      ubicacion: this.fb.group({
        latitud: ['', Validators.required],
        longitud: ['', Validators.required]
      })
    });

    this.reporteService.obtenerReportePorId(this.reporteId).subscribe({
      next: (reporte: ReporteDTO) => {
        this.reporteForm.patchValue({
          titulo: reporte.titulo,
          categoria: reporte.categoria,
          descripcion: reporte.descripcion,
          ubicacion: {
            latitud: reporte.ubicacion.latitud,
            longitud: reporte.ubicacion.longitud
          }
        });

        if (reporte.imagenes && Array.isArray(reporte.imagenes)) {
          const imagenFormArray = this.reporteForm.get('imagen') as FormArray;
          reporte.imagenes.forEach((imgUrl: string) => {
            imagenFormArray.push(this.fb.control(imgUrl));
          });
        }

        setTimeout(() => {
          this.mapaService.posicionActual = [
            reporte.ubicacion.longitud,
            reporte.ubicacion.latitud
          ];
          this.mapaService.crearMapa();

          this.marcadorSubscription = this.mapaService.agregarMarcador().subscribe((coords: LngLat) => {
            this.reporteForm.get('ubicacion.latitud')?.setValue(coords.lat);
            this.reporteForm.get('ubicacion.longitud')?.setValue(coords.lng);
          });
        }, 0);
      },
      error: (err) => {
        console.error('Error al cargar el reporte:', err);
      }
    });
  }

  get imagenesFormArray(): FormArray {
    return this.reporteForm.get('imagen') as FormArray;
  }

  onImagenSeleccionada(event: any): void {
    const files: FileList = event.target.files;

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagenesFormArray.push(this.fb.control(e.target.result));
      };
      reader.readAsDataURL(files[i]); // base64 string
    }
  }

  eliminarImagen(index: number): void {
    this.imagenesFormArray.removeAt(index);
  }

  onSubmit(): void {
    if (this.reporteForm.invalid) return;

    const datos: EditarReporteDTO = this.reporteForm.value;
    console.log('Datos enviados al backend:', datos);

    this.reporteService.editarReporte(this.reporteId, datos).subscribe({
      next: () => {
        alert('Reporte editado correctamente');
        this.router.navigate(['/home-usuario/reportesUsuario']);
      },
      error: (err) => {
        console.error('Error al editar el reporte:', err);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.marcadorSubscription) {
      this.marcadorSubscription.unsubscribe();
    }
  }
}