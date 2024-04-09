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
    if (option.type === OptionType.Star) {
      this.parent.openDrawerToStar(option.key);
    }
    if (option.type === OptionType.Polity) {
      this.parent.openDrawerToPolity(option.key);
    }
    if (option.type === OptionType.Territory) {
      this.parent.openDrawerToTerritory(option.key);
    }
    this.showAutoComplete = false;
  }

  buildOptions(): void {
    if (this.parent.stars === undefined ||
        this.parent.polities === undefined ||
        this.parent.territories === undefined) {
        return;
    }
    const newOptions = [];
    for (const place of this.parent.stars) {
      newOptions.push({
        label: place.name,
        fullSearchText: place.name,
        key: place.key,
        type: OptionType.Star,
        order: 0
      });
    }
    for (const polity of this.parent.polities) {
      newOptions.push({
        label: polity.name,
        fullSearchText: polity.name,
        key: polity.key,
        type: OptionType.Polity,
        order: 1
      });
    }
    for (const territory of this.parent.territories) {
      newOptions.push({
        label: territory.name,
        fullSearchText: territory.name + territory.hostStarKey + territory.ownerPolityKey,
        key: territory.key,
        type: OptionType.Territory,
        order: 2
      });
    }
    
    this.options = newOptions;
  }

  clear(): void {
    this.searchFormControl.setValue('');
  }
}
