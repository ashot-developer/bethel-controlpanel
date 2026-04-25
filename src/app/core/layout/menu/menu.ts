
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BethelMenuItem } from '../menu-item/menu-item';
import { MenuItem } from 'primeng/api';
import { MenuItems } from '../../consts/menu.constants';

@Component({
  selector: 'bethel-menu',
  imports: [BethelMenuItem, RouterModule],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu implements OnInit {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = MenuItems;
    }
}
