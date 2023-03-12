import {Injectable} from '@angular/core';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class MapCoordinatesService {

  private markers = [
    L.marker([50.4544, 30.4525], {alt: 100}),
    L.marker([50.4310, 30.5425], {alt: 100}),
    L.marker([50.4472, 30.5152], {alt: 100})
  ];

  constructor() {
  }

  getMarkers(): L.Marker[] {
    return this.markers;
  }

  addMarker(marker: L.Marker) {
    this.markers.push(marker);
  }

  updateMarker(index: number, marker: L.Marker) {
    this.markers[index] = marker;
  }

  deleteMarker(index: number) {
    this.markers.splice(index, 1);
  }

  clearMarkers() {
    this.markers = [];
  }

}
