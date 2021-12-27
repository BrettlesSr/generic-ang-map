import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { AppComponent } from '../app.component';
import { Option } from '../models/option';
import { MatDialog } from '@angular/material/dialog';
import { OptionType } from '../enums/optionType';

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
    if (option.type === OptionType.Pin) {
      this.parent.openDrawerToPin(option.key);
    }
    if (option.type === OptionType.Place) {
      this.parent.openDrawerToPlace(option.key);
    }
    this.showAutoComplete = false;
  }

  buildOptions(): void {
    if (this.parent.pins === undefined ||
        this.parent.places === undefined) {
        return;
    }
    const newOptions = [];
    for (const place of this.parent.places) {
      newOptions.push({
        label: place.name,
        fullSearchText: place.name + place.description,
        key: place.key,
        type: OptionType.Place,
        order: 0
      });
    }
    for (const pin of this.parent.pins) {
      newOptions.push({
        label: pin.name,
        fullSearchText: pin.name + pin.description,
        key: pin.key,
        type: OptionType.Pin,
        order: 1
      });
    }
    this.options = newOptions;
  }

  clear(): void {
    this.searchFormControl.setValue('');
  }

  openAddMapPin(): void {
    this.parent.addMapPinClicked();
  }

  openAddPlace(): void {
    this.parent.addPlaceClicked();
  }

  get mapPinButtonLabel(): string {
    return this.parent.mapPinButtonLabel;
  }

  get placeButtonLabel(): string {
    return this.parent.placeButtonLabel;
  }
}
