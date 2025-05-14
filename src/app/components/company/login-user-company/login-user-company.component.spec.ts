import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginUserCompanyComponent } from './login-user-company.component';

describe('LoginUserCompanyComponent', () => {
  let component: LoginUserCompanyComponent;
  let fixture: ComponentFixture<LoginUserCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginUserCompanyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginUserCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
