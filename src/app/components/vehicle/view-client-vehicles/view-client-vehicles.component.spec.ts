import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewClientVehiclesComponent } from './view-client-vehicles.component';

describe('ViewClientVehiclesComponent', () => {
  let component: ViewClientVehiclesComponent;
  let fixture: ComponentFixture<ViewClientVehiclesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewClientVehiclesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewClientVehiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
