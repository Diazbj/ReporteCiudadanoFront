import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReporteService } from '../../../servicios/reporte.service';
import { MapaService } from '../../../servicios/mapa.service';
import { ReporteDTO } from '../../../dto/reporte-dto';
import { ComentariosComponent } from '../../../componentes/comentarios/comentarios.component';

@Component({
  selector: 'app-ver-reporte',
  standalone: true,
  imports: [CommonModule, ComentariosComponent],
  templateUrl: './ver-reporte.component.html',
  styleUrls: ['./ver-reporte.component.css']
})
export class VerReporteComponent implements OnInit {

  reporte: ReporteDTO | null = null;
  reporteId: string = '';

  constructor(
    private route: ActivatedRoute,
    private reporteService: ReporteService,
    private mapaService: MapaService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.reporteId = params['id'];
      this.obtenerReporte(this.reporteId);
    });
  }

  obtenerReporte(id: string) {
    this.reporteService.obtenerReportePorId(id).subscribe({
      next: (data) => {
        this.reporte = data;
        // We need to wait for the view to be initialized before creating the map
        // A simple timeout is a trick to push the map creation to the next change detection cycle.
        setTimeout(() => {
          if (this.reporte && this.reporte.ubicacion) {
            this.mapaService.crearMapa();
            this.mapaService.pintarMarcadores([this.reporte]);
          }
        }, 0);
      },
      error: (error) => {
        console.error('Error al obtener el reporte:', error);
      }
    });
  }
}
