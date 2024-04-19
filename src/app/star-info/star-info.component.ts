import { Component, Input, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppComponent } from '../app.component';
import { Star } from '../models/star';
import { Territory } from '../models/territory';
import { NpcStarData, PolityStarData } from '../models/polityStarData';
import { Polity } from '../models/polity';
import { Npc } from '../models/npc';
import { TerritoryType } from '../enums/territoryType';
import { StarInfo } from '../models/starInfo';

@Component({
  selector: 'app-star-info',
  templateUrl: './star-info.component.html',
  styleUrls: ['./star-info.component.scss']
})
export class StarInfoComponent implements OnChanges {
  constructor(public dialog: MatDialog) {}

  @Input() stars!: Star[];
  @Input() parent!: AppComponent;
  @Input() territories!: Territory[];
  @Input() polities!: Polity[];
  @Input() npcs!: Npc[];

  presentStarInfo: StarInfo[] = [];

  ngOnChanges(): void {
    this.presentStarInfo = this.getStarInfo();
  }

  getFilteredTerritories(hostStarKey: string): Territory[] {
    return this.territories.filter(t => t.hostStarKey === hostStarKey);
  }

  openPolityByPlayer(player: string): void {
    this.parent.openPolityByPlayer(player);
  }

  getStarInfo(): StarInfo[] {
    var output: StarInfo[] = [];
    for (let j = 0; j < this.stars.length; j++) {
      const star = this.stars[j];
      const hostStarKey = star.key;
      var newInfo = new StarInfo();
      newInfo.starKey = hostStarKey;
      newInfo.starName = star.name;
      newInfo.planetMap = star.planetMap;

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

        var npcs = this.npcs.filter(t => t.starName === hostStarKey);
        var npcStarData: NpcStarData[] = [];
        for (let k = 0; k < npcs.length; k++) {
          const npc = npcs[k];
          var newNpcStarData = new NpcStarData();
          newNpcStarData.npcKey = npc.key;
          newNpcStarData.npcName = npc.name;
          newNpcStarData.npcBlocName = npc.bloc;
          newNpcStarData.location = npc.location;
          newNpcStarData.notes = npc.notes;
          newNpcStarData.players = npc.playerNames;
          newNpcStarData.starKey = npc.starName;
          npcStarData.push(newNpcStarData);          
        }
        npcStarData.sort((a, b) => {
          if (a.npcBlocName < b.npcBlocName) {
            return -1;
          }
          else if (a.npcBlocName > b.npcBlocName) {
            return 1;
          }
          else if (a.npcName < b.npcName) {
            return -1;
          }
          else if (a.npcName > b.npcName) {
            return 1;
          }
          else {
            return 0;
          }})
        newInfo.npcStarData = npcStarData;

        output.push(newInfo);
      }

    return output;
  }

  openPolity(polity: string) {
    this.parent.openPolity(polity);
  }

  openSubMap(url: string, title: string) {
    this.parent.openSubMap(url, title);
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
