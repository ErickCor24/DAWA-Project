import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { AuthServiceService } from '../../../services/auth/auth-service.service';

@Component({
  selector: 'app-header-component',
  imports: [CommonModule, RouterLink, RouterLink, RouterLinkActive],
  templateUrl: './header-component.component.html',
  styleUrl: './header-component.component.css',
})
export class HeaderComponentComponent implements OnInit {
  sessionAvalible: boolean = false;
  typeaccountLoggued: number = 0;

  constructor(
    private router: Router,
    private _authService: AuthServiceService
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateLoginStatus();
        this.updateTypeAcountLoggued();
      }
    });
  }

  updateLoginStatus = () => {
    if (localStorage.getItem('token')) {
      this.sessionAvalible = true;
    } else {
      this.sessionAvalible = false;
    }
  };

  updateTypeAcountLoggued = () => {
    const role = this._authService.getRole();

    switch (role) {
      case 'client':
        this.typeaccountLoggued = 1;
        break;
      case 'company':
        this.typeaccountLoggued = 2;
        break;
      default:
        this.typeaccountLoggued = 0;
    }
  };

  logout = () => {
    this._authService.removeAuthToken();
    this.updateLoginStatus();
    this.typeaccountLoggued = 0;
    this.router.navigate(['/home']);
  };
}
