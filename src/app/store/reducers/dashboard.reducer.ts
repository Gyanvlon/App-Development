import * as _ from 'lodash';
import { DashboardAction, DashboardActions } from '../actions/dashboard.actions';
import { Dashboard } from '../../core/models/dashboard.model';
import { DashboardSharing } from '../../core/models/dashboard-sharing.model';
import { DashboardSearchItem } from '../../core/models/dashboard-search-item.model';
import { getFilteredDashboards } from '../../core/helpers/get-filtered-dashboards.helper';
import { getCurrentPage } from '../../core/helpers/get-current-page';
import { mapStateToDashboardObject } from '../../core/helpers/map-state-to-dashboard-object.helper';
import {
  mapStateToDashboardSearchItems,
  updateWithHeaderSelectionCriterias
} from '../../core/helpers/map-state-to-dashboard-search-items.helper';

export interface DashboardState {
  currentDashboardPage: number;
  dashboardPageNumber: number;
  dashboardPerPage: number;
  currentDashboard: string;
  dashboardsLoaded: boolean;
  dashboards: Dashboard[];
  activeDashboards: Dashboard[];
  dashboardSharing: {[id: string]: DashboardSharing};
  showBookmarked: boolean;
  dashboardSearchItem: DashboardSearchItem;
  dashboardSearchTerm: string;
  dashboardNotification: {
    unreadInterpretations: number;
    unreadMessageConversations: number
  };
}

export const INITIAL_DASHBOARD_SEARCH_ITEM: DashboardSearchItem = {
  loading: false,
  loaded: true,
  headers: [
    {
      name: 'all',
      title: 'ALL',
      selected: true,
      itemCount: 0
    },
    {
      icon: 'assets/icons/users.png',
      name: 'users',
      title: 'Users',
      selected: false,
      itemCount: 0
    },
    {
      icon: 'assets/icons/table.png',
      name: 'tables',
      title: 'Tables',
      selected: false,
      itemCount: 0
    },
    {
      icon: 'assets/icons/map.png',
      name: 'maps',
      title: 'Maps',
      selected: false,
      itemCount: 0
    },
    {
      icon: 'assets/icons/column.png',
      name: 'charts',
      title: 'Charts',
      selected: false,
      itemCount: 0
    },
    {
      icon: 'assets/icons/report.png',
      name: 'reports',
      title: 'Reports',
      selected: false,
      itemCount: 0
    },
    {
      icon: 'assets/icons/resource.png',
      name: 'resources',
      title: 'Resources',
      selected: false,
      itemCount: 0
    },
    {
      icon: 'assets/icons/app.png',
      name: 'apps',
      title: 'Apps',
      selected: false,
      itemCount: 0
    }
  ],
  results: [],
  resultCount: 0
};

export const INITIAL_DASHBOARD_STATE: DashboardState = {
  currentDashboardPage: 0,
  dashboardPageNumber: 0,
  dashboardPerPage: 8,
  currentDashboard: undefined,
  dashboardsLoaded: false,
  dashboards: [],
  dashboardSharing: null,
  showBookmarked: false,
  activeDashboards: [],
  dashboardSearchItem: INITIAL_DASHBOARD_SEARCH_ITEM,
  dashboardSearchTerm: '',
  dashboardNotification: {
    unreadInterpretations: 0,
    unreadMessageConversations: 0
  }
};

export function dashboardReducer(state: DashboardState = INITIAL_DASHBOARD_STATE,
  action: DashboardAction) {
  switch (action.type) {
    case DashboardActions.LOAD_DASHBOARD_SUCCESS: {
      const newDashboards: Dashboard[] = _.map(
        action.payload.dashboards,
        (dashboardObject: any) =>
          mapStateToDashboardObject(
            dashboardObject,
            null,
            action.payload.currentUser ? action.payload.currentUser.id : ''
          )
      );

      const filteredDashboards = getFilteredDashboards(newDashboards, state.showBookmarked);

      return {
        ...state,
        dashboards: [...newDashboards],
        activeDashboards: [...filteredDashboards],
        dashboardsLoaded: true,
        dashboardPageNumber: Math.ceil(
          filteredDashboards.length / state.dashboardPerPage
        )
      };

    }

    case DashboardActions.LOAD_OPTIONS_SUCCESS: {
      const newDashboardsWithOptions: Dashboard[] = _.map(
        _.map(state.dashboards, (dashboardObject: Dashboard) => {
          const dashboardOption = _.find(action.payload.dashboardOptions, [
            'id',
            dashboardObject.id
          ]);

          return dashboardOption
            ? {
              ...dashboardObject,
              ...dashboardOption
            }
            : dashboardObject;
        }),
        (dashboardObject: any) =>
          mapStateToDashboardObject(
            dashboardObject,
            null,
            action.payload.currentUser.id
          )
      );
      const filteredDashboards = getFilteredDashboards(newDashboardsWithOptions, state.showBookmarked);

      return {
        ...state,
        dashboards: [...newDashboardsWithOptions],
        activeDashboards: [...filteredDashboards],
        currentDashboardPage: getCurrentPage(
          filteredDashboards,
          action.payload,
          state.dashboardPerPage
        )
      };
    }
    case DashboardActions.SET_CURRENT: {
      return {
        ...state,
        currentDashboard: action.payload,
        currentDashboardPage: getCurrentPage(
          state.activeDashboards,
          action.payload,
          state.dashboardPerPage
        )
      };
    }

    case DashboardActions.CHANGE_CURRENT_PAGE:
      return {
        ...state,
        currentDashboardPage: state.currentDashboardPage + action.payload
      };

    case DashboardActions.CREATE: {
      const newDashboardsWithToBeCreated: Dashboard[] = [
        ..._.sortBy(
          [
            ...state.dashboards,
            mapStateToDashboardObject(
              {name: action.payload},
              'create'
            )
          ],
          ['name']
        )
      ];

      const filteredDashboards = getFilteredDashboards(newDashboardsWithToBeCreated, state.showBookmarked);
      return {
        ...state,
        dashboards: [...newDashboardsWithToBeCreated],
        activeDashboards: [...filteredDashboards],
        currentDashboardPage: getCurrentPage(
          filteredDashboards,
          '0',
          state.dashboardPerPage
        )
      };
    }

    case DashboardActions.CREATE_SUCCESS: {
      const createdDashboardIndex = _.findIndex(
        state.dashboards,
        _.find(state.dashboards, ['id', '0'])
      );

      const newDashboardsWithCreated =
        createdDashboardIndex !== -1
          ? [
            ...state.dashboards.slice(0, createdDashboardIndex),
            mapStateToDashboardObject(
              action.payload,
              'created'
            ),
            ...state.dashboards.slice(createdDashboardIndex + 1)
          ]
          : state.dashboards;

      const filteredDashboards = getFilteredDashboards(newDashboardsWithCreated, state.showBookmarked);

      return {
        ...state,
        dashboards: [...newDashboardsWithCreated],
        activeDashboards: [...filteredDashboards]
      };
    }

    case DashboardActions.RENAME: {
      const availableDashboard: Dashboard = _.find(state.dashboards, [
        'id',
        action.payload.id
      ]);
      const createdDashboardIndex = _.findIndex(
        state.dashboards,
        availableDashboard
      );

      const newDashboardsWithToBeUpdated =
        createdDashboardIndex !== -1
          ? [
            ...state.dashboards.slice(0, createdDashboardIndex),
            mapStateToDashboardObject(
              availableDashboard,
              'update'
            ),
            ...state.dashboards.slice(createdDashboardIndex + 1)
          ]
          : state.dashboards;

      const filteredDashboards = getFilteredDashboards(newDashboardsWithToBeUpdated, state.showBookmarked);

      return {
        ...state,
        dashboards: [...newDashboardsWithToBeUpdated],
        activeDashboards: [...filteredDashboards]
      };
    }

    case DashboardActions.RENAME_SUCCESS: {
      const renamedDashboardIndex = _.findIndex(
        state.dashboards,
        _.find(state.dashboards, ['id', action.payload.id])
      );

      const newDashboardsWithUpdated: Dashboard[] =
        renamedDashboardIndex !== -1
          ? _.sortBy(
          [
            ...state.dashboards.slice(0, renamedDashboardIndex),
            mapStateToDashboardObject(
              action.payload,
              'updated'
            ),
            ...state.dashboards.slice(renamedDashboardIndex + 1)
          ],
          ['name']
          )
          : [...state.dashboards];

      const filteredDashboards = getFilteredDashboards(newDashboardsWithUpdated, state.showBookmarked);
      return {
        ...state,
        dashboards: newDashboardsWithUpdated,
        activeDashboards: [...filteredDashboards],
        currentDashboardPage: getCurrentPage(
          filteredDashboards,
          action.payload.id,
          state.dashboardPerPage
        )
      };
    }

    case DashboardActions.DELETE: {
      const dashboardToDelete = _.find(state.dashboards, [
        'id',
        action.payload
      ]);
      const dashboardToDeleteIndex = _.findIndex(
        state.dashboards,
        dashboardToDelete
      );

      const newDashboardWithToDelete = dashboardToDeleteIndex !== -1
        ? [
          ...state.dashboards.slice(0, dashboardToDeleteIndex),
          mapStateToDashboardObject(
            dashboardToDelete,
            'delete'
          ),
          ...state.dashboards.slice(dashboardToDeleteIndex + 1)
        ]
        : [...state.dashboards];

      return {
        ...state,
        dashboards: [...newDashboardWithToDelete],
        activeDashboards: [...getFilteredDashboards(newDashboardWithToDelete, state.showBookmarked)]
      };
    }
    case DashboardActions.COMMIT_DELETE: {
      const dashboardDeletedIndex = _.findIndex(
        state.dashboards,
        _.find(state.dashboards, ['id', action.payload])
      );

      const newDashboardWithDeletedRemoved = dashboardDeletedIndex !== -1
        ? [
          ...state.dashboards.slice(0, dashboardDeletedIndex),
          ...state.dashboards.slice(dashboardDeletedIndex + 1)
        ]
        : [...state.dashboards];
      return {
        ...state,
        dashboards: [...newDashboardWithDeletedRemoved],
        activeDashboards: [...getFilteredDashboards(newDashboardWithDeletedRemoved, state.showBookmarked)]
      };
    }

    case DashboardActions.CHANGE_PAGE_ITEMS: {
      return {
        ...state,
        dashboardPerPage: action.payload,
        currentDashboardPage: getCurrentPage(
          state.activeDashboards,
          state.currentDashboard,
          action.payload
        ),
        dashboardPageNumber: Math.ceil(state.activeDashboards.length / action.payload)
      };
    }

    case DashboardActions.HIDE_MENU_NOTIFICATION_ICON: {
      const correspondingDashboard: Dashboard = _.find(state.dashboards, [
        'id',
        action.payload.id
      ]);
      const correspondingDashboardIndex = _.findIndex(
        state.dashboards,
        correspondingDashboard
      );

      const newDashboardsWithHiddenNotification = [
        ...state.dashboards.slice(0, correspondingDashboardIndex),
        {
          ...correspondingDashboard,
          details: {
            ...correspondingDashboard.details,
            showIcon: false
          }
        },
        ...state.dashboards.slice(correspondingDashboardIndex + 1)
      ];

      return correspondingDashboardIndex !== -1
        ? {
          ...state,
          dashboards: [...newDashboardsWithHiddenNotification],
          activeDashboards: [
            ...getFilteredDashboards(newDashboardsWithHiddenNotification, state.showBookmarked)
          ]
        }
        : {
          ...state
        };
    }

    case DashboardActions.SEARCH_ITEMS: {
      return {
        ...state,
        dashboardSearchItem: {
          ...state.dashboardSearchItem,
          loading: true,
          loaded: false
        }
      };
    }

    case DashboardActions.UPDATE_SEARCH_RESULT: {
      return {
        ...state,
        dashboardSearchItem: mapStateToDashboardSearchItems(
          state.dashboardSearchItem,
          action.payload
        )
      };
    }

    case DashboardActions.CHANGE_SEARCH_HEADER: {
      const clickedHeader = action.payload.header;

      return {
        ...state,
        dashboardSearchItem: updateWithHeaderSelectionCriterias({
          ...state.dashboardSearchItem,
          headers: state.dashboardSearchItem.headers.map(header => {
            const newHeader: any = {...header};
            if (newHeader.name === clickedHeader.name) {
              newHeader.selected = clickedHeader.selected;
            }

            if (clickedHeader.name === 'all') {
              if (newHeader.name !== 'all' && clickedHeader.selected) {
                newHeader.selected = false;
              }
            } else {
              if (newHeader.name === 'all' && clickedHeader.selected) {
                newHeader.selected = false;
              }
            }

            if (
              !action.payload.multipleSelection &&
              clickedHeader.name !== newHeader.name
            ) {
              newHeader.selected = false;
            }

            return newHeader;
          })
        })
      };
    }

    case DashboardActions.LOAD_SHARING_DATA:
      return state;

    case DashboardActions.LOAD_SHARING_DATA_SUCCESS:
      return {
        ...state,
        dashboardSharing: {
          ...state.dashboardSharing,
          [action.payload.id]: action.payload
        }
      };

    case DashboardActions.UPDATE_SHARING_DATA: {
      const dashboardSharingToUpdate: DashboardSharing =
        state.dashboardSharing[state.currentDashboard];
      return {
        ...state,
        dashboardSharing: {
          ...state.dashboardSharing,
          [state.currentDashboard]: {
            ...dashboardSharingToUpdate,
            sharingEntity: action.payload
          }
        }
      };
    }

    case DashboardActions.DELETE_ITEM_SUCCESS: {
      const currentDashboard: Dashboard = _.find(state.dashboards, [
        'id',
        action.payload.dashboardId
      ]);
      const dashboardIndex = state.dashboards.indexOf(currentDashboard);

      const dashboardItemIndex = currentDashboard
        ? currentDashboard.dashboardItems.indexOf(
          _.find(currentDashboard.dashboardItems, [
            'id',
            action.payload.visualizationId
          ])
        )
        : -1;

      const newDashboardWithDeletedItem = dashboardIndex !== -1
        ? [
          ...state.dashboards.slice(0, dashboardIndex),
          {
            ...currentDashboard,
            dashboardItems: [
              ...currentDashboard.dashboardItems.slice(
                0,
                dashboardItemIndex
              ),
              ...currentDashboard.dashboardItems.slice(
                dashboardItemIndex + 1
              )
            ]
          },
          ...state.dashboards.slice(dashboardIndex + 1)
        ]
        : [...state.dashboards];

      return {
        ...state,
        dashboards: [...newDashboardWithDeletedItem],
        activeDashboards: [...newDashboardWithDeletedItem]
      };
    }

    case DashboardActions.BOOKMARK_DASHBOARD: {
      const bookmarkedDashboard: Dashboard = _.find(state.dashboards, [
        'id',
        action.payload.dashboardId
      ]);
      const dashboardIndex = state.dashboards.indexOf(bookmarkedDashboard);
      const newDashboardWithBookmarked = [
        ...state.dashboards.slice(0, dashboardIndex),
        {
          ...bookmarkedDashboard,
          details: {
            ...bookmarkedDashboard.details,
            bookmarked: action.payload.bookmarked
          }
        },
        ...state.dashboards.slice(dashboardIndex + 1)
      ];

      const filteredDashboards = getFilteredDashboards(newDashboardWithBookmarked, state.showBookmarked);

      return dashboardIndex !== -1
        ? {
          ...state,
          dashboards: [...newDashboardWithBookmarked],
          activeDashboards: [...filteredDashboards],
          currentDashboardPage: getCurrentPage(
            filteredDashboards,
            state.currentDashboard,
            state.dashboardPerPage
          )
        }
        : {...state};
    }

    case DashboardActions.TOGGLE_BOOKMARKED: {
      const showBookmarked = !state.showBookmarked;
      const filteredDashboards = getFilteredDashboards(state.dashboards, showBookmarked);
      return {
        ...state,
        showBookmarked: showBookmarked,
        activeDashboards: [...filteredDashboards],
        currentDashboardPage: getCurrentPage(
          filteredDashboards,
          state.currentDashboard,
          state.dashboardPerPage
        ),
        dashboardPageNumber: Math.ceil(
          filteredDashboards.length / state.dashboardPerPage
        )
      };
    }

    case DashboardActions.SET_SEARCH_TERM: {
      const filteredDashboards = getFilteredDashboards(state.dashboards, state.showBookmarked, action.payload);
      return {
        ...state,
        dashboardSearchTerm: action.payload,
        activeDashboards: [...filteredDashboards],
        currentDashboardPage: getCurrentPage(
          filteredDashboards,
          state.currentDashboard,
          state.dashboardPerPage
        ),
        dashboardPageNumber: Math.ceil(
          filteredDashboards.length / state.dashboardPerPage
        )
      };
    }

    case DashboardActions.LOAD_NOTIFACATION_SUCCESS:
      return {...state, dashboardNotification: action.payload};

    default:
      return state;
  }
}
