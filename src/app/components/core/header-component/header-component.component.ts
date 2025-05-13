import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header-component',
  imports: [CommonModule, RouterLink],
  templateUrl: './header-component.component.html',
  styleUrl: './header-component.component.css'
})
export class HeaderComponentComponent implements OnInit {

  sessionAvalible: boolean = false;
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateLoginStatus();
      }
    })
  }

  updateLoginStatus = () => {
    if (sessionStorage.getItem('idCompany')) {
      this.sessionAvalible = true;
    } else {
      this.sessionAvalible = false;
    }
  }

  logout = () => {
    sessionStorage.removeItem('idCompany');
    this.updateLoginStatus();
    this.router.navigate(["/company/login"]);
  }
}
