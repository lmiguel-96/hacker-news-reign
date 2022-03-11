import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

import { HomeComponent } from './home.component';
import { Shell } from '@app/shell/shell.service';
import { NewsComponent } from './news/news.component';
import { FavesComponent } from './faves/faves.component';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', redirectTo: '/news/all', pathMatch: 'full' },
    {
      path: 'news',
      component: HomeComponent,
      children: [
        { path: '', redirectTo: 'all', pathMatch: 'full' },
        { path: 'all', component: NewsComponent, data: { title: marker('News') } },
        { path: 'faves', component: FavesComponent, data: { title: marker('Faves') } },
      ],
    },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class HomeRoutingModule {}
