import { ChangeDetectionStrategy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HackerNewsPost, HackerNewsQueryResult } from '@app/@core/models/post.model';
import { getValueInRange } from '@ng-bootstrap/ng-bootstrap/util/util';
import {
  map,
  defaultIfEmpty,
  distinctUntilChanged,
  shareReplay,
  combineLatest,
  switchMap,
  BehaviorSubject,
  tap,
} from 'rxjs';
import { PostService } from '../posts.service';

@Component({
  selector: 'reign-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsComponent {
  favedPostsListIds$ = this.postService.getCurrentSavesPosts().pipe(map((posts) => posts.map((post) => post.objectID)));

  lastSelectedQuery$ = this.postService.getLastSelectedQuery();

  isLoading$ = new BehaviorSubject<boolean>(true);

  // number of items to be returned from each api call
  hitsPerPage$ = new BehaviorSubject<number>(8);

  // Holds page number for the news view, manually handled for infinite scroll
  nbPages$ = new BehaviorSubject<number>(1);

  // Holds page number for the news view directly from URL as query param
  page$ = this.activatedRoute.queryParamMap.pipe(
    map((paramsMap) => {
      return paramsMap.get('page') ?? '1';
    }),
    distinctUntilChanged(),
    shareReplay(1)
  );

  // Holds search term for query directly from URL as query param
  query$ = this.activatedRoute.queryParamMap.pipe(
    map((paramsMap) => {
      return paramsMap.get('query') ?? this.postService.getLastSelectedQuery();
    }),
    distinctUntilChanged(),
    shareReplay(1)
  );

  // Based on the combination of both page and query a request call is triggered every time so the UI
  // is reactive enough to reflect the changes
  posts$ = combineLatest([this.page$, this.query$, this.hitsPerPage$]).pipe(
    switchMap(([page, query, hitsPerPage]) => {
      const selectedPage = page;
      const searchedQuery = query;
      return this.postService.getPosts({ page: selectedPage, query: searchedQuery, hitsPerPage });
    }),
    map((results: HackerNewsQueryResult) => {
      /**
       * if one of the following properties are missing from the post, should be discard:
       * story_title, story_url, created_at
       */
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

  // Based on the combination of nbPage, query a request call is triggered every time so the UI
  // is reactive enough to reflect the changes, this one triggers
  postsInfinite$ = combineLatest([this.nbPages$, this.query$]).pipe(
    switchMap(([page, query]) => {
      const selectedPage = page.toString();
      const searchedQuery = query;
      return this.postService.getPosts({ page: selectedPage, query: searchedQuery, hitsPerPage: 30 });
    }),
    map((results: HackerNewsQueryResult) => {
      /**
       * if one of the following properties are missing from the post, should be discard:
       * story_title, story_url, created_at
       */
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
    tap((results) => {
      this.isLoading$.next(false);
      this.allPosts$.next([...this.allPosts$.getValue(), ...results.hits]);
    }),
    defaultIfEmpty({ hits: [] } as unknown as HackerNewsQueryResult),
    shareReplay(1)
  );

  // all posts retrieved from each api call by page, used for rendering posts
  allPosts$ = new BehaviorSubject<HackerNewsPost[]>([]);

  viewMode$ = this.postService.getLastSelectedViewMode();

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private postService: PostService) {}

  identifyPosts(index: number, post: HackerNewsPost) {
    return post.objectID;
  }

  handleSearchQuery(searchTerm: 'angular' | 'reactjs' | 'vuejs') {
    this.nbPages$.next(1);
    this.allPosts$.next([]);
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

  // Triggers api call every time scrolls get past the middle of the page
  handleScrollDown() {
    this.isLoading$.next(true);
    if (this.nbPages$.getValue() >= 124) {
      return;
    } else {
      this.nbPages$.next(this.nbPages$.getValue() + 1);
    }
  }

  scrollCheck(): boolean {
    return this.isLoading$.getValue();
  }
}
