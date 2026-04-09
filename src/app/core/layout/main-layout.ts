import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';
import { Topbar } from './topbar/topbar';
import { Sidebar } from './sidebar/sidebar';
import { LayoutService } from '../services/layout.service';

@Component({
  selector: 'bethel-main-layout',
  imports: [
    NgClass,
    RouterOutlet,
    Topbar,
    Sidebar
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss'
})
export class MainLayout {
  public layoutService = inject(LayoutService);

  constructor() {}
}