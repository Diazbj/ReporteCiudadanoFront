import { afterNextRender, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapaComponent } from "../../componentes/mapa/mapa.component";
import { ReporteDTO } from '../../dto/reporte-dto';
import { ReporteService } from '../../servicios/reporte.service';
import { MapaService } from '../../servicios/mapa.service';
import { Router, RouterModule } from '@angular/router';
import { ModeradorService } from '../../servicios/moderador.service';
import { CategoriaDTO } from '../../dto/categoria-dto';
import { MensajeDTO } from '../../dto/mensaje-dto';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-home-usuario-inicio-reportes',
  standalone: true,
  imports: [CommonModule,MapaComponent, RouterModule],
  templateUrl: './home-usuario-inicio-reportes.component.html',
  styleUrl: './home-usuario-inicio-reportes.component.css'
})

export class HomeUsuarioInicioReportesComponent implements OnInit{ 
  private latitud:number = 4.514;
  private longitud:number = -75.674;
  public reportesDTO: ReporteDTO[] = [];
  public filtradosDTO: ReporteDTO[] = [];
  private categoria: CategoriaDTO[] = [];


  ngOnInit(): void {
    this.obtenerReportesCerca();
    this.obtenerCategorias();
  }
  
  constructor(private reporteService: ReporteService, private categoriaService: ModeradorService, private mapaService: MapaService, private router: Router){ 
    
  }

  public obtenerReportesCerca(){
    this.reporteService.obtenerReportesCerca(this.latitud, this.longitud).subscribe({
      next: (data) => {
        this.reportesDTO = data.mensaje;
        this.filtradosDTO = [...this.reportesDTO]; // Inicializar filtrados
        this.mapaService.crearMapa();
        this.mapaService.pintarMarcadores(this.reportesDTO);
      },
      error: (error) => {
        console.log(error.error.contenido);
      }
    });
  }

  public obtenerCategorias(){
    this.categoriaService.obtenerCategorias().subscribe({
      next: (data) => {
        this.categoria = data.mensaje;
      },
      error: (error) => {
        console.log(error.error.contenido);
      }
    });
  }

  public obtenerColorPorCategoria(nombreCategoria: string):string{
    const categoria = this.categoria.find(cat => cat.nombre === nombreCategoria);
    return categoria? this.getBootstrapBgClass(categoria.color) : 'bg-secondary';
  }

  public getBootstrapBgClass(color: string): string {
    switch (color?.toLowerCase()) {
      case 'azul':          return 'bg-primary text-white';
      case 'gris oscuro':   return 'bg-dark text-white';
      case 'verde':         return 'bg-success text-white';
      case 'rojo':          return 'bg-danger text-white';
      case 'amarillo':      return 'bg-warning text-dark';
      case 'celeste':       return 'bg-info text-dark';
      case 'gris claro':    return 'bg-light text-muted';
      case 'gris muy oscuro': return 'bg-dark text-white';
      case 'blanco':        return 'bg-white text-dark border';
      case 'transparente':  return 'bg-transparent text-muted';
      case 'violeta':       return 'bg-primary text-white'; // Fallback to theme primary
      case 'naranja':       return 'bg-warning text-white';
      default:              return 'bg-secondary text-white';
    }
  }


  public visualizarDetalle(reporeDTO: ReporteDTO){
    this.router.navigate(['/home-usuario/reporte', reporeDTO.id]);
  }

  public marcarReporteImportante(reporteId: string) {
    this.reporteService.marcarImportante(reporteId).subscribe({
      next: (data: MensajeDTO) => {
        // Buscamos el reporte en nuestra lista y lo marcamos localmente
        const reporte = this.filtradosDTO.find(r => r.id === reporteId);
        if (reporte) {
          // Si no está marcado, lo marcamos y sumamos 1. Si ya estaba, restamos (toggle)
          if (!reporte.marcado) {
            reporte.marcado = true;
            reporte.cantidadImportante++;
          } else {
            reporte.marcado = false;
            reporte.cantidadImportante--;
          }
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al marcar reporte como importante:', error);
      }
    });
  }

  public filtrarReportes(event: any) {
    const texto = event.target.value.toLowerCase();
    
    if (!texto) {
      this.filtradosDTO = [...this.reportesDTO];
    } else {
      this.filtradosDTO = this.reportesDTO.filter(r => 
        r.titulo.toLowerCase().includes(texto) || 
        r.descripcion.toLowerCase().includes(texto)
      );
    }
    
    // Opcional: Actualizar marcadores en el mapa para mostrar solo los filtrados
    this.mapaService.pintarMarcadores(this.filtradosDTO);
  }

  public formatearFecha(fechaStr: string): string {
    if (!fechaStr) return '';
    try {
      const limpia = (fechaStr || '').replace('COT ', '').replace('CST ', '');
      const date = new Date(limpia);
      const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      const dia = date.getDate().toString().padStart(2, '0');
      const mes = meses[date.getMonth()];
      const hora = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      return `${dia} ${mes} • ${hora}`;
    } catch (e) {
      return fechaStr || '';
    }
  }
}