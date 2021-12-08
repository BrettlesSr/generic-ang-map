import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppComponent } from '../app.component';
import { Place } from '../models/place';

@Component({
  selector: 'app-place-info',
  templateUrl: './place-info.component.html',
  styleUrls: ['./place-info.component.scss']
})
export class PlaceInfoComponent {
  constructor(public dialog: MatDialog) {}

  @Input() info?: Place;
  @Input() parent?: AppComponent;

  shortened(input: string, count: number): string {
    if (input.length < count) {
      return input;
    } else {
      return input.substring(0, count) + "...";
    }
  }
}
