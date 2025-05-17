import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateReserveComponent } from './update-reserve.component';

describe('UpdateReserveComponent', () => {
  let component: UpdateReserveComponent;
  let fixture: ComponentFixture<UpdateReserveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateReserveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateReserveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
