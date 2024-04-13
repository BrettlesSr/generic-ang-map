import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppComponent } from '../app.component';
import { Star } from '../models/star';
import { Territory } from '../models/territory';
import { PolityStarData } from '../models/polityStarData';
import { Polity } from '../models/polity';
import { TerritoryType } from '../enums/territoryType';
import { StarInfo } from '../models/starInfo';

@Component({
  selector: 'app-star-info',
  templateUrl: './star-info.component.html',
  styleUrls: ['./star-info.component.scss']
})
export class StarInfoComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

  @Input() stars!: Star[];
  @Input() parent!: AppComponent;
  @Input() territories!: Territory[];
  @Input() polities!: Polity[];

  presentStarInfo: StarInfo[] = [];

  ngOnInit(): void {
    this.presentStarInfo = this.getStarInfo();
    console.log(this.presentStarInfo);
  }

  getFilteredTerritories(hostStarKey: string): Territory[] {
    return this.territories.filter(t => t.hostStarKey === hostStarKey);
  }

  getStarInfo(): StarInfo[] {
    var output: StarInfo[] = [];
    for (let j = 0; j < this.stars.length; j++) {
      const star = this.stars[j];
      const hostStarKey = star.key;
      var newInfo = new StarInfo();
      newInfo.starKey = hostStarKey;
      newInfo.starName = star.name;

      var territories  = this.territories.filter(t => t.hostStarKey === hostStarKey);
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

      polityStarData.sort((a, b) => {
        if (a.polityBlocName < b.polityBlocName) {
          return -1;
        }
        else if (a.polityBlocName > b.polityBlocName) {
          return 1;
        }
        else if (a.polityName < b.polityName) {
          return -1;
        }
        else if (a.polityName > b.polityName) {
          return 1;
        }
        else {
          return 0;
        }})


        newInfo.polityStarData = polityStarData;
        output.push(newInfo);
      }
    return output;
  }

  openPolity(polity: string) {
    this.parent.openPolity(polity);
  }

  getBlocColour(bloc: string): string {
    switch (bloc) {
      case "ViSTA":
        return "#4DB9E2"
      case "Iridium Pact":
        return "#808080"
      case "CFN":
        return "#04448B"
      case "Ares Coalition":
        return "#650202"
      case "PA":
        return "#FFB810"
      case "RABID":
        return "#FF2727"
      case "Team W-Y":
          return "#084F09"
      case "UCCA":
            return "#2CC21D"
    
      default:
        return "#000000";
    }
  }
}
