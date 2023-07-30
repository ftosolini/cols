import { Component, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav'

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  @ViewChild('rightPanel') rightMenu!: MatDrawer
    async toggleRightPanel(isOpen?: boolean) {
      await this.rightMenu.toggle(isOpen)
    }
}
