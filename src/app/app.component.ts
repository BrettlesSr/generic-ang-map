import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PanZoomConfig, PanZoomAPI, PanZoomModel } from 'ngx-panzoom';
import { Subscription } from 'rxjs';
import { AddPinComponent } from './add-pin/add-pin.component';
import { AddPlaceComponent } from './add-place/add-place.component';
import { AppMode } from './enums/appMode';
import { DrawerMode } from './enums/drawerMode';
import { Pin } from './models/pin';
import { Place } from './models/place';
import { Point } from './models/point';
import { Square } from './models/square';
import { AngularFireDatabase } from '@angular/fire/compat/database';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  mapUrls = ['https://cdn.discordapp.com/attachments/908862090738012170/915667261983952936/airshipgamemap.jpg'];
  mapIndex = 0;
  mapHeight = 1000;
  mapWidth = 1000;
  isOpen = false;
  timeToOpen = 270;
  scrollCountdown = 0;
  panZoomConfig: PanZoomConfig = new PanZoomConfig();
  private panZoomAPI!: PanZoomAPI;
  private apiSubscription!: Subscription;
  mode: AppMode = AppMode.Normal;
  hasLoaded = false;

  //marker box
  xStart: number = 0; xEnd: number = 0; yStart: number = 0; yEnd: number = 0;

  @ViewChild('drawer') drawer?: { open: () => void; close: () => void; };

  pins: Pin[] = [];
  places: Place[] = [];
  activePlace: Place = new Place();
  activePin: Pin = new Pin();
  drawerMode: DrawerMode = DrawerMode.Closed;

  points: Point[] = [];
  resolution = 20;

  pointBuffer: Point = new Point();

  constructor(public dialog: MatDialog, private db: AngularFireDatabase){}

  ngOnInit(): void {
    this.panZoomConfig.keepInBounds = false;
    this.panZoomConfig.zoomLevels = 7;
    this.panZoomConfig.neutralZoomLevel = 5;
    this.panZoomConfig.scalePerZoomLevel = 1.5;
    this.panZoomConfig.freeMouseWheel = false;
    this.panZoomConfig.invertMouseWheel = true;
    this.panZoomConfig.initialZoomLevel = 3;
    
    this.db.list<Place>('/places').valueChanges().subscribe((places: Place[]) => {
      this.places = places;
    });
    this.db.list<Pin>('/pins').valueChanges().subscribe((pins: Pin[]) => {
      this.pins = pins;
    });

    this.apiSubscription = this.panZoomConfig.api.subscribe( (api: PanZoomAPI) => this.panZoomAPI = api );
    for (const url of this.mapUrls) {
      const img = new Image();
      if (url == this.mapUrls[0]) {
        let self = this;
        img.onload = (event: any) => {
          self.mapHeight = event.path[0].height;
          self.mapWidth = event.path[0].width;
          //self.scrollToPoint(self.mapWidth / 2, self.mapHeight / 2, false); TODO get this working properly
          self.hasLoaded = true;
          for (let x = 0; x < self.mapWidth; x += this.resolution) {
            for (let y = 0; y < self.mapHeight; y += this.resolution) {
              self.points.push({x, y});
            }
          }
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
    
    const zoom = this.panZoomAPI.model.zoomLevel;
    const adjustment = (1080 / zoom) - 110;
    const point = {
      x: x * 1 + adjustment,
      y: y * 1
    };
    setTimeout(() => {
      this.panZoomAPI.detectContentDimensions();
      this.panZoomAPI.panToPoint(point);
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

  addMapPinClicked(): void {
    switch (this.mode) {
      case AppMode.Normal:
        this.mode = AppMode.AddingPin;
        break;
      default:
        this.mode = AppMode.Normal;
        break;
    }
  }

  addPlaceClicked(): void {
    switch (this.mode) {
      case AppMode.Normal:
        this.mode = AppMode.AddingPlacePoint1;
        break;
      default:
        this.mode = AppMode.Normal;
        break;
    }
  }

  openDrawerToPlace(key: string): void {
    const matching = this.places.filter(a => a.key === key);
    if (matching.length > 0 && this.drawer !== undefined) {
      this.drawer.open();
      this.isOpen = true;
      this.activePlace = matching[0];
      this.drawerMode = DrawerMode.Place;
    }
  }

  openDrawerToPin(key: string): void {
    const matching = this.pins.filter(a => a.key === key);
    if (matching.length > 0 && this.drawer !== undefined) {
      this.drawer.open();
      this.isOpen = true;
      this.activePin = matching[0];
      this.drawerMode = DrawerMode.Place;
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

  registerLocation(x: number, y: number) {
    this.closeDrawer();
    switch (this.mode) {
      case AppMode.AddingPin:
        this.openMapPinDialog(x, y);
        break;
      case AppMode.AddingPlacePoint1:
        this.pointBuffer = { x, y };
        this.mode = AppMode.AddingPlacePoint2;
        break;
      case AppMode.AddingPlacePoint2:
        this.openMapPlaceDialog({ xStart: this.pointBuffer.x, yStart: this.pointBuffer.y, xEnd: x, yEnd: y});
        break;
      default:
        break;
    }
  }

  openMapPinDialog(x: number, y: number) {
    const dialogRef = this.dialog.open(AddPinComponent, {
      width: '600px',
      data: { x, y }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.mode = AppMode.Normal;
      if (result === undefined) {
        return;
      }
      this.db.list('/pins').push(result);
    });
  }

  openMapPlaceDialog(square: Square) {
    const dialogRef = this.dialog.open(AddPlaceComponent, {
      width: '600px',
      data: square
    });

    dialogRef.afterClosed().subscribe(result => {
      this.mode = AppMode.Normal;
      if (result === undefined) {
        return;
      }
      this.db.list('/places').push(result);
    });
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
    const alpha = (this.scrollCountdown / 2300).toFixed(1);
    return {
       height: Math.abs(this.yEnd - this.yStart).toFixed(0) + 'px',
       width: Math.abs(this.xEnd - this.xStart).toFixed(0) + 'px',
       top: ((this.yStart ?? 0) * 1).toFixed(0) + 'px',
       left: ((this.xStart ?? 0) * 1).toFixed(0) + 'px',
       'box-shadow': ('0 0 0 100vmax rgba(0,0,0,' + alpha + ')')
    };
  }

  get mapPinButtonLabel(): string {
    switch (this.mode) {
      case AppMode.Normal:
        return '    Add Pin';
      case AppMode.AddingPin:
        return '    Click on Map to Add Pin';
      case AppMode.AddingPlacePoint1:
      case AppMode.AddingPlacePoint2:
        return '    Add Pin';
      default:
        return '';
    }
  }

  get placeButtonLabel(): string {
    switch (this.mode) {
      case AppMode.Normal:
        return '    Add Place';
      case AppMode.AddingPin:
        return '    Add Place';
      case AppMode.AddingPlacePoint1:
      case AppMode.AddingPlacePoint2:
        return '    Click on Map twice to Add Place';
      default:
        return '';
    }
  }
}