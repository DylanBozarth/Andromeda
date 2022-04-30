import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemViewComponent } from './system-view.component';

describe('SystemViewComponent', () => {
  let component: SystemViewComponent;
  let fixture: ComponentFixture<SystemViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
