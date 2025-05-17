import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListReserveComponent } from './list-reserve.component';

describe('ListReserveComponent', () => {
  let component: ListReserveComponent;
  let fixture: ComponentFixture<ListReserveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListReserveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListReserveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
