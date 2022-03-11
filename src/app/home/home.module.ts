import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbButtonsModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from '@shared';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { PostCardComponent } from '../@shared/post-card/post-card.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NewsComponent } from './news/news.component';
import { FavesComponent } from './faves/faves.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    SharedModule,
    HomeRoutingModule,
    NgbButtonsModule,
    NgbDropdownModule,
    NgxPaginationModule,
    InfiniteScrollModule,
  ],
  declarations: [HomeComponent, PostCardComponent, NewsComponent, FavesComponent],
})
export class HomeModule {}
