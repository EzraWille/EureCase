import { BehaviorSubject } from 'rxjs';

export class routes {
  private static Url = '/';

  public static get baseUrl(): string {
    return this.Url;
  }

  public static get login() {
    return this.baseUrl + '/auth/login';
  }
  public static get register() {
    return this.baseUrl + '/auth/register';
  }
  public static get dashboard() {
    return this.baseUrl + '/dashboard';
  }
  public static get userProfile() {
    return this.baseUrl + '/user-profile';
  }
  public static get cases() {
    return this.baseUrl + '/cases-main';
  }
  public static get offers() {
    return this.baseUrl + '/offers-main';
  }
  public static get contracts() {
    return this.baseUrl + '/contracts-main';
  }
  public static get CaseManagement() {
    return this.baseUrl + '/cases-management';
  }
  public static get prizes() {
    return this.baseUrl + '/prizes';
  }
  public static get finance() {
    return this.baseUrl + '/finance';
  }
}
