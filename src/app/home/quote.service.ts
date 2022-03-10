import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { HackerNewsQueryResult } from '@app/@core/models/post.model';

const routes = {
  posts: (c: PostQueryContext) => `/v1/search_by_date?query=${c.query}&page=${c.page}&hitsPerPage=8`,
};

export interface PostQueryContext {
  query: string;
  page: string;
}

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private httpClient: HttpClient) {}

  getPosts(context: PostQueryContext): Observable<HackerNewsQueryResult> {
    return this.httpClient.get('/api' + routes.posts(context)).pipe(
      map((body: any) => body as HackerNewsQueryResult),
      tap((v) => console.log(v)),
      catchError(() => of({ hits: [] }) as unknown as Observable<HackerNewsQueryResult>)
    );
  }
}
