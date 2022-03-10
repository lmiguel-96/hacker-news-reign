import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { LoaderComponent } from './loader/loader.component';
import { TimeagoModule } from 'ngx-timeago';

@NgModule({
  imports: [TranslateModule, CommonModule],
  declarations: [LoaderComponent],
  exports: [LoaderComponent, TimeagoModule],
})
export class SharedModule {}
