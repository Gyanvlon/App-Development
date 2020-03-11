import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'pointsBar'
})
export class PointsBarPipe implements PipeTransform {
    public percent: any;
    transform(userPoints: any): any {
        this.percent = 0;
        this.percent = ((userPoints.netPoints / 1000) * 100).toFixed(2);
        return this.percent;
    }

}
