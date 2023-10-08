import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(value: string, ...args: any[]): string {
    // get target length
    let targetLength = args[0];
    if(value.length <= targetLength){
      return value;
    }
    return value.substring(0, targetLength) + "...";
  }

}
