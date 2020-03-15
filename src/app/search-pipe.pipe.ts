import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchPipe'
})
export class SearchPipePipe implements PipeTransform {

  transform(items: any[], filterdata: string) {
    if (items && items.length && filterdata) {
      // console.log(filterdata);
      return items.filter(item => {
        // console.log(item);
        if (item.raisedBy.stakeholderName.toLowerCase().indexOf(filterdata.toLowerCase()) !== -1) {
          // console.log(item.raisedBy.stakeholderName);
          return true;
        }
        return false;
      });
    } else {
      return items;
    }
  }


}
