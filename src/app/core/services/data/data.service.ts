import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { routes } from '../../core.index';
export interface SideBarMenu {
  menuValue: string;
  route: string;
  hasSubRoute: boolean;
  showSubRoute: boolean;
  icon: string;
  base: string;
  subMenus: SubMenu[];
}

export interface SubMenu {
  menuValue: string;
  route: string;
  base: string;
  base2: string;
  base3: string;
  base4: string;
  base5: string;
  base6: string;
}

export interface SideBar {
  tittle: string;
  icon: string;
  showAsTab: boolean;
  separateRoute: boolean;
  menu: SideBarMenu[];
}
@Injectable({
  providedIn: 'root',
})
export class DataService {
  public sideBar: SideBar[] = [
    {
      tittle: 'Main Menu',
      icon: 'airplay',
      showAsTab: true,
      separateRoute: false,
      menu: [
        {
          menuValue: 'Dashboard',
          route: routes.dashboard,
          hasSubRoute: false,
          showSubRoute: false,
          icon: 'space_dashboard',
          base: 'dashboard',
          subMenus: [
            {
              menuValue: '',
              route: '',
              base: 'main',
              base2: '',
              base3: '',
              base4: '',
              base5: '',
              base6: '',
            },
          ],
        },
        {
          menuValue: 'User Profile',
          route: routes.userProfile,
          hasSubRoute: false,
          showSubRoute: false,
          icon: 'account_box',
          base: 'user-profile',
          subMenus: [
            {
              menuValue: '',
              route: '',
              base: 'main',
              base2: '',
              base3: '',
              base4: '',
              base5: '',
              base6: '',
            },
          ],
        },
        {
          menuValue: 'Cases',
          route: routes.cases,
          hasSubRoute: false,
          showSubRoute: false,
          icon: 'auto_awesome_motion',
          base: 'cases-main',
          subMenus: [
            {
              menuValue: '',
              route: '',
              base: 'main',
              base2: '',
              base3: '',
              base4: '',
              base5: '',
              base6: '',
            },
          ],
        },
        {
          menuValue: 'Offers',
          route: routes.offers,
          hasSubRoute: false,
          showSubRoute: false,
          icon: 'handshake',
          base: 'offers-main',
          subMenus: [
            {
              menuValue: '',
              route: '',
              base: 'main',
              base2: '',
              base3: '',
              base4: '',
              base5: '',
              base6: '',
            },
          ],
        },
        {
          menuValue: 'Contracts',
          route: routes.contracts,
          hasSubRoute: false,
          showSubRoute: false,
          icon: 'drive_file_rename_outline',
          base: 'contracts-main',
          subMenus: [
            {
              menuValue: '',
              route: '',
              base: 'main',
              base2: '',
              base3: '',
              base4: '',
              base5: '',
              base6: '',
            },
          ],
        },
        {
          menuValue: 'Prizes',
          route: routes.prizes,
          hasSubRoute: false,
          showSubRoute: false,
          icon: 'workspace_premium',
          base: 'prizes',
          subMenus: [
            {
              menuValue: '',
              route: '',
              base: 'main',
              base2: '',
              base3: '',
              base4: '',
              base5: '',
              base6: '',
            },
          ],
        },
        {
          menuValue: 'Finance',
          route: routes.finance,
          hasSubRoute: false,
          showSubRoute: false,
          icon: 'insert_chart',
          base: 'finance',
          subMenus: [
            {
              menuValue: '',
              route: '',
              base: 'main',
              base2: '',
              base3: '',
              base4: '',
              base5: '',
              base6: '',
            },
          ],
        },
      ],
    },
  ];
  public getSideBarData: BehaviorSubject<Array<SideBar>> = new BehaviorSubject<
    Array<SideBar>
  >(this.sideBar);

  public resetData(): void {
    // reset sidebar data
    this.sideBar.splice(5, 1);
    this.sideBar.splice(4, 1);
    this.sideBar.splice(3, 1);
  }
}
