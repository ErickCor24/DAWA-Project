import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header-component',
  imports: [CommonModule, RouterLink, RouterLink, RouterLinkActive],
  templateUrl: './header-component.component.html',
  styleUrl: './header-component.component.css'
})
export class HeaderComponentComponent implements OnInit {

  sessionAvalible: boolean = false;
  typeaccountLoggued: number = 0;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateLoginStatus();
        this.updateTypeAcountLoggued();
      }
    })
  }

  updateLoginStatus = () => {
    if (sessionStorage.getItem('idCompany') || sessionStorage.getItem('clientSession')) {
      this.sessionAvalible = true;
    } else {
      this.sessionAvalible = false;
    }
  }

  updateTypeAcountLoggued = () => {
    if(sessionStorage.getItem('clientSession')){
      this.typeaccountLoggued = 1;
    } else if (sessionStorage.getItem('idCompany')){
      this.typeaccountLoggued = 2;
    } else {
      this.typeaccountLoggued = 0;
    }
  }

  logout = () => {
    sessionStorage.clear();
    this.updateLoginStatus();
    this.typeaccountLoggued = 0;
    this.router.navigate(["/home"]);
  }
}
