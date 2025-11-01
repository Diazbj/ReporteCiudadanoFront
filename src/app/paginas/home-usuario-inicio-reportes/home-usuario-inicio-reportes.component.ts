import { afterNextRender, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapaComponent } from "../../componentes/mapa/mapa.component";
import { ReporteDTO } from '../../dto/reporte-dto';
import { ReporteService } from '../../servicios/reporte.service';
import { MapaService } from '../../servicios/mapa.service';
import { RouterModule } from '@angular/router';
import { ModeradorService } from '../../servicios/moderador.service';
import { CategoriaDTO } from '../../dto/categoria-dto';

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
  public reportesDTO:ReporteDTO[] = [];
  private categoria: CategoriaDTO[] = [];


  ngOnInit(): void {
    this.obtenerReportesCerca();
    this.obtenerCategorias();
  }
  
  constructor(private reporteService: ReporteService, private categoriaService: ModeradorService, private mapaService: MapaService){ 
    
  }

  public obtenerReportesCerca(){
    this.reporteService.obtenerReportesCerca(this.latitud, this.longitud).subscribe({
      next: (data) => {
        this.reportesDTO = data.mensaje;
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
    switch (color) {
      case 'azul':          return 'bg-primary';
      case 'gris oscuro':   return 'bg-secondary';
      case 'verde':         return 'bg-success';
      case 'rojo':          return 'bg-danger';
      case 'amarillo':      return 'bg-warning';
      case 'celeste':       return 'bg-info';
      case 'gris claro':    return 'bg-light';
      case 'gris muy oscuro': return 'bg-dark';
      case 'blanco':        return 'bg-white';
      case 'transparente':  return 'bg-transparent';
      default:              return 'bg-secondary';
    }
  }


  public visualizarDetalle(reporeDTO: ReporteDTO){

  }


}