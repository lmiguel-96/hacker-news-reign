import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HackerNewsPost } from '@app/@core/models/post.model';
import { defaultIfEmpty, distinctUntilChanged, map, shareReplay } from 'rxjs/operators';
import { PostService } from '../posts.service';

@Component({
  selector: 'reign-faves',
  templateUrl: './faves.component.html',
  styleUrls: ['./faves.component.scss'],
})
export class FavesComponent {
  // Holds page number for the news view directly from URL as query param
  page$ = this.activatedRoute.queryParamMap.pipe(
    map((paramsMap) => paramsMap.get('page')),
    defaultIfEmpty('0'),
    distinctUntilChanged(),
    shareReplay(1)
  );

  posts$ = this.postService.getCurrentSavesPosts();

  favedPostsListIds$ = this.postService.getCurrentSavesPosts().pipe(map((posts) => posts.map((post) => post.objectID)));

  constructor(private postService: PostService, private activatedRoute: ActivatedRoute, private router: Router) {}

  handlePageChange(page: number) {
    this.router.navigate([], { relativeTo: this.activatedRoute, queryParams: { page }, queryParamsHandling: 'merge' });
  }

  handleFavPostClicked(post: HackerNewsPost) {
    this.postService.setFavPosts(post);
  }

  handlePostClicked(post: HackerNewsPost) {
    if (window) {
      window.location.href = post.story_url;
    }
  }
}
