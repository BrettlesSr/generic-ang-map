import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Polity } from '../models/polity';
import { Territory } from '../models/territory';
import { AppComponent } from '../app.component';
import { MatDialog } from '@angular/material/dialog';
import { TerritoryType } from '../enums/territoryType';

@Component({
  selector: 'app-polity-info',
  templateUrl: './polity-info.component.html',
  styleUrls: ['./polity-info.component.scss']
})

export class PolityInfoComponent implements OnInit, OnChanges {
  constructor(public dialog: MatDialog) {}

  @Input() polityInfo!: Polity;
  @Input() parent!: AppComponent;
  @Input() territories!: Territory[];

  filteredTerritories: Territory[] = [];

  ngOnChanges(changes: any): void {
    this.filteredTerritories = this.getFilteredTerritories();
  }

  ngOnInit(): void {
  }

  getFilteredTerritories(): Territory[] {
    return this.territories.filter(t => t.ownerPolityKey === this.polityInfo.key);
  }

getTerritoryDescriptor(territory: Territory): string {
  return territory.name;
}

openStar(star: string) {
    this.parent.openStar(star);
}
}
