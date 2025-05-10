import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, fromEvent, Subject } from "rxjs";
import { debounceTime, takeUntil } from "rxjs/operators";

export interface Menu {
  headTitle1?: string;
  headTitle2?: string;
  path?: string;
  title?: any;
  icon?: string;
  type?: string;
  badgeType?: string;
  badgeValue?: string;
  active?: boolean;
  bookmark?: boolean;
  id?: number;
  children?: Menu[];
}
@Injectable({
  providedIn: "root",
})

export class NavService {
  private unsubscriber: Subject<any> = new Subject();
  public screenWidth: BehaviorSubject<number> = new BehaviorSubject(
    window.innerWidth
  );
  private url = new BehaviorSubject("default message");
  currentUrl = this.url.asObservable();
  // Search Box
  public search: boolean = false;

  // Collapse Sidebar
  // public collapseSidebar: boolean = window.innerWidth < 991 ? true : false;
  public collapseSidebar: boolean = false;

  public language: boolean = false;

  // For Horizontal Layout Mobile
  public horizontal: boolean = window.innerWidth < 991 ? false : true;


  // Full screen
  public fullScreen: boolean = false;

  constructor(private router: Router) {
    this.setScreenWidth(window.innerWidth);
    fromEvent(window, "resize")
      .pipe(debounceTime(1000), takeUntil(this.unsubscriber))
      .subscribe((evt: any) => {
        this.setScreenWidth(evt.target.innerWidth);
        if (evt.target.innerWidth < 991) {
          this.collapseSidebar = true;
        }
        if (evt.target.innerWidth < 1199) {
        }
      });
    if (window.innerWidth < 991) {
      // Detect Route change sidebar close
      this.router.events.subscribe((event: any) => {
        this.collapseSidebar = true;
      });
    }
  }
  changeUrl(val: string): void {
    this.url.next(val);
  }

  private setScreenWidth(width: number): void {
    this.screenWidth.next(width);
  }

  MENUITEMS: Menu[] = [
    {
      headTitle1: "Pages",
    },
    {
      id: 1,
      path: "/dashboard",
      icon: "home",
      title: "Dashboard",
      type: "link",
      bookmark: true,
    },
    {
      id: 1,
      title: "Settings",
      icon: "settings",
      type: "sub",
      badgeType: "light-primary",
      badgeValue: "2",
      active: true,
      children: [
        { path: "/settings/keywords", title: "Keywords", type: "link" },
        { path: "/settings/users", title: "Users", type: "link" },
        { path: "/settings/roles", title: "Roles", type: "link" },
        { path: "/settings/api-keys", title: "API Key", type: "link" },
      ],
    },
  ];

  items = new BehaviorSubject<Menu[]>(this.MENUITEMS);
}
