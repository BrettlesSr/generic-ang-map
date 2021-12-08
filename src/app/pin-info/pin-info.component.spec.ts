import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PinInfoComponent } from './pin-info.component';

describe('PinInfoComponent', () => {
  let component: PinInfoComponent;
  let fixture: ComponentFixture<PinInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PinInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PinInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
