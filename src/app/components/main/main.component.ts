import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-main',
  imports: [RouterOutlet, SidebarComponent, HeaderComponent, CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

    isMenuActive = false;

  openMenu(isMenuActive: any) {
    this.isMenuActive = isMenuActive; // Update menu active state
  }

  closeMenu(isMenuActive: any) {
    this.isMenuActive = isMenuActive; // Update menu active state
  }


}
