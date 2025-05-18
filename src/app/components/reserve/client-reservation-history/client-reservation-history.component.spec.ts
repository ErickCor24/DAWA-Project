import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientReservationHistoryComponent } from './client-reservation-history.component';

describe('ClientReservationHistoryComponent', () => {
  let component: ClientReservationHistoryComponent;
  let fixture: ComponentFixture<ClientReservationHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientReservationHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientReservationHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
