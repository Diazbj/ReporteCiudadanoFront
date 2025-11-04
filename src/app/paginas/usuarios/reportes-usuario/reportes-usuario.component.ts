import { Component, OnInit } from '@angular/core';
import { ReporteService } from '../../../servicios/reporte.service';
import { ReporteDTO } from '../../../dto/reporte-dto'; 
import { MensajeDTO } from '../../../dto/mensaje-dto'; 
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reportes-usuario',
  templateUrl: './reportes-usuario.component.html',
  styleUrls: ['./reportes-usuario.component.css'],
  standalone: true,
  imports: [CommonModule,RouterModule]
})
export class ReportesUsuarioComponent implements OnInit {

  reportes: ReporteDTO[] = [];

  constructor(private reporteService: ReporteService) {}

  ngOnInit(): void {
    this.reporteService.obtenerReportesUsuario().subscribe({
      next: (respuesta: MensajeDTO) => {
        this.reportes = respuesta.mensaje;
        console.log('Reportes recibidos:', this.reportes);
      },
      error: (error) => {
        console.error('Error al obtener reportes del usuario:', error);
      }
    });
  }

  public eliminarReporte(id: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, ¡elimínalo!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.reporteService.eliminarReporte(id).subscribe({
          next: () => {
            this.reportes = this.reportes.filter(r => r.id !== id);
            Swal.fire(
              '¡Eliminado!',
              'El reporte ha sido eliminado.',
              'success'
            );
          },
          error: (err) => {
            console.error(err);
            Swal.fire(
              'Error',
              'No se pudo eliminar el reporte.',
              'error'
            );
          }
        });
      }
    });
  }
}
