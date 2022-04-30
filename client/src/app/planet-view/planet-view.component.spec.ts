import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanetViewComponent } from './planet-view.component';

describe('PlanetViewComponent', () => {
  let component: PlanetViewComponent;
  let fixture: ComponentFixture<PlanetViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanetViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanetViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
