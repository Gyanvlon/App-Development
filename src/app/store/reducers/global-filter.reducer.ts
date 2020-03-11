import * as _ from 'lodash';
import { GlobalFilterAction, GlobalFilterActionTypes } from '../actions/global-filter.actions';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { GlobalFilter } from '../../core/models/global-filter.model';


export interface GlobalFilterState extends EntityState<GlobalFilter> {

}

export const adapter: EntityAdapter<GlobalFilter> = createEntityAdapter<GlobalFilter>();

export const initialState: GlobalFilterState = adapter.getInitialState({

});

export function globalFilterReducer(state: GlobalFilterState = initialState,
  action: GlobalFilterAction): GlobalFilterState {
  switch (action.type) {
    case GlobalFilterActionTypes.ADD_GLOBAL_FILTER:
      return adapter.addOne(action.globalFilter, state);

    case GlobalFilterActionTypes.UPDATE_GLOBAL_FILTER:
      return adapter.updateOne({
        id: action.id,
        changes: action.changes,
      }, state);
    case GlobalFilterActionTypes.UPDATE_VISITED_PAGE:
      const selectedFilter = state.entities[action.id];
      return adapter.updateOne({
        id: action.id,
        changes: {
          visitedPages: _.uniq([...selectedFilter.visitedPages, action.pageId])
        },
      }, state);
  }
  return state;
}
