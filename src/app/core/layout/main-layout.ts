import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'bethel-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss'
})
export class MainLayout {
  constructor() {}
}