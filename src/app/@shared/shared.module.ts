import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { LoaderComponent } from './loader/loader.component';
import { TimeagoModule } from 'ngx-timeago';
import { SavedPipe } from './pipes/saved.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [TranslateModule, CommonModule],
  declarations: [LoaderComponent, SavedPipe],
  exports: [LoaderComponent, TimeagoModule, SavedPipe, FormsModule, ReactiveFormsModule],
})
export class SharedModule {}
