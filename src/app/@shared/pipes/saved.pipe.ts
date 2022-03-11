import { Pipe, PipeTransform } from '@angular/core';
import { HackerNewsPost } from '@app/@core/models/post.model';

@Pipe({
  name: 'saved',
})
export class SavedPipe implements PipeTransform {
  transform(value: HackerNewsPost, favedPostsIds: string[]): boolean {
    return favedPostsIds.includes(value.objectID);
  }
}
