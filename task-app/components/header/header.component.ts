import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  navLinks = [
    'Dashboard',
    'Companies',
    'Finance',
    'HNIs',
    'Messaging',
    'Meetings',
    'Notes',
    'Documents'
  ];
}