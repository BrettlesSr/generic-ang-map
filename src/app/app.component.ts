
import { Component, OnInit } from '@angular/core';
import { PanZoomConfig, PanZoomAPI } from 'ngx-panzoom';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'generic-ang-map';
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

  ngOnInit(): void {
    this.panZoomConfig.keepInBounds = false;
    this.panZoomConfig.zoomLevels = 7;
    this.panZoomConfig.neutralZoomLevel = 5;
    this.panZoomConfig.scalePerZoomLevel = 1.5;
    this.panZoomConfig.freeMouseWheel = false;
    this.panZoomConfig.invertMouseWheel = true;
    this.panZoomConfig.initialZoomLevel = 3;
    this.apiSubscription = this.panZoomConfig.api.subscribe( (api: PanZoomAPI) => this.panZoomAPI = api );
    for (const url of this.mapUrls) {
      const img = new Image();
      if (url == this.mapUrls[0]) {
        let self = this;
        img.onload = (event: any) => {
          self.mapHeight = event.path[0].height;
          self.mapWidth = event.path[0].width;
          self.scrollToPoint(self.mapWidth / 2, self.mapHeight / 2)
        }
      }
      img.src = url;
    }
  }

  nextMapMode(): void {
    this.mapIndex++;
    if (this.mapIndex + 1 > this.mapUrls.length) {
      this.mapIndex = 0;
    }
  }

  scrollToPoint(x: number, y: number): void {
    this.scrollCountdown = 1000;
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
    setTimeout(() => {
      this.tickDownCountdown();
    }, 1500);
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

  get highlightDimensionsCss(): object{
    return {
      height: this.mapHeight + 'px',
      width: this.mapWidth + 'px',
      top: '0px',
      left: '0px',
      'box-shadow': '0 0 0 100vmax rgba(0,0,0,0)'
   };
    // if (this.scrollCountdown === 0) {
    //   return {
    //     height: this.mapDimension + 'px',
    //     width: this.mapDimension + 'px',
    //     top: '0px',
    //     left: '0px',
    //     'box-shadow': '0 0 0 100vmax rgba(0,0,0,0)'
    //  };
    // }
    // const alpha = (this.scrollCountdown / 2300).toFixed(1);
    // return {
    //    height: Math.abs(this.activeStar.yEnd - this.activeStar.yStart).toFixed(0) + 'px',
    //    width: Math.abs(this.activeStar.xEnd - this.activeStar.xStart).toFixed(0) + 'px',
    //    top: ((this.activeStar.yStart ?? 0) * 1).toFixed(0) + 'px',
    //    left: ((this.activeStar.xStart ?? 0) * 1).toFixed(0) + 'px',
    //    'box-shadow': ('0 0 0 100vmax rgba(0,0,0,' + alpha + ')')
    // };
  }
}