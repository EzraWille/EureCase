import { Component, HostListener } from '@angular/core';
import { NavigationEnd, NavigationSkipped, Router } from '@angular/router';
import {
  DataService,
  SideBar,
  SideBarMenu,
  routes,
} from 'src/app/core/core.index';
import { SideBarService } from 'src/app/core/services/side-bar/side-bar.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  status = false;
  public miniSidebar = false;
  elem = document.documentElement;
  isScrolled = false;
  base = '';
  page = '';
  menudata!: SideBarMenu;
  side_bar_data: Array<SideBar> = [];

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 300;
  }

  constructor(
    public router: Router,
    // private auth: AuthService,
    private data: DataService,
    private sideBar: SideBarService
  ) {
    this.sideBar.toggleSideBar.subscribe((res: string) => {
      if (res == 'true') {
        this.miniSidebar = true;
      } else {
        this.miniSidebar = false;
      }
    });

    router.events.subscribe((event: object) => {
      if (event instanceof NavigationEnd) {
        const splitVal = event.url.split('/');
        this.base = splitVal[1];
        this.page = splitVal[2];
      } else if (event instanceof NavigationSkipped) {
        const splitVal = event.url.split('/');
        this.base = splitVal[1];
        this.page = splitVal[2];
      }
    });
    // get sidebar data as observable because data is controlled for design to expand submenus
    this.data.getSideBarData.subscribe((res: Array<SideBar>) => {
      this.side_bar_data = res;
    });
  }

  public logOut(): void {
    localStorage.removeItem('token');
     this.router.navigate(['/auth']);
  }
  public toggleSideBar(): void {
    this.sideBar.switchSideMenuPosition();
  }
  public toggleMobileSideBar(): void {
    this.sideBar.switchMobileSideBarPosition();
  }

  Logout() {
    localStorage.removeItem('LoginData');
    this.router.navigate(['/login']);
  }
  public miniSideBarMouseHover(position: string): void {
    if (position == 'over') {
      this.sideBar.expandSideBar.next('true');
    } else {
      this.sideBar.expandSideBar.next('false');
    }
  }
  fullscreen() {
    if (!document.fullscreenElement) {
      this.elem.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }
  showdropdown() {
    this.status = !this.status;
  }
}
