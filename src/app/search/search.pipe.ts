import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(items: any[], queryString: any, label: any): any[] {
    if (!items) {
     return [];
    }
    if (!queryString) {
    return  items;
  }
    if (queryString === '' || queryString == null) {
    return [];
  }
  return items.filter(function(x) {
    return x.name.toLowerCase().includes(queryString.toLowerCase()) || x.price.toString().includes(queryString);
   });
}
}

