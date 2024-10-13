import { Component, Input, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { SurveyStar } from '../models/surveyStar';

@Component({
  selector: 'app-hover-data',
  templateUrl: './hover-data.component.html',
  styleUrls: ['./hover-data.component.scss']
})
export class HoverDataComponent implements OnInit {

  constructor() { }
  
  @Input() parent!: AppComponent;
  @Input() star!: SurveyStar;
  textOpacity = 0;
  wasThisVisible = false;
  get thisIsVisible() {
    let willBeVisible = this.star?.imageLink == this.parent.activeSurveyStar?.imageLink;

    if (!this.wasThisVisible && willBeVisible){
      //start fade in
      setTimeout(() => this.textOpacity = 1, 3000);       
    }

    if (this.wasThisVisible && !willBeVisible){
      //reset fade in
      this.textOpacity = 0;
    }

    this.wasThisVisible = willBeVisible;
    return willBeVisible;
  }

  ngOnInit(): void {
  }

  activeStarImageLink(){
    return "https://i.imgur.com/DoK6glm.gif" + '?v=$' + this.parent.randomSeed;
  }

  hoverImageStyleObject(): object {
    return {
      'display': this.thisIsVisible ? 'grid' : 'none',
      'position': 'absolute',
      'left': this.star?.x + 'px',
      'top': this.star?.y + 'px'
    };
  }

  hoverTextStyleObject(): object {
    return {
      'opacity': this.textOpacity.toString()
    };
  }

  unhoverStar(){
    this.parent.mouseIsOffPiste = true;
    const db = this.debounce(
      this.dismissHoverImage,
      500
    );
    db(this);
  }

  hoverStar(){
    this.parent.mouseIsOffPiste = false;
  }

  dismissHoverImage(self: any) {
    if (self.parent.mouseIsOffPiste) {
      self.parent.changeSeed();
      self.parent.activeSurveyStar = null;
    }
  }

  debounce = (fn: Function, ms = 300) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return function (this: any, ...args: any[]) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), ms);
    };
  };
}
