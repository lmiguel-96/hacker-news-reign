import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { PostService } from './posts.service';
import { HackerNewsQueryResult } from '@app/@core/models/post.model';

describe('QuoteService', () => {
  let quoteService: PostService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PostService],
    });

    quoteService = TestBed.inject(PostService);
    httpMock = TestBed.inject(HttpTestingController as Type<HttpTestingController>);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getPosts', () => {
    it('should return a result from API', () => {
      // Arrange
      const mockQuote = { value: {} };

      // Act
      const randomQuoteSubscription = quoteService.getPosts({ query: 'toto', page: '1', hitsPerPage: 8 });

      // Assert
      randomQuoteSubscription.subscribe((result: HackerNewsQueryResult) => {
        expect(result).toEqual(mockQuote.value);
      });
      httpMock.expectOne({}).flush(mockQuote);
    });

    it('should return an empty array in case of error', () => {
      // Act
      const randomQuoteSubscription = quoteService.getPosts({ query: 'toto', page: '1', hitsPerPage: 8 });

      // Assert
      randomQuoteSubscription.subscribe((result: HackerNewsQueryResult) => {
        expect(typeof result).toEqual('object');
        expect(result).toContain([]);
      });
      httpMock.expectOne({}).flush(null, {
        status: 500,
        statusText: 'error',
      });
    });
  });
});
