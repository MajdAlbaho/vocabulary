import {
  ChangeDetectorRef,
  Component,
  HostListener
} from "@angular/core";
import * as feather from "feather-icons";

import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterOutlet } from "@angular/router";
import { slider } from "../../../data/animation/animation";
import { LayoutService } from "../../../services/layout/layout.service";
import { NavService } from "../../../services/nav/nav.service";
import { FooterComponent } from "../../footer/footer.component";
import { HeaderComponent } from "../../header/header.component";
import { SidebarComponent } from "../../sidebar/sidebar.component";

@Component({
  selector: "app-content",
  templateUrl: "./content.component.html",
  styleUrls: ["./content.component.scss"],
  animations: [slider],
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    SidebarComponent,
    RouterOutlet,
    FooterComponent,
  ],
})

export class ContentComponent {

  public show: boolean = true;
  public width = window.innerWidth;
  public screenwidth: any = window.innerWidth;

  constructor(
    public navServices: NavService,
    public layout: LayoutService,
    private changeRef: ChangeDetectorRef,
    public route: ActivatedRoute
  ) { }

  @HostListener("window:resize", ["$event"])
  onResize(event: any) {
    this.screenwidth = event.target.innerWidth;
    if (this.screenwidth < 991) {
      return (this.layout.config.settings.sidebar = "compact-wrapper");
    } else {
      return (this.layout.config.settings.sidebar =
        this.layout.config.settings.sidebar || "horizontal-wrapper");
    }
  }

  ngAfterViewInit() {
    this.changeRef.detectChanges();
    setTimeout(() => {
      feather.replace();
    });
  }

  public getRouterOutletState(outlet: any) {
    return outlet.isActivated ? outlet.activatedRoute : "";
  }
  
  ngOnInit(): void { }

  @HostListener("window:scroll", [])
  scrollHandler() {
    let number =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    if (window.location.pathname === "/page-layout/hide-nav-scroll") {
      const scrollMaxY = window.scrollY || (document.documentElement.scrollHeight - document.documentElement.clientHeight);
      if (number >= scrollMaxY) {
        this.show = false; // Hide the header
      } else if (number > 600 || number === 0) {
        this.show = true; // Show the header
      } else {
        this.show = false; // Hide the header
      }
    }
  }


  prepareRoute(outlet: RouterOutlet) {
    return (
      outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData["animation"]
    );
  }
} 