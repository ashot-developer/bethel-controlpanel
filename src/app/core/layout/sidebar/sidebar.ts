import { Component, ElementRef } from '@angular/core';
import { Menu } from '../menu/menu';

@Component({
  selector: 'bethel-sidebar',
  imports: [Menu],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  constructor(public el: ElementRef) {}
}
