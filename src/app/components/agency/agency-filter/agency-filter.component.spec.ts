import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyFilterComponent } from './agency-filter.component';

describe('AgencyFilterComponent', () => {
  let component: AgencyFilterComponent;
  let fixture: ComponentFixture<AgencyFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgencyFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgencyFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
