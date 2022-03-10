import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HackerNewsQueryResult } from '@app/@core/models/post.model';
import {
  BehaviorSubject,
  defaultIfEmpty,
  map,
  combineLatest,
  switchMap,
  distinctUntilChanged,
  shareReplay,
  tap,
} from 'rxjs';
import { PostService } from './quote.service';

@Component({
  selector: 'reign-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  page$ = this.activatedRoute.queryParamMap.pipe(
    map((paramsMap) => paramsMap.get('page')),
    defaultIfEmpty('0'),
    distinctUntilChanged(),
    shareReplay(1)
  );

  query$ = this.activatedRoute.queryParamMap.pipe(
    map((paramsMap) => paramsMap.get('query')),
    defaultIfEmpty('angular'),
    distinctUntilChanged(),
    shareReplay(1)
  );

  posts$ = combineLatest([this.page$, this.query$]).pipe(
    switchMap(([page, query]) => {
      const selectedPage = page ?? '0';
      const searchedQuery = query ?? 'angular';
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
    defaultIfEmpty({ hits: [] }),
    shareReplay(1)
  );

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private postService: PostService) {}

  handleSearchQuery(searchTerm: 'angular' | 'react' | 'vuejs') {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { query: searchTerm },
      queryParamsHandling: 'merge',
    });
  }

  handlePageChange(page: number) {
    this.router.navigate([], { relativeTo: this.activatedRoute, queryParams: { page }, queryParamsHandling: 'merge' });
  }
}
