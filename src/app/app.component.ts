import {MarkerDialogComponent} from "./marker-dialog-component/marker-dialog.component";
import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {MapCoordinatesService} from "./services/map-coordinates.service";

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

  constructor(
    private matDialog: MatDialog,
    private markerService: MapCoordinatesService) {
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  initMap(): void {
    this.map = L.map(this.mapContainer.nativeElement).setView([50.4447, 30.5117], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(this.map);
    this.map.on('click', this.onMapClick.bind(this));
    this.getFirstsMarkers();
    this.initPolylinesOptions();
  }

  getFirstsMarkers(): void {
    this.markerService.getMarkers().forEach((marker: L.Marker) => {
      this.initMarkers(marker);
    });
  }

  initMarkers(marker: L.Marker) {
    const updatedMarker = L.marker(marker.getLatLng(), {
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
    }).on('click', () => {
      const dialogRef = this.matDialog.open(MarkerDialogComponent,
        {
          data: {
            lat: updatedMarker.getLatLng().lat,
            lng: updatedMarker.getLatLng().lng,
            alt: updatedMarker.options.alt,
            deleteMarker: false,
            numberOfMarker: this.markers
              .findIndex((marker: L.Marker) => marker.getLatLng() === updatedMarker.getLatLng())
          }
        }
      )

      dialogRef.afterClosed().subscribe(data => {
        if (data.deleteMarker) {
          this.markers.splice(data.numberOfMarker, 1);
          updatedMarker.remove();
          this.polylines.removeFrom(this.map);
          this.markerService.deleteMarker(data.numberOfMarker);
          this.reDrawPolylines();
          this.reDrawIcons();
          return;
        }

        if (data) {
          updatedMarker.setLatLng([data.lat, data.lng]);
          updatedMarker.options.alt = data.alt;
          this.markerService.updateMarker(data.numberOfMarker, updatedMarker);
          this.reDrawPolylines();
        }
      });
    }).on('drag', () => {
      this.reDrawPolylines();
    }).on('dragend', () => {
      const index = this.markers
        .findIndex((marker: L.Marker) => marker.getLatLng() === updatedMarker.getLatLng());
      this.markerService.updateMarker(index, updatedMarker);
    }).addTo(this.map);
    updatedMarker.options.alt = 100;
    this.markers.push(updatedMarker);
  }

  initPolylinesOptions() {
    const latLngs = this.markers.map((marker: L.Marker) => marker.getLatLng());
    this.polylines = L.polyline(latLngs, {
      color: 'red',
      weight: 3,
      lineCap: 'round'
    }).arrowheads({size: '30px', fill: true, yawn: 22}).addTo(this.map);
  }

  onMapClick(event: L.LeafletMouseEvent) {
    const clickCoords = event.latlng;
    this.polylines.addLatLng(clickCoords);

    const marker = new L.Marker([clickCoords.lat, clickCoords.lng]);
    marker.options.alt = 100;
    this.markerService.addMarker(marker);
    this.initMarkers(marker);
  }

  reDrawPolylines() {
    const newLatLngs = this.markers.map((m: L.Marker) => m.getLatLng());
    this.polylines.setLatLngs(newLatLngs).addTo(this.map);
  }

  reDrawIcons() {
    this.markers.forEach((marker: L.Marker) => marker.remove());
    this.markers.forEach((marker: L.Marker, index: number) => {
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

  clearMarkers() {
    this.markers.forEach((marker: L.Marker) => {
      this.map.removeLayer(marker);
    })
    this.markers = [];
    this.markerService.clearMarkers();

    this.map.eachLayer((layer: L.Layer) => {
      if (layer instanceof L.Polyline) {
        this.map.removeLayer(layer);
      }
    })
    this.initPolylinesOptions();
  }
}

