import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HackerNewsPost, HackerNewsQueryResult } from '@app/@core/models/post.model';
import {
  map,
  defaultIfEmpty,
  distinctUntilChanged,
  shareReplay,
  combineLatest,
  switchMap,
  BehaviorSubject,
  tap,
  withLatestFrom,
} from 'rxjs';
import { PostService } from '../quote.service';

@Component({
  selector: 'reign-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
})
export class NewsComponent {
  page$ = this.activatedRoute.queryParamMap.pipe(
    map((paramsMap) => {
      return paramsMap.get('page') ?? '0';
    }),
    distinctUntilChanged(),
    shareReplay(1)
  );

  query$ = this.activatedRoute.queryParamMap.pipe(
    map((paramsMap) => {
      return paramsMap.get('query') ?? this.postService.getLastSelectedQuery();
    }),
    distinctUntilChanged(),
    shareReplay(1)
  );

  posts$ = combineLatest([this.page$, this.query$]).pipe(
    switchMap(([page, query]) => {
      const selectedPage = page;
      const searchedQuery = query;
      return this.postService.getPosts({ page: selectedPage, query: searchedQuery });
    }),
    map((results: HackerNewsQueryResult) => {
      const filteredHits = results.hits.filter((hit) => {
        if (!hit.story_title) {
          return false;
        }
        if (!hit.story_url) {
          return false;
        }
        if (!hit.created_at_i) {
          return false;
        }
        return true;
      });
      results.hits = filteredHits;
      return results;
    }),
    tap(() => this.isLoading$.next(false)),
    defaultIfEmpty({ hits: [] } as unknown as HackerNewsQueryResult),
    shareReplay(1)
  );

  favedPostsListIds$ = this.postService.getCurrentSavesPosts().pipe(map((posts) => posts.map((post) => post.objectID)));

  lastSelectedQuery$ = this.postService.getLastSelectedQuery();

  isLoading$ = new BehaviorSubject<boolean | undefined | null>(true);

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private postService: PostService) {}

  handleSearchQuery(searchTerm: 'angular' | 'react' | 'vuejs') {
    this.postService.setSelectedQuery(searchTerm);
    this.isLoading$.next(true);
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { query: searchTerm, page: null },
      queryParamsHandling: 'merge',
    });
  }

  handlePageChange(page: number) {
    this.isLoading$.next(true);
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
