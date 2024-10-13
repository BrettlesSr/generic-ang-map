import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoverDataComponent } from './hover-data.component';

describe('HoverDataComponent', () => {
  let component: HoverDataComponent;
  let fixture: ComponentFixture<HoverDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HoverDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HoverDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
