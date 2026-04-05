import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ReporteService } from '../../../servicios/reporte.service';
import { ReporteDTO } from '../../../dto/reporte-dto';

@Component({
  selector: 'app-listar-reportes',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './listar-reportes.component.html',
  styleUrl: './listar-reportes.component.css'
})
export class ListarReportesComponent implements OnInit {
  reportes: ReporteDTO[] = [];
  filtrados: ReporteDTO[] = [];
  estadoSeleccionado: string = 'TODOS';

  constructor(private reporteService: ReporteService) {}

  ngOnInit(): void {
    this.cargarReportes();
  }

  cargarReportes() {
    this.reporteService.obtenerTodosLosReportes().subscribe({
      next: (data: any) => {
        this.reportes = data.respuesta || data.mensaje || [];
        this.filtrarPorEstado(); 
      },
      error: (err) => {
        console.error("Error cargando los reportes:", err);
      }
    });
  }

  public filtrarPorEstado() {
    if (this.estadoSeleccionado === 'TODOS') {
      this.filtrados = [...this.reportes];
    } else {
      this.filtrados = this.reportes.filter(r => r.estadoActual === this.estadoSeleccionado);
    }
  }

  async cambiarEstado(reporte: ReporteDTO) {
    const { value: formValues } = await Swal.fire({
      title: 'Cambiar Estado del Reporte',
      html: `
        <label class="form-label" style="text-align: left; display: block; margin-top: 10px;">Nuevo Estado:</label>
        <select id="swal-estado" class="swal2-select" style="display: flex; margin: 0 auto; width: 100%;">
          <option value="PENDIENTE" ${reporte.estadoActual === 'PENDIENTE' ? 'selected' : ''}>PENDIENTE</option>
          <option value="RESUELTO" ${reporte.estadoActual === 'RESUELTO' ? 'selected' : ''}>RESUELTO</option>
          <option value="VERIFICADO" ${reporte.estadoActual === 'VERIFICADO' ? 'selected' : ''}>VERIFICADO</option>
          <option value="RECHAZADO" ${reporte.estadoActual === 'RECHAZADO' ? 'selected' : ''}>RECHAZADO</option>
          <option value="ELIMINADO" ${reporte.estadoActual === 'ELIMINADO' ? 'selected' : ''}>ELIMINADO</option>
        </select>
        <label class="form-label mt-3" style="text-align: left; display: block;">Motivo / Justificación:</label>
        <textarea id="swal-motivo" class="swal2-textarea" style="margin: 0; width: 100%;" placeholder="Obligatorio..." rows="3"></textarea>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const estado = (document.getElementById('swal-estado') as HTMLSelectElement).value;
        const motivo = (document.getElementById('swal-motivo') as HTMLTextAreaElement).value.trim();
        if (!motivo) {
          Swal.showValidationMessage('Debe escribir un motivo para guardar el cambio');
        }
        return { estado, motivo };
      }
    });

    if (formValues) {
      this.reporteService.cambiarEstado(reporte.id, formValues.estado, formValues.motivo).subscribe({
        next: () => {
          Swal.fire('¡Éxito!', 'Estado modificado correctamente', 'success');
          this.cargarReportes();
        },
        error: (err) => {
          const errMsg = typeof err.error === 'string' ? err.error : 'Ocurrió un error inesperado al actualizar el reporte.';
          Swal.fire('Ocurrió un error', errMsg, 'error');
        }
      });
    }
  }
}
