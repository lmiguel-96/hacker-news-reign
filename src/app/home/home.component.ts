import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, map, tap } from 'rxjs';
import { PostService } from './quote.service';

@Component({
  selector: 'reign-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  view$ = this.activatedRoute.firstChild?.url.pipe(map(([{ path }]) => path));

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private postService: PostService) {}

  handleViewChange(view: string) {
    this.router.navigate([`/news/${view}`]);
  }
}
