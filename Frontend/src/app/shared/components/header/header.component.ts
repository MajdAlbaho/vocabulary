import { CommonModule, DOCUMENT } from "@angular/common";
import { Component, HostListener, Inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { LayoutService } from "../../services/layout/layout.service";
import { NavService } from "../../services/nav/nav.service";
import { AccountComponent } from "./account/account.component";
import { LanguageComponent } from "./language/language.component";
import { MaximiseComponent } from "./maximise/maximise.component";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    MaximiseComponent,
    LanguageComponent,
    AccountComponent,
  ],
})
export class HeaderComponent implements OnInit {
  public dark: boolean =
    this.layout.config.settings.layout_version == "dark-only" ? true : false;

  collapseSidebar: boolean = true;
  constructor(
    private navServices: NavService,
    public layout: LayoutService,
    private router: Router,
    private route: ActivatedRoute,
    private activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe((params: any) => {
        this.document.body.classList.add(params.layout);
      }
      );
  }

  sidebarToggle() {
    this.navServices.collapseSidebar = !this.navServices.collapseSidebar;
  }

  layoutToggle() {
    this.dark = !this.dark;
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: { layout: this.dark ? 'dark-only' : 'light-only' },
        queryParamsHandling: 'merge'
      });
    this.document.body.classList.toggle('dark-only')
  }

  languageToggle() {
    this.navServices.language = !this.navServices.language;
  }

  searchToggle() {
    this.navServices.search = true;
  }

  @HostListener("window:resize", ["$event"])
  onResize(event: any) {
    const element = document.getElementById("sidebar-toggle");
    if (element && window.innerWidth > 1199) {
      element.style.display = "none";
    } else if (element) {
      element.style.display = "block";
    }
  }
}
