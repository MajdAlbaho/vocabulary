import { Routes } from '@angular/router';
import { ContentComponent } from './shared/components/layout/content/content.component';
import { FullComponent } from './shared/components/layout/full/full.component';
import { full } from './shared/routes/full.routes';
import { content } from './shared/routes/routes';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  { path: "login", component: LoginComponent },
  {
    path: "",
    component: ContentComponent,
    children: content,
  },
  {
    path: "",
    component: FullComponent,
    children: full,
  },
  { path: '**', redirectTo: 'error-404' },
];

