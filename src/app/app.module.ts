import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {MarkerDialogComponent} from './marker-dialog-component/marker-dialog.component';

import {BrowserModule} from '@angular/platform-browser';
import {LeafletModule} from "@asymmetrik/ngx-leaflet";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatDialogModule} from "@angular/material/dialog";
import {FormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";

@NgModule({
  declarations: [
    AppComponent,
    MarkerDialogComponent
  ],
  imports: [
    BrowserModule,
    LeafletModule,
    BrowserAnimationsModule,
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
