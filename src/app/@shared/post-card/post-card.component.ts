import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HackerNewsPost } from '@app/@core/models/post.model';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'reign-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss'],
})
export class PostCardComponent {
  @Input() set author(author: HackerNewsPost['author']) {
    this.author$.next(author);
  }
  author$ = new BehaviorSubject<HackerNewsPost['author']>('');

  @Input() set createdAt(createdAt: HackerNewsPost['created_at']) {
    this.createdAt$.next(new Date(createdAt).getTime());
  }
  createdAt$ = new BehaviorSubject<HackerNewsPost['created_at_i']>(0);

  @Input() set title(title: HackerNewsPost['story_title']) {
    this.title$.next(title);
  }
  title$ = new BehaviorSubject<HackerNewsPost['story_title']>('');

  @Input() set url(url: HackerNewsPost['story_url']) {
    this.url$.next(url);
  }
  url$ = new BehaviorSubject<HackerNewsPost['story_url']>('');

  @Input() set isSaved(isSaved: boolean) {
    this.isSaved$.next(isSaved);
  }
  isSaved$ = new BehaviorSubject<boolean>(false);

  @Output() postFaved = new EventEmitter<null>();

  @Output() postClicked = new EventEmitter<null>();

  constructor() {}

  handleNavigateToAnotherPage() {
    this.postClicked.emit();
  }

  handleFavePostSaved() {
    this.postFaved.emit();
  }
}
