import { Component, OnInit } from '@angular/core';
import { PostService } from '@app/home/posts.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'reign-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(private postServices: PostService) {}

  viewMode$ = this.postServices.getLastSelectedViewMode();

  handleViewModeChanged(viewMode: 'infinite' | 'normal') {
    this.postServices.setSelectedViewMode(viewMode);
  }
}
