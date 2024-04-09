import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppComponent } from '../app.component';
import { Star } from '../models/star';
import { Territory } from '../models/territory';

@Component({
  selector: 'app-star-info',
  templateUrl: './star-info.component.html',
  styleUrls: ['./star-info.component.scss']
})
export class StarInfoComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

  @Input() starInfo!: Star;
  @Input() parent!: AppComponent;
  @Input() territories!: Territory[];

  ngOnInit(): void {
  }

  get filteredTerritories(): Territory[] {
    return this.territories.filter(t => t.hostStarKey === this.starInfo.key);
  }

  // shortened(input: string, count: number): string {
  //   if (input.length < count) {
  //     return input;
  //   } else {
  //     return input.substring(0, count) + "...";
  //   }
  // }

  openPolity(polity: string) {
    this.parent.openPolity(polity);
  }
}
