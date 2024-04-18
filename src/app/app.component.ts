import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PanZoomConfig, PanZoomAPI } from 'ngx-panzoom';
import { Observable, Subscription, map } from 'rxjs';
import { DrawerMode } from './enums/drawerMode';
import { Territory } from './models/territory';
import { Polity } from './models/polity';
import { Star } from './models/star';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import * as Papa from 'papaparse';
import { TerritoryType } from './enums/territoryType';
import { SubMapModalComponent } from './sub-map-modal/sub-map-modal.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  mapUrls = ['https://i.imgur.com/xbHRYRH.png'];
  mapIndex = 0;
  mapHeight = 1000;
  mapWidth = 1000;
  isOpen = false;
  timeToOpen = 270;
  scrollCountdown = 0;
  panZoomConfig: PanZoomConfig = new PanZoomConfig();
  private panZoomAPI!: PanZoomAPI;
  private apiSubscription!: Subscription;
  hasLoaded = false;
  title = 'fta4-ang-map'

  //marker box
  xStart: number = 0; xEnd: number = 0; yStart: number = 0; yEnd: number = 0;

  @ViewChild('drawer') drawer?: { open: () => void; close: () => void; };
  @ViewChild('titleChild') titleChild?: { buildOptions: () => void; };

  activeStar!: Star;
  activeStars!: Star[];
  activePolity!: Polity;
  stars: Star[] = [];
  territories : Territory[] = [];
  polities : Polity[] = [];
  drawerMode: DrawerMode = DrawerMode.Closed;

  constructor(
      public dialog: MatDialog,
      private http: HttpClient
    ){}

  ngOnInit(): void {
    this.panZoomConfig.keepInBounds = false;
    this.panZoomConfig.zoomLevels = 7;
    this.panZoomConfig.neutralZoomLevel = 3;
    this.panZoomConfig.scalePerZoomLevel = 1.5;
    this.panZoomConfig.freeMouseWheel = false;
    this.panZoomConfig.invertMouseWheel = true;
    this.panZoomConfig.initialZoomLevel = 2;
    
    this.readInFromDatabase();

    this.apiSubscription = this.panZoomConfig.api.subscribe( (api: PanZoomAPI) => this.panZoomAPI = api );
    for (const url of this.mapUrls) {
      const img = new Image();
      if (url == this.mapUrls[0]) {
        let self = this;
        img.onload = (event: any) => {
          self.mapHeight = img.height;
          self.mapWidth = img.width;
          self.hasLoaded = true;
        }
      }
      img.src = url;
    }
  }

  ngOnDestroy(): void {
    this.apiSubscription.unsubscribe();
  }

  nextMapMode(): void {
    this.mapIndex++;
    if (this.mapIndex + 1 > this.mapUrls.length) {
      this.mapIndex = 0;
    }
  }

  scrollToPoint(x: number, y: number, highlight: boolean): void {
    if (highlight) {
      this.scrollCountdown = 1000;
      setTimeout(() => {
        this.tickDownCountdown();
      }, 1500);
    }
    
    const point = {
      x: x,
      y: y
    };
    setTimeout(() => {
      this.panZoomAPI.detectContentDimensions();
      //this.panZoomAPI.panToPoint(point);
    }, (this.isOpen ? 0 : this.timeToOpen));
  }

  tickDownCountdown(): void {
    if (this.scrollCountdown < 10){
      this.scrollCountdown = 0;
    }
    else {
      this.scrollCountdown = this.scrollCountdown - 10;
      setTimeout(() => {
        this.tickDownCountdown();
      }, 10);
    }
  }

  openDrawerToStar(key: string): void {
    const matching = this.stars.filter(a => a.key === key);
    if (matching.length > 0 && this.drawer !== undefined) {
      this.drawer.open();
      this.isOpen = true;
      this.activeStar = matching[0];
      this.activeStars = this.getActiveStars();
      this.drawerMode = DrawerMode.Star;
      this.scrollToPoint(this.activeStar.x, this.activeStar.y, true);
      this.xStart = this.activeStar.xStart;
      this.yStart = this.activeStar.yStart;
      this.xEnd = this.activeStar.xEnd;
      this.yEnd = this.activeStar.yEnd;
    }
  }

  openStar(key: string): void {
    const matching = this.stars.filter(a => a.key === key);
    if (matching.length > 0 && this.drawer !== undefined) {
      this.activeStar = matching[0];
      this.activeStars = this.getActiveStars();
      this.drawerMode = DrawerMode.Star;
      this.scrollToPoint(this.activeStar.x, this.activeStar.y, false);
      this.xStart = this.activeStar.xStart;
      this.yStart = this.activeStar.yStart;
      this.xEnd = this.activeStar.xEnd;
      this.yEnd = this.activeStar.yEnd;
    }
  }

  openDrawerToPolity(key: string): void {
    const matching = this.polities.filter(a => a.key === key);
    if (matching.length > 0 && this.drawer !== undefined) {
      this.drawer.open();
      this.isOpen = true;
      this.activePolity = matching[0];
      this.drawerMode = DrawerMode.Polity;
    }
  }

  openPolity(key: string): void {
    const matching = this.polities.filter(a => a.key === key);
    if (matching.length > 0 && this.drawer !== undefined) {
      this.activePolity = matching[0];
      this.drawerMode = DrawerMode.Polity;
    }
  }

  openDrawerToTerritory(key: string): void {
    const matching = this.territories.filter(a => a.key === key);    
    if (matching.length > 0 && this.drawer !== undefined) {
      const matchingTerritory = matching[0];
      const matchingStars = this.stars.filter(a => a.key === matchingTerritory.hostStarKey);
      if (matchingStars.length > 0 ) {
        this.drawer.open();
        this.isOpen = true;
        this.activeStar = matchingStars[0];
        this.activeStars = this.getActiveStars();
        this.drawerMode = DrawerMode.Star;
        this.scrollToPoint(this.activeStar.x, this.activeStar.y, true);
        this.xStart = this.activeStar.xStart;
        this.yStart = this.activeStar.yStart;
        this.xEnd = this.activeStar.xEnd;
        this.yEnd = this.activeStar.yEnd;
      }
    }
  }

  closeDrawer(): void {
    if (this.drawer !== undefined) {
      this.drawer.close();
    }
    this.drawerMode = DrawerMode.Closed;
    setTimeout(() => {
      this.isOpen = false;
    }, this.timeToOpen);
  }

  readInFromDatabase(){
    //stars
    this.fetchGoogleSheet('1u2EooPBVCUnKPOBBQBoLaX7pNoe0pu55PuqDsEcbjQ8', 'Stars')
    .subscribe((csv: string) => {
      var data = Papa.parse(csv, { header: true});
      var stars = [];
      for (let i = 0; i < data.data.length; i++) {
        const element = data.data[i] as any;
        const newStar = new Star();
        newStar.key = element["Name"];
        newStar.name = element["Name"];
        newStar.planetMap = element["planetMap"];
        newStar.spaceMap = element["spaceMap"];
        newStar.xStart = Number(element["xStart"]);
        newStar.yStart = Number(element["yStart"]);
        newStar.xEnd = Number(element["xEnd"]);
        newStar.yEnd = Number(element["yEnd"]);
        newStar.x = (newStar.xStart + newStar.xEnd)/2.0
        newStar.y = (newStar.yStart + newStar.yEnd)/2.0
        stars.push(newStar);
      }
      this.stars = stars;
      this.titleChild?.buildOptions();
    });

    //polities
    this.fetchGoogleSheet('1u2EooPBVCUnKPOBBQBoLaX7pNoe0pu55PuqDsEcbjQ8', 'Polities')
    .subscribe((csv: string) => {
      var data = Papa.parse(csv, { header: true});
      var polities = [];
      for (let j = 0; j < data.data.length; j++) {
        const element = data.data[j] as any;
        const newPolity = new Polity();
        newPolity.key = element["Nation Name"];
        newPolity.name = element["Nation Name"];
        newPolity.player = element["Player"];
        newPolity.gdp = Number(element["Wealth"].replace("$", "").replace(",", ""));
        newPolity.di = Number(element["DI"].replace(",", ""));
        newPolity.bloc = element["Bloc"];
        polities.push(newPolity);
      }
      this.polities = polities;
      this.titleChild?.buildOptions();
    });

    //territories
    this.fetchGoogleSheet('1u2EooPBVCUnKPOBBQBoLaX7pNoe0pu55PuqDsEcbjQ8', 'Territories')
    .subscribe((csv: string) => {
      var data = Papa.parse(csv, { header: true});
      var territories = [];
      for (let k = 0; k < data.data.length; k++) {
        const element = data.data[k] as any;
        for (let l = 0; l < Object.keys(element).length; l++) {
          const prop = Object.keys(element)[l];
          
          if (prop !== "Nation Name") {
            
            var type = prop.slice(prop.length - 1);
            var starKey = prop.slice(0, prop.length - 2);
            var count = Number(element[prop]);            
            if (count !== 0) {
              var actualCount = Number(count);              
              for (let m = 0; m < actualCount; m++) {
                const newTerritory = new Territory();
                newTerritory.ownerPolityKey = element["Nation Name"]   
                newTerritory.hostStarKey = starKey
                newTerritory.key = starKey + element["Nation Name"] + type + String(m);
                newTerritory.name = element["Nation Name"] + " " + starKey + " " + (type === "T" ? "Territory" : type === "E" ? "Entanglement" : "Quagmire") + " " + String(m + 1);
                newTerritory.type = type === "T" ? TerritoryType.Territory : type === "E" ? TerritoryType.Entanglement : TerritoryType.Quagmire;
                territories.push(newTerritory);
              }
            }
          }
        }
      }
      this.territories = territories;
      this.titleChild?.buildOptions();
    });
  }

  bestFit(record: any, allPolities: Polity[]) {
    const pureMatch = allPolities.find(r => record['Formal Name (for map)'] === r.name);
    if (pureMatch !== undefined) {
      return pureMatch;
    }
    return undefined;
  }

  fetchGoogleSheet(id: string, page: string): Observable<string> {
    const options: {
        headers?: HttpHeaders;
        observe?: 'body';
        params?: HttpParams;
        reportProgress?: boolean;
        responseType: 'text';
        withCredentials?: boolean;
    } = {
        responseType: 'text'
    };

    return this.http
        .get('https://docs.google.com/spreadsheets/d/' + id + '/gviz/tq?tqx=out:csv&sheet=' + page, options)
        .pipe(
            map((file: string) => {
                return file;
            })
        );
  }

  get highlightDimensionsCss(): object{
    if (this.scrollCountdown === 0) {
      return {
        height: this.mapHeight + 'px',
        width: this.mapWidth + 'px',
        top: '0px',
        left: '0px',
        'box-shadow': '0 0 0 100vmax rgba(0,0,0,0)'
     };
    }
    const alpha = (this.scrollCountdown / 1200).toFixed(1);
    const topPoint = Math.min(this.yStart ?? 0, this.yEnd ?? 0) * 1.0;
    const leftPoint = Math.min(this.xStart ?? 0, this.xEnd ?? 0) * 1.0;
    return {
       height: Math.abs(this.yEnd - this.yStart).toFixed(0) + 'px',
       width: Math.abs(this.xEnd - this.xStart).toFixed(0) + 'px',
       top: topPoint.toFixed(0) + 'px',
       left: leftPoint.toFixed(0) + 'px',
       'box-shadow': ('0 0 0 1000vmax rgba(0,0,0,' + alpha + ')')
    };
  }

  getActiveStars(): Star[] {
    if (this.activeStar.key === "Solar") {
      const earth = this.stars.filter(s => s.key === "Earth")[0];
      const solar = this.stars.filter(s => s.key === "Solar")[0];
      return [ solar, earth ]
    }
    else if (this.activeStar.key === "Earth") {
      const earth = this.stars.filter(s => s.key === "Earth")[0];
      const solar = this.stars.filter(s => s.key === "Solar")[0];
      return [ earth, solar ]
    }
    else {
      return [ this.activeStar ];
    }
  }

  openSubMap(subMapUrl: string, subMapTitle: string): void {
    this.dialog.open(SubMapModalComponent, {
      width: '1800px',
      height: '900px',
      data: { subMapUrl, subMapTitle }
    });
  }
}