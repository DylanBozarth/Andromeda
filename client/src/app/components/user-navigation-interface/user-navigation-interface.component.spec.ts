import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserNavigationInterfaceComponent } from './user-navigation-interface.component';

describe('UserNavigationInterfaceComponent', () => {
  let component: UserNavigationInterfaceComponent;
  let fixture: ComponentFixture<UserNavigationInterfaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserNavigationInterfaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserNavigationInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
