import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as _ from 'lodash';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import {
  map,
  tap,
  switchMap,
  flatMap,
  catchError,
  mergeMap,
  withLatestFrom,
  filter
} from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { DashboardActions } from '../actions/dashboard.actions';
import { AppState } from '../reducers/index';
import { Visualization } from '../../core/models/visualization.model';
import { Dashboard } from '../../core/models/dashboard.model';
import { mapDashboardItemToVisualization } from '../../core/helpers/map-dashboad-item-to-visualization.helper';
import * as visualization from '../actions/visualization.actions';
import * as dashboard from '../actions/dashboard.actions';
import { getVisualizationFavoriteUrl } from '../../core/helpers/get-visualization-settings-url.helper';
import { standardizeIncomingAnalytics } from '../../core/helpers/standardize-incoming-analytics.helper';
import { getMergedAnalytics } from '../../core/helpers/get-merged-analytics.helper';
import { getSanitizedAnalytics } from '../../core/helpers/get-sanitized-analytics.helper';
import { constructAnalyticsUrl } from '../../core/helpers/construct-analytics-url.helper';
import { getGeoFeatureUrl } from '../../core/helpers/get-geo-feature-url.helper';
import { HttpClientService } from '../../core/services/http-client.service';
import { getSplitedVisualization } from '../../core/helpers/get-splited-visualization.helper';
import { getMapConfiguration } from '../../core/helpers/get-map-configuration.helper';
import { getDimensionValues } from '../../core/helpers/get-dimension-values.helpers';
import { updateVisualizationWithSettings } from '../../core/helpers/update-visualization-with-favorite.helper';
import { updateVisualizationWithCustomFilters } from '../../core/helpers/update-visualization-with-custom-filters.helper';
import { getSanitizedCustomFilterObject } from '../../core/helpers/get-sanitized-custom-filter-object.helper';
import { from } from 'rxjs/observable/from';

@Injectable()
export class VisualizationEffects {
  @Effect({ dispatch: false })
  setInitialVisualizations$ = this.actions$.pipe(
    ofType<dashboard.SetCurrentAction>(DashboardActions.SET_CURRENT),
    withLatestFrom(this.store),
    tap(([action, state]: [any, AppState]) => {
      const visualizationObjects: Visualization[] =
        state.visualization.visualizationObjects;
      const currentDashboard: Dashboard = _.find(state.dashboard.dashboards, [
        'id',
        action.payload
      ]);
      const currentGlobalFilter = state.globalFilter.entities['dashboards'];
      if (currentDashboard) {
        const initialVisualizations: any[] = _.filter(
          _.map(currentDashboard.dashboardItems, (dashboardItem: any) =>
            !_.find(visualizationObjects, ['id', dashboardItem.id]) ||
            (_.find(visualizationObjects, ['id', dashboardItem.id]) &&
              currentGlobalFilter.visitedPages.indexOf(currentDashboard.id) ===
                -1)
              ? mapDashboardItemToVisualization(
                  dashboardItem,
                  currentDashboard.id,
                  state.currentUser.user
                )
              : null
          ),
          (visualizationObject: Visualization) => visualizationObject
        );

        /**
         * Update store with initial visualization objects
         */
        this.store.dispatch(
          new visualization.SetInitialAction(initialVisualizations)
        );

        /**
         * Update visualizations with favorites
         */
        from(initialVisualizations)
          .pipe(
            mergeMap((visualizationObject: Visualization) => {
              const favoriteUrl = getVisualizationFavoriteUrl(
                visualizationObject.details.favorite
              );

              return this._getFavorite(favoriteUrl).pipe(
                map((favorite: any) => {
                  const globalFilter =
                    state.globalFilter.entities['dashboards'];

                  return !favorite.hasError
                    ? updateVisualizationWithCustomFilters(
                        updateVisualizationWithCustomFilters(
                          updateVisualizationWithSettings(
                            visualizationObject,
                            favorite
                          ),
                          getSanitizedCustomFilterObject({
                            items: [globalFilter.pe],
                            name: 'pe',
                            value: globalFilter.pe.id
                          })
                        ),
                        getSanitizedCustomFilterObject({
                          items: [globalFilter.ou],
                          name: 'ou',
                          value: globalFilter.ou.id
                        })
                      )
                    : {
                        id: visualizationObject.id,
                        error: favorite.errorMessage,
                        hasError: true
                      };
                })
              );
            })
          )
          .subscribe((visualizationWithSettings: any) => {
            if (!visualizationWithSettings.hasError) {
              this.store.dispatch(
                new visualization.LoadAnalyticsAction(visualizationWithSettings)
              );
            } else {
              this.store.dispatch(
                new visualization.VisualizationErrorOccurredAction(
                  visualizationWithSettings.id,
                  visualizationWithSettings.error
                )
              );
            }
          });
      }
    })
  );

  @Effect()
  loadAnalytics$ = this.actions$.pipe(
    ofType<visualization.LoadAnalyticsAction>(
      visualization.VisualizationActions.LOAD_ANALYTICS
    ),
    flatMap((action: any) => {
      const visualizationObject: Visualization = { ...action.payload };
      const visualizationDetails: any = { ...visualizationObject.details };
      const visualizationLayers: any[] = [...visualizationObject.layers];
      const analyticsPromises = _.map(
        visualizationLayers,
        (visualizationLayer: any) => {
          const visualizationFilter = _.find(visualizationDetails.filters, [
            'id',
            visualizationLayer.settings.id
          ]);

          const dxFilterObject = _.find(
            visualizationFilter ? visualizationFilter.filters : [],
            ['name', 'dx']
          );

          /**
           * Get dx items for non function items
           */
          const normalDxItems = _.filter(
            dxFilterObject ? dxFilterObject.items : [],
            normalDx => normalDx.dimensionItemType !== 'FUNCTION_RULE'
          );

          const newFiltersWithNormalDx = _.map(
            visualizationFilter ? visualizationFilter.filters : [],
            (visualizationObjectFilter: any) => {
              return visualizationObjectFilter.name === 'dx'
                ? {
                    ...visualizationObjectFilter,
                    items: normalDxItems,
                    value: _.map(
                      normalDxItems,
                      item => item.dimensionItem
                    ).join(';')
                  }
                : visualizationObjectFilter;
            }
          );

          /**
           * Get dx items for function items
           */
          const functionItems = _.filter(
            dxFilterObject ? dxFilterObject.items : [],
            normalDx => normalDx.dimensionItemType === 'FUNCTION_RULE'
          );

          const newFiltersWithFunction =
            functionItems.length > 0
              ? _.map(
                  visualizationFilter ? visualizationFilter.filters : [],
                  (visualizationObjectFilter: any) => {
                    return visualizationObjectFilter.name === 'dx'
                      ? {
                          ...visualizationObjectFilter,
                          items: functionItems,
                          value: _.map(functionItems, item => item.id).join(';')
                        }
                      : visualizationObjectFilter;
                  }
                )
              : [];

          /**
           * Construct analytics promise
           */
          return forkJoin(
            this.getNormalAnalyticsPromise(
              visualizationObject.type,
              visualizationLayer.settings,
              newFiltersWithNormalDx,
              action.vizType
            ),
            this.getFunctionAnalyticsPromise(newFiltersWithFunction)
          ).pipe(
            map((analyticsResponse: any[]) => {
              const sanitizedAnalyticsArray: any[] = _.filter(
                analyticsResponse,
                analyticsObject => analyticsObject
              );
              return sanitizedAnalyticsArray.length > 1
                ? getMergedAnalytics(sanitizedAnalyticsArray)
                : sanitizedAnalyticsArray[0];
            })
          );
        }
      );

      return forkJoin(analyticsPromises).pipe(
        map((analyticsResponse: any[]) => {
          const layers = _.map(
            action.payload.layers,
            (visualizationLayer: any, layerIndex: number) => {
              const visualizationFilter = _.find(visualizationDetails.filters, [
                'id',
                visualizationLayer.settings.id
              ]);
              const analytics = getSanitizedAnalytics(
                { ...analyticsResponse[layerIndex] },
                visualizationFilter ? visualizationFilter.filters : []
              );

              return {
                ...visualizationLayer,
                analytics:
                  analytics.headers || analytics.count
                    ? standardizeIncomingAnalytics(analytics, true)
                    : null
              };
            }
          );
          return {
            ...action.payload,
            details: {
              ...action.payload.details,
              loaded: true
            },
            layers: layers,
            operatingLayers: layers
          };
        }),
        map(
          (visualizationObjectResult: Visualization) =>
            new visualization.AddOrUpdateAction({
              visualizationObject: visualizationObjectResult,
              placementPreference: 'normal'
            })
        ),
        catchError(error =>
          of(
            new visualization.VisualizationErrorOccurredAction(
              action.payload.id,
              error
            )
          )
        )
      );
    })
  );

  @Effect()
  visualizationWithMapSettings$ = this.actions$.pipe(
    ofType<visualization.UpdateVisualizationWithMapSettingsAction>(
      visualization.VisualizationActions.UPDATE_VISUALIZATION_WITH_MAP_SETTINGS
    ),
    flatMap(action => this._updateVisualizationWithMapSettings(action.payload)),
    map(
      (visualizationObject: Visualization) =>
        new visualization.AddOrUpdateAction({
          visualizationObject: visualizationObject,
          placementPreference: 'normal'
        })
    )
  );

  @Effect()
  localFilterChange$ = this.actions$.pipe(
    ofType<visualization.LocalFilterChangeAction>(
      visualization.VisualizationActions.LOCAL_FILTER_CHANGE
    ),
    map((action: any) =>
      updateVisualizationWithCustomFilters(
        action.payload.visualizationObject,
        getSanitizedCustomFilterObject(action.payload.filterValue)
      )
    ),
    map(
      (visualizationObject: Visualization) =>
        new visualization.LoadAnalyticsAction(visualizationObject)
    )
  );

  @Effect()
  loadAnalyticsOnVisualizationTypeChange$ = this.actions$.pipe(
    ofType<visualization.VisualizationChangeAction>(
      visualization.VisualizationActions.VISUALIZATION_CHANGE
    ),
    withLatestFrom(this.store),
    map(([action, state]: [any, AppState]) => {
      const visualizationObject = _.find(
        state.visualization.visualizationObjects,
        ['id', action.payload.id]
      );
      return new visualization.LoadAnalyticsAction(
        visualizationObject,
        action.payload.type
      );
    })
  );

  @Effect({ dispatch: false })
  globalFilterChanges$ = this.actions$.pipe(
    ofType<visualization.GlobalFilterChangeAction>(
      visualization.VisualizationActions.GLOBAL_FILTER_CHANGE
    ),
    withLatestFrom(this.store),
    tap(([action, state]: [any, AppState]) => {
      const visualizationToUpdate: Visualization[] = _.filter(
        state.visualization.visualizationObjects,
        visualizationObject =>
          visualizationObject.dashboardId ===
            action.payload.currentDashboardId &&
          !visualizationObject.details.nonVisualizable
      );

      _.each(visualizationToUpdate, (visualizationObject: Visualization) => {
        this.store.dispatch(
          new visualization.LocalFilterChangeAction({
            visualizationObject: visualizationObject,
            filterValue: action.payload.filterValue
          })
        );
      });
    })
  );

  @Effect({ dispatch: false })
  resizeAction$ = this.actions$.pipe(
    ofType<visualization.ResizeAction>(
      visualization.VisualizationActions.RESIZE
    ),
    switchMap((action: any) =>
      this._resize(action.payload.visualizationId, action.payload.shape).pipe(
        map(() => new visualization.ResizeSuccessAction())
      )
    )
  );

  @Effect()
  deleteActions$ = this.actions$.pipe(
    ofType<visualization.DeleteAction>(
      visualization.VisualizationActions.DELETE
    ),
    map((action: visualization.DeleteAction) => action.payload),
    switchMap(({ dashboardId, visualizationId }) =>
      this._delete(dashboardId, visualizationId).pipe(
        map(
          () =>
            new visualization.DeleteSuccessAction({
              dashboardId,
              visualizationId
            })
        ),
        catchError(() =>
          of(new visualization.DeleteFailAction(visualizationId))
        )
      )
    )
  );

  @Effect()
  deleteSuccess$ = this.actions$.pipe(
    ofType<visualization.DeleteSuccessAction>(
      visualization.VisualizationActions.DELETE_SUCCESS
    ),
    map((action: visualization.DeleteSuccessAction) => action.payload),
    map(
      ({ dashboardId, visualizationId }) =>
        new dashboard.DeleteItemSuccessAction({
          dashboardId,
          visualizationId
        })
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private httpClient: HttpClientService
  ) {}

  private getNormalAnalyticsPromise(
    visualizationType: string,
    visualizationSettings: any,
    visualizationFilters: any[],
    vizType: string = 'CHART'
  ): Observable<any> {
    const analyticsUrl = constructAnalyticsUrl(
      visualizationType,
      visualizationSettings,
      visualizationFilters,
      vizType
    );
    return analyticsUrl !== ''
      ? this.httpClient.get(analyticsUrl).pipe(
          mergeMap((analyticsResult: any) => {
            return analyticsResult.count && analyticsResult.count < 2000
              ? this.httpClient.get(
                  constructAnalyticsUrl(
                    visualizationType,
                    {
                      ...visualizationSettings,
                      eventClustering: false
                    },
                    visualizationFilters
                  )
                )
              : of(analyticsResult);
          })
        )
      : of(null);
  }

  private getFunctionAnalyticsPromise(
    visualizationFilters: any[]
  ): Observable<any> {
    return new Observable(observer => {
      if (
        visualizationFilters.length === 0 ||
        _.some(
          visualizationFilters,
          (visualizationFilter: any) => visualizationFilter.items.length === 0
        )
      ) {
        observer.next(null);
        observer.complete();
      } else {
        const ouObject = _.find(visualizationFilters, ['name', 'ou']);
        const ouValue = ouObject ? ouObject.value : '';

        const peObject = _.find(visualizationFilters, ['name', 'pe']);
        const peValue = peObject ? peObject.value : '';

        const dxObject = _.find(visualizationFilters, ['name', 'dx']);

        const functionAnalyticsPromises = _.map(
          dxObject ? dxObject.items : [],
          dxItem => {
            return this._runFunction(
              {
                pe: peValue,
                ou: ouValue,
                rule: dxItem.config ? dxItem.config.ruleDefinition : null,
                success: result => {},
                error: error => {}
              },
              dxItem.config ? dxItem.config.functionString : ''
            );
          }
        );

        forkJoin(functionAnalyticsPromises).subscribe(
          (analyticsResponse: any[]) => {
            observer.next(
              analyticsResponse.length > 1
                ? getMergedAnalytics(analyticsResponse)
                : analyticsResponse[0]
            );
            observer.complete();
          }
        );
      }
    });
  }

  private _runFunction(
    functionParameters: any,
    functionString: string
  ): Observable<any> {
    return new Observable(observ => {
      if (!this._isError(functionString)) {
        try {
          functionParameters.error = error => {
            observ.error(error);
            observ.complete();
          };
          functionParameters.success = results => {
            observ.next(results);
            observ.complete();
          };
          functionParameters.progress = results => {};
          const execute = Function('parameters', functionString);

          execute(functionParameters);
        } catch (e) {
          observ.error(e.stack);
          observ.complete();
        }
      } else {
        observ.error({ message: 'Errors in the code.' });
        observ.complete();
      }
    });
  }

  private _isError(code) {
    let successError = false;
    let errorError = false;
    let progressError = false;
    const value = code
      .split(' ')
      .join('')
      .split('\n')
      .join('')
      .split('\t')
      .join('');
    if (value.indexOf('parameters.success(') === -1) {
      successError = true;
    }
    if (value.indexOf('parameters.error(') === -1) {
      errorError = true;
    }
    if (value.indexOf('parameters.progress(') === -1) {
      progressError = true;
    }
    return successError || errorError;
  }

  private _delete(dashboardId: string, visualizationId: string) {
    return this.httpClient.delete(
      'dashboards/' + dashboardId + '/items/' + visualizationId
    );
  }

  private _updateVisualizationWithMapSettings(
    visualizationObject: Visualization
  ) {
    const newVisualizationObject: Visualization =
      visualizationObject.details.type !== 'MAP'
        ? getSplitedVisualization(visualizationObject)
        : { ...visualizationObject };

    const newVisualizationObjectDetails: any = {
      ...newVisualizationObject.details
    };

    const dimensionArea = this._findOrgUnitDimension(
      newVisualizationObject.details.layouts[0].layout
    );
    return new Observable(observer => {
      newVisualizationObjectDetails.mapConfiguration = getMapConfiguration(
        visualizationObject
      );
      const geoFeaturePromises = _.map(
        newVisualizationObject.layers,
        (layer: any) => {
          const visualizationFilters = getDimensionValues(
            layer.settings[dimensionArea],
            [],
            'row'
          );
          const orgUnitFilterObject = _.find(
            visualizationFilters ? visualizationFilters : [],
            ['name', 'ou']
          );
          const orgUnitFilterValue = orgUnitFilterObject
            ? orgUnitFilterObject.value
            : '';
          /**
           * Get geo feature
           * @type {string}
           */
          // TODO find best way to reduce number of geoFeature calls
          const geoFeatureUrl = getGeoFeatureUrl(orgUnitFilterValue);
          return geoFeatureUrl !== ''
            ? this.httpClient.get(geoFeatureUrl)
            : Observable.of(null);
        }
      );

      forkJoin(geoFeaturePromises).subscribe(
        (geoFeatureResponse: any[]) => {
          newVisualizationObject.layers = newVisualizationObject.layers.map(
            (layer: any, layerIndex: number) => {
              const newSettings: any = { ...layer.settings };
              if (geoFeatureResponse[layerIndex] !== null) {
                newSettings.geoFeature = [...geoFeatureResponse[layerIndex]];
              }
              return { ...layer, settings: newSettings };
            }
          );
          newVisualizationObjectDetails.loaded = true;
          observer.next({
            ...newVisualizationObject,
            details: newVisualizationObjectDetails
          });
          observer.complete();
        },
        error => {
          newVisualizationObjectDetails.hasError = true;
          newVisualizationObjectDetails.errorMessage = error;
          newVisualizationObjectDetails.loaded = true;
          observer.next({
            ...newVisualizationObject,
            details: newVisualizationObjectDetails
          });
          observer.complete();
        }
      );
    });
  }

  private _findOrgUnitDimension(visualizationLayout: any) {
    let dimensionArea = '';

    if (_.find(visualizationLayout.columns, ['value', 'ou'])) {
      dimensionArea = 'columns';
    } else if (_.find(visualizationLayout.rows, ['value', 'ou'])) {
      dimensionArea = 'rows';
    } else {
      dimensionArea = 'filters';
    }

    return dimensionArea;
  }

  private _resize(visualizationId: string, shape: string) {
    return this.httpClient.put(
      'dashboardItems/' + visualizationId + '/shape/' + shape,
      ''
    );
  }

  private _getFavorite(favoriteUrl) {
    const favoritePromise =
      favoriteUrl !== '' ? this.httpClient.get(favoriteUrl) : Observable.of({});
    return new Observable(observer => {
      favoritePromise.subscribe(
        favorite => {
          observer.next(favorite);
          observer.complete();
        },
        error => {
          observer.next({ hasError: true, errorMessage: error });
          observer.complete();
        }
      );
    });
  }
}
