import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'article'
})
export class ArticlePipe implements PipeTransform {

  transform(value: string): string {
    if (value.toLowerCase().startsWith('the')) {
      return value;
  } else {
      return "the " + value; 
  }
  }
}
