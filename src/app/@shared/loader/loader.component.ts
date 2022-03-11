import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'reign-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent {
  @Input() isLoading: boolean | undefined | null = false;

  constructor() {}
}
