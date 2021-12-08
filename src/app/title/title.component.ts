import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { AppComponent } from '../app.component';
import { Option } from '../models/option';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss']
})
export class TitleComponent implements OnInit {

  @Input() parent!: AppComponent;
  searchFormControl = new FormControl('', []);
  options: Option[] = [];
  filteredOptions!: Observable<Option[]>;
  showAutoComplete = false;
  showClear = false;

  constructor(
    public dialog: MatDialog
    //,private db: AngularFireDatabase
    ) { }

  @ViewChild('titleChild') titleChild!: { buildOptions: () => void; };

  ngOnInit(): void {
    this.filteredOptions = this.searchFormControl.valueChanges
      .pipe(
        map(value => this._filter(value))
      );
  }

  private _filter(value: string): Option[] {
    return this.options
    .filter(option => option.fullSearchText.toLowerCase().includes(value.toLowerCase()))
    .sort((a, b) => a.order - b.order);
  }

  updatedVal(e: any): void {
    if (e && e.length >= 3) {
       this.showAutoComplete = true;
    } else {
       this.showAutoComplete = false;
    }
    if (e && e.length > 0){
      this.showClear = true;
    } else{
      this.showClear = false;
    }
  }

  optionClicked(option: Option): void {
    //this.parent.scrollToStar(option.starName);
    this.showAutoComplete = false;
  }

  clear(): void {
    this.searchFormControl.setValue('');
  }

  buildOptions(): void {
  }

  openAddMapPin(): void {
    this.parent.addMapPinClicked();
  }

  openAddPlace(): void {
    this.parent.addPlaceClicked();
  }
}
