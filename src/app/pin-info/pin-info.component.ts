import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppComponent } from '../app.component';
import { Pin } from '../models/pin';

@Component({
  selector: 'app-pin-info',
  templateUrl: './pin-info.component.html',
  styleUrls: ['./pin-info.component.scss']
})
export class PinInfoComponent {
  constructor(public dialog: MatDialog) {}

  @Input() info?: Pin;
  @Input() parent?: AppComponent;

  shortened(input: string, count: number): string {
    if (input.length < count) {
      return input;
    } else {
      return input.substring(0, count) + "...";
    }
  }
}
