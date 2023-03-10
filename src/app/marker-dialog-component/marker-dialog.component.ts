import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-marker-dialog',
  templateUrl: './marker-dialog.component.html',
  styleUrls: ['./marker-dialog.component.css']
})
export class MarkerDialogComponent {

  @Output() deleteMarker!: EventEmitter<any>;

  constructor(
    public dialogRef: MatDialogRef<MarkerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      lat: number,
      lng: number,
      alt: number,
      deleteMarker: boolean,
      numberOfMarker: number
    }) {
  }


}
