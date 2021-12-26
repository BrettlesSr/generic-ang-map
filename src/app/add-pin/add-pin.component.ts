import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Pin } from '../models/pin';
import { v4 as uuidv4 } from 'uuid';
import { Point } from '../models/point';

@Component({
  selector: 'app-add-pin',
  templateUrl: './add-pin.component.html',
  styleUrls: ['./add-pin.component.scss']
})
export class AddPinComponent implements OnInit {
  pin: Pin = new Pin();
  colors = [
    {label: 'Blue', url:'https://i.imgur.com/r2AuFm7.png'},
    {label: 'Green', url:'https://i.imgur.com/bekbNVR.png'},
    {label: 'Orange', url:'https://i.imgur.com/3HIZM9n.png'},
    {label: 'Purple', url:'https://i.imgur.com/wREUBTt.png'},
    {label: 'Red', url:'https://i.imgur.com/FKitmCU.png'},
    {label: 'Yellow', url:'https://i.imgur.com/51JNbdX.png'},
  ];

  constructor(
    public dialogRef: MatDialogRef<AddPinComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Point
    ){
      this.pin.key = uuidv4();
      this.pin.x = data.x;
      this.pin.y = data.y;
    }
    

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

  get isValid(): boolean {
    return this.pin.name.length > 0 &&
    this.pin.description.length > 0 &&
    this.pin.color.length > 0;
  }
}
