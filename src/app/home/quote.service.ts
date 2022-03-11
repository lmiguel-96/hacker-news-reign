import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { HackerNewsPost, HackerNewsQueryResult } from '@app/@core/models/post.model';

const routes = {
  posts: (c: PostQueryContext) => `/v1/search_by_date?query=${c.query}&page=${c.page}&hitsPerPage=8`,
};

export interface PostQueryContext {
  query: string | undefined | null;
  page: string | undefined | null;
}

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private _favedPosts$ = new BehaviorSubject<HackerNewsPost[]>(
    JSON.parse(localStorage.getItem('favedPosts') ?? '[]') as HackerNewsPost[]
  );

  private _lastSelectedQuery$ = new BehaviorSubject<string>(localStorage.getItem('selectedQuery') ?? '');

  constructor(private httpClient: HttpClient) {}

  /**
   * Returns posts from hacker news API as observable.
   * @param context query and page params required for request call.
   */
  getPosts(context: PostQueryContext): Observable<HackerNewsQueryResult> {
    return this.httpClient.get('/api' + routes.posts(context)).pipe(
      map((body: any) => body as HackerNewsQueryResult),
      catchError(() => of({ hits: [] }) as unknown as Observable<HackerNewsQueryResult>)
    );
  }

  /**
   * Sets the user liked posts.
   * The posts may be persisted across sessions through localstorage.
   * @param incomingPost The user faved post.
   */
  setFavPosts(incomingPost?: HackerNewsPost) {
    if (incomingPost) {
      let favedPosts = this._favedPosts$.getValue();

      const alreadySavedIndex = favedPosts.findIndex((post: HackerNewsPost) => {
        return post.objectID === incomingPost.objectID;
      });

      // If alreadySavedIndex is greater than -1 incomingPost is already saved and
      // should be removed, otherwise save it to localstorage
      if (alreadySavedIndex > -1) {
        favedPosts = favedPosts.filter((post) => post.objectID != incomingPost.objectID);
      } else {
        favedPosts = [...favedPosts, incomingPost];
      }

      localStorage.setItem('favedPosts', JSON.stringify(favedPosts));
      this._favedPosts$.next(favedPosts);
    }
  }

  /**
   * Returns users's faved posts as observable.
   */
  getCurrentSavesPosts(): Observable<HackerNewsPost[]> {
    return this._favedPosts$.asObservable();
  }

  /**
   * Sets the user last selected query.
   * The query may be persisted across sessions through localstorage.
   * @param query The user faved post.
   */
  setSelectedQuery(query?: string) {
    if (query) {
      localStorage.setItem('selectedQuery', query);
      this._lastSelectedQuery$.next(query);
    }
  }

  /**
   * Returns users's last selected query as string.
   */
  getLastSelectedQuery(): string {
    return this._lastSelectedQuery$.getValue();
  }
}
