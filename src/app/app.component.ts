import {MatDialog} from "@angular/material/dialog";
import {MarkerDialogComponent} from "./marker-dialog-component/marker-dialog.component";
import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-polylinedecorator';
import 'leaflet-arrowheads';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('mapContainer', {static: false}) mapContainer!: ElementRef;
  map!: L.Map;
  markers: L.Marker[] = [];
  polylines!: L.Polyline;

  constructor(private matDialog: MatDialog) {
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  initMap() {
    this.map = L.map(this.mapContainer.nativeElement).setView([50.431, 30.524], 13);

    this.initPolylinesOptions();

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', this.onMapClick.bind(this))
  }

  onMapClick(event: any) {
    const clickCoords = event.latlng;
    this.polylines.addLatLng(clickCoords);

    const marker = L.marker(clickCoords, {
      draggable: true,
      icon: L.divIcon({
        html: `<span style="border-radius: 50%;
                     text-align: center;
                     font-size: 12px;
                     background-color: white;
                     border: 1px solid black;
                     padding: 6px 8px;
                     ">${this.markers.length.toString()}</span>`,
        className: 'numeration'
      })
    }).addTo(this.map);

    // Altitude
    marker.options.alt = 100;

    marker.on('click', () => {
      const dialogRef = this.matDialog.open(MarkerDialogComponent,
        {
          data: {
            lat: marker.getLatLng().lat,
            lng: marker.getLatLng().lng,
            alt: marker.options.alt,
            deleteMarker: false,
            numberOfMarker: this.markers.findIndex(el => el.getLatLng() === marker.getLatLng())
          }
        }
      )

      dialogRef.afterClosed().subscribe(res => {
        if (res) {
          marker.setLatLng([res.lat, res.lng])
          marker.options.alt = res.alt;
          this.reDrawPolylines();
        }

        if (res.deleteMarker) {
          const index = this.markers.findIndex(el => el.getLatLng() === marker.getLatLng());
          this.markers.splice(index, 1);
          marker.remove();
          this.polylines.removeFrom(this.map);
          this.reDrawIcons();
        }
      });
    });
    this.markers.push(marker);

    marker.on('move', () => {
      this.reDrawPolylines();
    });
  }

  clearMarkers() {
    this.markers.forEach(marker => {
      this.map.removeLayer(marker);
    })
    this.markers = [];

    this.map.eachLayer(layer => {
      if (layer instanceof L.Polyline) {
        this.map.removeLayer(layer);
      }
    })
    this.initPolylinesOptions();

  }

  initPolylinesOptions() {
    this.polylines = L.polyline([], {
      color: 'red',
      weight: 3,
      lineCap: 'round'
    }).arrowheads({size: '30px', fill: true, yawn: 22}).addTo(this.map);
  }

  reDrawPolylines() {
    const newLatLngs = this.markers.map((m: L.Marker) => m.getLatLng());
    this.polylines.setLatLngs(newLatLngs).addTo(this.map);
  }

  reDrawIcons() {
    this.markers.forEach(mark => mark.remove());
    this.markers.forEach((marker, index) => {
      marker.setLatLng(marker.getLatLng());
      marker.setIcon(
        L.divIcon({
          html: `<span style="border-radius: 50%;
                     text-align: center;
                     font-size: 12px;
                     background-color: white;
                     border: 1px solid black;
                     padding: 6px 8px;
                     ">${index}</span>`,
          className: 'numeration'
        })
      ).addTo(this.map);
    });
  }
}


