import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GalaticViewComponent } from './galatic-view.component';

describe('GalaticViewComponent', () => {
  let component: GalaticViewComponent;
  let fixture: ComponentFixture<GalaticViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GalaticViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GalaticViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
