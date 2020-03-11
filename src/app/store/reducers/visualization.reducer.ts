import * as _ from 'lodash';
import { Visualization } from '../../core/models/visualization.model';
import { VisualizationAction, VisualizationActions } from '../actions/visualization.actions';
import { getVisualizationWidthFromShape } from '../../core/helpers/get-visualization-width-from-shape.helper';
import { deduceVisualizationSubtitle } from '../../core/helpers/deduce-visualization-subtitle.helper';

export interface VisualizationState {
  loading: boolean;
  loaded: boolean;
  currentVisualization: string;
  visualizationObjects: Visualization[];
}

export const INITIAL_VISUALIZATION_STATE: VisualizationState = {
  loading: true,
  loaded: false,
  currentVisualization: undefined,
  visualizationObjects: []
};


export function visualizationReducer(state: VisualizationState = INITIAL_VISUALIZATION_STATE,
  action: VisualizationAction) {
  switch (action.type) {
    case VisualizationActions.LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true
      };
    case VisualizationActions.SET_INITIAL:
      let newVisualizationObjects = state.visualizationObjects;
      _.each(action.payload, (visualizationObject: Visualization) => {
        const availableVisualization = _.find(newVisualizationObjects, ['id', visualizationObject.id]);

        if (availableVisualization) {
          const availableVisualizationIndex = newVisualizationObjects.indexOf(availableVisualization);
          newVisualizationObjects = [
            ...newVisualizationObjects.slice(0, availableVisualizationIndex),
            availableVisualization,
            ...newVisualizationObjects.slice(availableVisualizationIndex + 1),
          ];
        } else {
          newVisualizationObjects = [...newVisualizationObjects, visualizationObject];
        }
      });
      return {
        ...state,
        visualizationObjects: [...newVisualizationObjects]
      };
    case VisualizationActions.ADD_OR_UPDATE:
      const visualizationIndex = state.visualizationObjects.indexOf(
        _.find(state.visualizationObjects, [
          'id',
          action.payload.visualizationObject
            ? action.payload.visualizationObject.id
            : undefined
        ])
      );

      const newVisualizationObject = {
        ...action.payload.visualizationObject,
        layers: _.map(action.payload.visualizationObject.layers, (layer: any) => {
          return {
            ...layer, settings: {...layer.settings, subtitle: deduceVisualizationSubtitle(layer.settings.filters)}
          };
        })
      };

      return visualizationIndex !== -1
        ? {
          ...state,
          visualizationObjects:
            action.payload.placementPreference === 'first'
              ? [
                newVisualizationObject,
                ...state.visualizationObjects.slice(0, visualizationIndex),
                ...state.visualizationObjects.slice(visualizationIndex + 1)
              ]
              : [
                ...state.visualizationObjects.slice(0, visualizationIndex),
                newVisualizationObject,
                ...state.visualizationObjects.slice(visualizationIndex + 1)
              ]
        }
        : {
          ...state,
          visualizationObjects:
            action.payload.placementPreference === 'first'
              ? [
                newVisualizationObject,
                ...state.visualizationObjects
              ]
              : [
                ...state.visualizationObjects,
                newVisualizationObject
              ]
        };

    case VisualizationActions.SET_CURRENT:
      return {...state, currentVisualization: action.payload};
    case VisualizationActions.UNSET_CURRENT:
      return {...state, currentVisualization: undefined};
    case VisualizationActions.RESIZE: {
      const visualizationObject: Visualization = _.find(
        state.visualizationObjects,
        ['id', action.payload.visualizationId]
      );
      const visualizationObjectIndex = state.visualizationObjects.indexOf(
        visualizationObject
      );
      return visualizationObjectIndex !== -1
        ? {
          ...state,
          visualizationObjects: [
            ...state.visualizationObjects.slice(0, visualizationObjectIndex),
            {
              ...visualizationObject,
              shape: action.payload.shape,
              details: {
                ...visualizationObject.details,
                width: getVisualizationWidthFromShape(
                  action.payload.shape
                ),
                shape: action.payload.shape
              }
            },
            ...state.visualizationObjects.slice(visualizationObjectIndex + 1)
          ]
        }
        : state;
    }

    case VisualizationActions.TOGGLE_INTERPRETATION: {
      const visualizationObject: Visualization = _.find(
        state.visualizationObjects,
        ['id', action.payload]
      );
      const visualizationObjectIndex = state.visualizationObjects.indexOf(
        visualizationObject
      );
      /**
       * Change size of the dashboard item
       */

      const newShape = visualizationObject
        ? visualizationObject.details.showInterpretationBlock
          ? visualizationObject.details.shape
          : visualizationObject.shape === 'NORMAL'
            ? 'DOUBLE_WIDTH'
            : 'FULL_WIDTH'
        : '';

      return visualizationObjectIndex !== -1
        ? {
          ...state,
          visualizationObjects: [
            ...state.visualizationObjects.slice(0, visualizationObjectIndex),
            {
              ...visualizationObject,
              shape: newShape,
              details: {
                ...visualizationObject.details,
                width: getVisualizationWidthFromShape(
                  newShape
                ),
                showInterpretationBlock: !visualizationObject.details.showInterpretationBlock,
                shape: visualizationObject.shape
              }
            },
            ...state.visualizationObjects.slice(visualizationObjectIndex + 1)
          ]
        }
        : state;
    }

    case VisualizationActions.TOGGLE_FULLSCREEN: {
      const visualizationObject: Visualization = _.find(
        state.visualizationObjects,
        ['id', action.payload]
      );
      const visualizationObjectIndex = state.visualizationObjects.indexOf(
        visualizationObject
      );


      return visualizationObjectIndex !== -1
        ? {
          ...state,
          visualizationObjects: [
            ...state.visualizationObjects.slice(0, visualizationObjectIndex),
            {
              ...visualizationObject,
              details: {
                ...visualizationObject.details,
                showFullScreen: !visualizationObject.details.showFullScreen,
                cardHeight: visualizationObject.details.showFullScreen ? '450px' : '100vh',
                itemHeight: visualizationObject.details.showFullScreen ? '430px' : '96vh'
              }
            },
            ...state.visualizationObjects.slice(visualizationObjectIndex + 1)
          ]
        }
        : state;
    }

    case VisualizationActions.DELETE: {
      const visualizationObject: Visualization = _.find(
        state.visualizationObjects,
        ['id', action.payload.visualizationId]
      );
      const visualizationObjectIndex = state.visualizationObjects.indexOf(
        visualizationObject
      );
      return visualizationObjectIndex !== -1
        ? {
          ...state,
          visualizationObjects: [
            ...state.visualizationObjects.slice(0, visualizationObjectIndex),
            {
              ...visualizationObject,
              details: {...visualizationObject.details, deleting: true}
            },
            ...state.visualizationObjects.slice(visualizationObjectIndex + 1)
          ]
        }
        : state;
    }

    case VisualizationActions.DELETE_SUCCESS: {
      const visualizationObject: Visualization = _.find(
        state.visualizationObjects,
        ['id', action.payload.visualizationId]
      );
      const visualizationObjectIndex = state.visualizationObjects.indexOf(
        visualizationObject
      );

      return visualizationObjectIndex !== -1
        ? {
          ...state,
          visualizationObjects: [
            ...state.visualizationObjects.slice(0, visualizationObjectIndex),
            ...state.visualizationObjects.slice(visualizationObjectIndex + 1)
          ]
        }
        : state;
    }

    case VisualizationActions.DELETE_FAIL: {
      const visualizationObject: Visualization = _.find(
        state.visualizationObjects,
        ['id', action.payload]
      );
      const visualizationObjectIndex = state.visualizationObjects.indexOf(
        visualizationObject
      );
      return visualizationObjectIndex !== -1
        ? {
          ...state,
          visualizationObjects: [
            ...state.visualizationObjects.slice(0, visualizationObjectIndex),
            {
              ...visualizationObject,
              details: {
                ...visualizationObject.details,
                deleting: false,
                deleteFail: true
              }
            },
            ...state.visualizationObjects.slice(visualizationObjectIndex + 1)
          ]
        }
        : state;
    }

    case VisualizationActions.TOGGLE_DELETE_DIALOG: {
      const visualizationObject: Visualization = _.find(
        state.visualizationObjects,
        ['id', action.payload]
      );
      const visualizationObjectIndex = state.visualizationObjects.indexOf(
        visualizationObject
      );
      return visualizationObjectIndex !== -1
        ? {
          ...state,
          visualizationObjects: [
            ...state.visualizationObjects.slice(0, visualizationObjectIndex),
            {
              ...visualizationObject,
              details: {
                ...visualizationObject.details,
                showDeleteDialog: !visualizationObject.details.showDeleteDialog
              }
            },
            ...state.visualizationObjects.slice(visualizationObjectIndex + 1)
          ]
        }
        : state;
    }

    case VisualizationActions.VISUALIZATION_CHANGE: {
      const visualizationObject = _.find(state.visualizationObjects, ['id', action.payload.id]);

      const visualizationObjectIndex = state.visualizationObjects.indexOf(visualizationObject);

      return visualizationObjectIndex !== -1
        ? {
          ...state,
          visualizationObjects: [
            ...state.visualizationObjects.slice(0, visualizationObjectIndex),
            {
              ...visualizationObject,
              details: {
                ...visualizationObject.details,
                currentVisualization: action.payload.type
              }
            },
            ...state.visualizationObjects.slice(visualizationObjectIndex + 1)
          ]
        } : state;
    }

    case VisualizationActions.VISUALIZATION_ERROR_OCCURED: {
      const visualizationObject = _.find(state.visualizationObjects, ['id', action.id]);

      const visualizationObjectIndex = state.visualizationObjects.indexOf(visualizationObject);

      return visualizationObjectIndex !== -1
        ? {
          ...state,
          visualizationObjects: [
            ...state.visualizationObjects.slice(0, visualizationObjectIndex),
            {
              ...visualizationObject,
              details: {
                ...visualizationObject.details,
                loaded: true,
                loading: false,
                hasError: true,
                errorMessage: action.errorMessage
              }
            },
            ...state.visualizationObjects.slice(visualizationObjectIndex + 1)
          ]
        } : state;
    }

    case VisualizationActions.GLOBAL_FILTER_CHANGE:
      return {
        ...state,
        visualizationObjects: _.map(state.visualizationObjects, visualizationObject => {
          return {
            ...visualizationObject,
            details: {
              ...visualizationObject.details,
              loading: true,
              loaded: false,
              errorMessage: null
            }
          };
        })
      };


    case VisualizationActions.LOCAL_FILTER_CHANGE: {
      const visualizationObject = _.find(state.visualizationObjects, ['id', action.payload.visualizationObject.id]);

      const visualizationObjectIndex = state.visualizationObjects.indexOf(visualizationObject);

      return visualizationObjectIndex !== -1
        ? {
          ...state,
          visualizationObjects: [
            ...state.visualizationObjects.slice(0, visualizationObjectIndex),
            {
              ...visualizationObject,
              details: {
                ...visualizationObject.details,
                loading: true,
                loaded: false,
                errorMessage: null
              }
            },
            ...state.visualizationObjects.slice(visualizationObjectIndex + 1)
          ]
        } : state;
    }

    case VisualizationActions.GLOBAL_FILTER_CHANGE: {
      const visualizationToUpdate: Visualization[] = _.map(_.filter(state.visualizationObjects,
        visualizationObject => visualizationObject.dashboardId === action.payload.currentDashboardId &&
          !visualizationObject.details.nonVisualizable), (visualizationObject: Visualization) => {
        return {
          ...visualizationObject,
          details: {
            ...visualizationObject.details,
            loading: true,
            loaded: false,
            errorMessage: null
          }
        };
      });

      return {
        ...state,
        visualizationObjects: [
          ..._.map(state.visualizationObjects, (visualizationObject: Visualization) => {
            const availableVisualization: Visualization = _.find(visualizationToUpdate, ['id', visualizationObject.id]);
            return availableVisualization || visualizationObject;
          })
        ]
      };
    }
  }

  return state;
}
