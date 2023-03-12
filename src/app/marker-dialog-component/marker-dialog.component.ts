import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-marker-dialog',
  templateUrl: './marker-dialog.component.html',
  styleUrls: ['./marker-dialog.component.css']
})
export class MarkerDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      lat: number,
      lng: number,
      alt: number,
      index: number,
      deleteMarker: boolean | undefined,
      numberOfMarker: number
    }) {
  }

}
