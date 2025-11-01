import { Component, OnInit } from '@angular/core';
import { MapaService } from '../../servicios/mapa.service';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [],
  templateUrl: './mapa.component.html',
  styleUrl: './mapa.component.css'
})

export class MapaComponent implements OnInit{
  constructor(private mapaService: MapaService) { }

  ngOnInit(): void {
    this.mapaService.crearMapa();
  }

}