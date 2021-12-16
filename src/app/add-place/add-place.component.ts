import { Component, Inject, OnInit } from '@angular/core';
import { Place } from '../models/place';
import { Square } from '../models/square';
import { v4 as uuidv4 } from 'uuid';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-place',
  templateUrl: './add-place.component.html',
  styleUrls: ['./add-place.component.scss']
})
export class AddPlaceComponent implements OnInit {
  place: Place = new Place();

  constructor(
    public dialogRef: MatDialogRef<AddPlaceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Square
    ){
      this.place.key = uuidv4();
      this.place.xStart = data.xStart;
      this.place.yStart = data.yStart;
      this.place.xEnd = data.xEnd;
      this.place.yEnd = data.yEnd;
    }
    

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

  get isValid(): boolean {
    return this.place.name.length > 0 &&
    this.place.description.length > 0 &&
    this.place.picture.length > 0;
  }
}
