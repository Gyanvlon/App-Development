import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'pickVisualization'
})
export class PickVisualizationPipe implements PipeTransform {

  transform(visualizations: any[], indexes: Array<number>): any {
    if (!visualizations) {
      return null;
    }

    if (visualizations.length < indexes.length) {
      return visualizations;
    }

    return _.filter(visualizations,
      (visualization: any, visualizationIndex: number) => indexes.indexOf(visualizationIndex) !== -1);
  }

}
