import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenAdminAccountComponent } from './open-admin-account.component';

describe('OpenAdminAccountComponent', () => {
  let component: OpenAdminAccountComponent;
  let fixture: ComponentFixture<OpenAdminAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenAdminAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenAdminAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
