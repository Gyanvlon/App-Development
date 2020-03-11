import * as L from 'leaflet';
import * as _ from 'lodash';
import {
  getPeriodFromFilters,
  getPeriodNameFromPeriod,
  getDataItemsFromColumns
} from '../utils/analytics';
import {
  getLegendItems,
  getLegendItemForValue,
  getColorsByRgbInterpolation
} from '../utils/classify';
import { toGeoJson } from './GeoJson';
import { geoJsonExtended } from './geoJsonExtended';

export const thematic = options => {
  const {
    geofeature,
    layerOptions,
    displaySettings,
    opacity,
    dataSelections,
    legendProperties,
    legendSet,
    analyticsData
  } = options;
  const { rows, columns, filters } = dataSelections;
  const { radiusLow, radiusHigh } = layerOptions;
  const {
    labelFontStyle,
    labelFontSize,
    labelFontColor,
    labelFontWeight,
    labels,
    values
  } = displaySettings;
  const features = toGeoJson(geofeature);
  const otherOptions = thematicLayerOptions(
    options.id,
    opacity,
    displaySettings
  );
  const valueById = getValueById(analyticsData);
  const layerDx = getDx(analyticsData);
  const valueFeatures = features.filter(({ id }) => id);
  const orderedValues = getOrderedValues(analyticsData);
  const minValue = orderedValues[0];
  const maxValue = orderedValues[orderedValues.length - 1];
  const dataItem = getDataItemsFromColumns(columns)[0];
  const name = options.name || dataItem.name;
  const legend = legendSet
    ? createLegendFromLegendSet(legendSet, options.displayName, options.type)
    : createLegendFromConfig(
        orderedValues,
        legendProperties,
        options.displayName,
        options.type
      );
  legend.items.forEach(item => (item.count = 0));
  const getLegendItem = _.curry(getLegendItemForValue)(legend.items);
  const period = getPeriodFromFilters([...rows, ...filters, ...columns]);
  legend['period'] = getPeriodNameFromPeriod(period);

  valueFeatures.forEach(({ id, properties }: any) => {
    const value = valueById[id] || 0;
    const item = getLegendItem(value);
    if (item) {
      item.count++;
      properties.percentage = (
        (item.count / orderedValues.length) *
        100
      ).toFixed(1);
    }
    properties.value = value;
    properties.label = name;
    properties.dx = layerDx;
    properties.color = (item && item.color) || '#bd0026';
    properties.labelStyle = {
      fontSize: labelFontSize,
      fontStyle: labelFontStyle,
      fontColor: labelFontColor,
      fontWeight: labelFontWeight
    };
    properties.radius =
      ((value - minValue) / (maxValue - minValue)) * (radiusHigh - radiusLow) +
      radiusLow;
  });
  const _options = {
    ...otherOptions,
    label: labels ? (values ? '{name}({value})' : '{name}') : undefined,
    hoverLabel: undefined,
    labelPane: `${options.id}-labels`,
    data: valueFeatures
  };

  const geoJsonLayer = geoJsonExtended(_options);

  const thematicEvents = thematicLayerEvents(columns, legend);
  geoJsonLayer.on({
    click: thematicEvents.onClick,
    mouseover: thematicEvents.mouseover,
    mouseout: thematicEvents.mouseout
  });
  const bounds = geoJsonLayer.getBounds();
  const _legendSet = {
    layer: options.id,
    opacity,
    hidden: false,
    legend
  };
  const optionsToReturn = {
    ...options,
    features,
    legendSet: _legendSet,
    geoJsonLayer
  };
  if (bounds.isValid()) {
    return {
      ...optionsToReturn,
      bounds
    };
  }
  return optionsToReturn;
};

// Returns an object mapping org. units and values
const getValueById = data => {
  const { headers, rows } = data;
  const ouIndex = _.findIndex(headers, ['name', 'ou']);
  const valueIndex = _.findIndex(headers, ['name', 'value']);

  return rows.reduce((obj, row) => {
    obj[row[ouIndex]] = parseFloat(row[valueIndex]);
    return obj;
  }, {});
};

export const getDx = data => {
  const { headers, metaData, rows } = data;
  const { names, pe, dx, dimensions, items } = metaData;
  const dxID = (dx && dx[0]) || (dimensions && dimensions.dx[0]);
  return (names && names[dxID]) || items[dxID].name;
};

// Returns an array of ordered values
const getOrderedValues = data => {
  const { headers, rows } = data;
  const valueIndex = _.findIndex(headers, ['name', 'value']);

  return rows.map(row => parseFloat(row[valueIndex])).sort((a, b) => a - b);
};

const createLegendFromLegendSet = (legendSet, displayName, type) => {
  const { name, legends } = legendSet;
  const pickSome = ['name', 'startValue', 'endValue', 'color'];
  const sortedLegends = _.sortBy(legends, 'startValue');
  const items = sortedLegends.map(legend => _.pick(legend, pickSome));
  return {
    title: name || displayName,
    type,
    items
  };
};

const createLegendFromConfig = (data, config, displayName, type) => {
  const { method, classes, colorScale, colorLow, colorHigh } = config;

  const items = data.length ? getLegendItems(data, method, classes) : [];

  let colors;

  if (Array.isArray(colorScale)) {
    colors = colorScale;
  } else if (_.isString(colorScale)) {
    colors = colorScale.split(',');
  }

  if (!colorScale || colors.length !== classes) {
    colors = getColorsByRgbInterpolation(colorLow, colorHigh, classes);
  }

  return {
    title: displayName,
    type,
    items: items.map((item, index) => ({
      ...item,
      color: colors[index]
    }))
  };
};

export const thematicLayerOptions = (id, opacity, displaySettings) => {
  const {
    labelFontStyle,
    labelFontSize,
    labelFontColor,
    labelFontWeight,
    labels
  } = displaySettings;
  const style = feature => {
    const pop = feature.properties;
    return {
      color: '#333',
      fillColor: pop.color,
      fillOpacity: opacity,
      opacity,
      weight: 1,
      fill: true,
      stroke: true
    };
  };

  const onEachFeature = (feature, layer) => {};

  const pane = id;

  const pointToLayer = (feature, latlng) => {
    const geojsonMarkerOptions = {
      pane,
      radius: feature.properties.radius || 6,
      fillColor: feature.properties.color || '#fff',
      color: feature.properties.color || '#333',
      opacity: opacity || 0.8,
      weight: 1,
      fillOpacity: opacity || 0.8
    };
    return new L.CircleMarker(latlng, geojsonMarkerOptions);
  };

  return {
    pane,
    style,
    onEachFeature,
    pointToLayer
  };
};

export const thematicLayerEvents = (columns, legend) => {
  const onClick = evt => {
    const { name, value, percentage, dx } = evt.layer.feature.properties;
    const indicator = columns[0].items[0].name;
    const period = legend ? legend.period : undefined;
    const content = `<div class="leaflet-popup-orgunit">
                    ${name}<br>
                    ${dx}<br>
                    ${period}: ${value}</div>`;
    // Close any popup if there is one
    evt.layer.closePopup();
    // Bind new popup to the layer
    evt.layer.bindPopup(content);
    // Open the binded popup
    evt.layer.openPopup();
  };

  const onRightClick = evt => {
    L.DomEvent.stopPropagation(evt); // Don't propagate to map right-click
  };

  const mouseover = evt => {
    const { name, value, percentage, style } = evt.layer.feature.properties;
    const weight = 3;
    evt.layer.setStyle({ ...style, weight });
    evt.layer.closeTooltip();
    evt.layer
      .bindTooltip(`${name}(${value})`, {
        direction: 'auto',
        permanent: false,
        sticky: true,
        interactive: true,
        opacity: 1
      })
      .openTooltip();
  };

  const mouseout = evt => {
    const style = evt.layer.feature.properties.style;
    const weight = 1;
    evt.layer.setStyle({ ...style, weight });
  };

  return {
    onClick,
    onRightClick,
    mouseover,
    mouseout
  };
};
