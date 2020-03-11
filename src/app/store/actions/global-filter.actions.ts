import { Action } from '@ngrx/store';
import { GlobalFilter } from '../../core/models/global-filter.model';

export enum GlobalFilterActionTypes {
  GLOBAL_FILTER_UPDATE = '[GlobalFilter] Global filter action',
  ADD_GLOBAL_FILTER = '[GlobalFilter] Add global filter',
  UPDATE_GLOBAL_FILTER = '[GlobalFilter] Update global filter',
  UPDATE_VISITED_PAGE = '[GlobalFilter] Update visited page'
}

export class GlobalFilterUpdateAction implements Action {
  readonly type = GlobalFilterActionTypes.GLOBAL_FILTER_UPDATE;

  constructor(public globalFilter: any, public currentPage?: string) {}
}

export class AddGlobalFilterAction implements Action {
  readonly type = GlobalFilterActionTypes.ADD_GLOBAL_FILTER;

  constructor(public globalFilter: GlobalFilter) {}
}

export class UpdateGlobalFilterAction implements Action {
  readonly type = GlobalFilterActionTypes.UPDATE_GLOBAL_FILTER;

  constructor(public id: string, public changes: Partial<GlobalFilter>) {}
}

export class UpdateVisitedPageAction implements Action {
  readonly type = GlobalFilterActionTypes.UPDATE_VISITED_PAGE;

  constructor(public id: string, public pageId: string) {}
}

export type GlobalFilterAction =
  | GlobalFilterUpdateAction
  | AddGlobalFilterAction
  | UpdateGlobalFilterAction
  | UpdateVisitedPageAction;
