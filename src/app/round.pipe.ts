import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'round',
  standalone: true,
})
export class RoundPipe implements PipeTransform {
  /**
   * Round a number
   * @param value value to round
   */
  transform(value: number): number {
    return Math.round(value as number)
  }
}
