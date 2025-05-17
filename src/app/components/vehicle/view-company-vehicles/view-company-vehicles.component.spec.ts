import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCompanyVehiclesComponent } from './view-company-vehicles.component';

describe('ViewCompanyVehiclesComponent', () => {
  let component: ViewCompanyVehiclesComponent;
  let fixture: ComponentFixture<ViewCompanyVehiclesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewCompanyVehiclesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCompanyVehiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
