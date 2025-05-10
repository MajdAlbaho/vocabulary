import { Injectable } from "@angular/core";
import { ConfigDB } from "../../data/config/config";

@Injectable({
  providedIn: "root",
})
export class LayoutService {
  // theme layout settings
  public config = {
    settings: {
      sidebar: "compact-wrapper",
      layout_type: "ltr",
      layout_version: "light-only",
      sidebar_type: "default-sidebar",
    },
    color: {
      primary_color: "#000000",
      secondary_color: "#000000",
    },
  };

  constructor() {
    // layout condition
    if (this.config.settings.layout_type == "rtl") {
      document
        .getElementsByTagName("html")[0]
        .setAttribute("dir", this.config.settings.layout_type);
      document.documentElement.style.setProperty(
        "--theme-deafult",
        this.config.color.primary_color
      );
      document.documentElement.style.setProperty(
        "--theme-secondary",
        this.config.color.secondary_color
      );
    } else {
      if (this.config.settings.layout_type == "box-layout") {
        document.body.classList.add("box-layout");
      }
    }
  }
}
