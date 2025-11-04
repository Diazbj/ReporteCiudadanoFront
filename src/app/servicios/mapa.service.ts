import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import mapboxgl, { LngLatLike } from 'mapbox-gl';
import { ReporteDTO } from '../dto/reporte-dto';

@Injectable({
 providedIn: 'root'
})

export class MapaService {
  mapa: any;
  marcadores: any[];
  posicionActual: LngLatLike;


  constructor() {
    this.marcadores = [];
    this.posicionActual = [-75.67270, 4.53252];
  }


  public crearMapa() {
    this.mapa = new mapboxgl.Map({
      accessToken: 'pk.eyJ1Ijoiam9obmNpZnVlbnRlcyIsImEiOiJjbWFsdnYxY3YwZXhlMnRvb2FiY2NudmhiIn0.BmAMLvW1EnR8cDWOlEKmKQ',
      container: 'mapa',
      style: 'mapbox://styles/mapbox/standard',
      center: this.posicionActual,
      pitch: 45,
      zoom: 17
    });

    this.mapa.addControl(new mapboxgl.NavigationControl());
    this.mapa.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true
      })
    );
  }

 public agregarMarcador(): Observable<any> {
   const mapaGlobal = this.mapa;
   const marcadores = this.marcadores;
   return new Observable<any>(observer => {
     mapaGlobal.on('click', function (e: any) {
       marcadores.forEach(marcador => marcador.remove());
       const marcador = new mapboxgl.Marker({color: 'red'})
         .setLngLat([e.lngLat.lng, e.lngLat.lat])
         .addTo(mapaGlobal);
       marcadores.push(marcador);
       observer.next(marcador.getLngLat());
     });
   });
 }

  public pintarMarcadores(reportes: ReporteDTO[]) {
    reportes.forEach(reporte => {
      new mapboxgl.Marker({color: 'red'})
      .setLngLat([reporte.ubicacion.longitud, reporte.ubicacion.latitud])
      .setPopup(new mapboxgl.Popup().setHTML(reporte.titulo))
      .addTo(this.mapa);
    });
  }

  public setMarcador(latitud: number, longitud: number) {
    this.marcadores.forEach(marcador => marcador.remove());
    const marcador = new mapboxgl.Marker({color: 'red'})
      .setLngLat([longitud, latitud])
      .addTo(this.mapa);
    this.marcadores.push(marcador);
    this.mapa.setCenter([longitud, latitud]); // Centrar el mapa en el nuevo marcador
  }

}