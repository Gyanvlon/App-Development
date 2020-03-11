import {getDimensionValues} from './get-dimension-values.helpers';

export function mapSettingsToVisualizationFilters(visualizationSettings: any) {
  const visualizationFilters: any = [
    ...getDimensionValues(visualizationSettings.rows, visualizationSettings.dataElementDimensions, 'row'),
    ...getDimensionValues(visualizationSettings.columns, visualizationSettings.dataElementDimensions, 'column'),
    ...getDimensionValues(visualizationSettings.filters, visualizationSettings.dataElementDimensions, 'filter')
  ];
  return visualizationFilters;
}
