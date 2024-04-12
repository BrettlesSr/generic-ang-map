import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppComponent } from '../app.component';
import { Star } from '../models/star';
import { Territory } from '../models/territory';
import { PolityStarData } from '../models/polityStarData';
import { Polity } from '../models/polity';
import { TerritoryType } from '../enums/territoryType';

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
  @Input() polities!: Polity[];

  polityStarData: PolityStarData[] = [];

  ngOnInit(): void {
    this.polityStarData = this.getPolityStarData();
  }

  get filteredTerritories(): Territory[] {
    return this.territories.filter(t => t.hostStarKey === this.starInfo.key);
  }

  getPolityStarData(): PolityStarData[] {
    var territories  = this.filteredTerritories;
    var polityStarData: PolityStarData[] = [];
    for (let i = 0; i < territories.length; i++) {
      const territory = territories[i];
      var matchingPolityStarDataList = polityStarData.filter(d => d.polityKey == territory.ownerPolityKey);
      if (matchingPolityStarDataList.length > 0){
        switch (territory.type) {
          case TerritoryType.Territory:
            matchingPolityStarDataList[0].territoryCount++;
            break;
          case TerritoryType.Entanglement:
            matchingPolityStarDataList[0].entanglementCount++;
            break;
          case TerritoryType.Quagmire:
            matchingPolityStarDataList[0].quagmireCount++;
            break;
          default:
            break;
        }
      }
      else {
        var matchingPolityList = this.polities.filter(p => p.key == territory.ownerPolityKey);
        const newData = new PolityStarData();
        newData.polityKey = territory.ownerPolityKey;
        newData.polityName = matchingPolityList[0].name;
        newData.polityBlocName = matchingPolityList[0].bloc;
        newData.starKey = territory.hostStarKey;
        newData.territoryCount = 0;
        newData.entanglementCount = 0;
        newData.quagmireCount = 0;
        switch (territory.type) {
          case TerritoryType.Territory:
            newData.territoryCount++;
            break;
          case TerritoryType.Entanglement:
            newData.entanglementCount++;
            break;
          case TerritoryType.Quagmire:
            newData.quagmireCount++;
            break;
          default:
            break;
        }
        polityStarData.push(newData);
      }
    }

    return polityStarData;
  }

  openPolity(polity: string) {
    this.parent.openPolity(polity);
  }
}
