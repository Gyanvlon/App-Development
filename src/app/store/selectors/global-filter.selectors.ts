import { createSelector } from '@ngrx/store';
import * as _ from 'lodash';
import { getCurrentPageState } from './router.selectors';
import { getGlobalFilterEntities } from '../reducers';

export const getCurrentGlobalFilter = createSelector(getGlobalFilterEntities, getCurrentPageState,
  (globalFilterEntity: any, currentPage: string) => currentPage === 'download' ?
                                                    globalFilterEntity['data-entry'] :
                                                    globalFilterEntity[currentPage]);

export const getCurrentOrgUnitFilter = createSelector(getCurrentGlobalFilter, (globalFilter) => {
  if (!globalFilter) {
    return null;
  }
  const splittedId = globalFilter.ou.id.split(';');
  const nameSeparatorIndex = globalFilter.ou.name.indexOf(' in ');
  const selectedOrgUnits = [
    {
      id: splittedId[0],
      name: nameSeparatorIndex !== -1 ?
            globalFilter.ou.name.slice(nameSeparatorIndex + 4, globalFilter.ou.name.length) :
            globalFilter.ou.name
    }
  ];
  const splittedNonOrgUnitId = splittedId.length > 1 ? splittedId.slice(1, splittedId.length) : [];
  const splittedNonOrgUnitNames = globalFilter.ou.name.slice(0, nameSeparatorIndex).split(', ');
  const nonOrgUnitArray = splittedNonOrgUnitId.map((nonOrgUnitid: string, index: number) => {
    return {id: nonOrgUnitid, name: splittedNonOrgUnitNames[index]};
  });

  const selectedOrgUnitGroups = nonOrgUnitArray.filter(
    nonOrgUnitObject => nonOrgUnitObject.id.indexOf('OU_GROUP') !== -1);
  const selectedOrgUnitLevels = nonOrgUnitArray.filter(nonOrgUnitObject => nonOrgUnitObject.id.indexOf('LEVEL') !== -1).
    map((selectedLevel: any) => {
      return {
        ...selectedLevel,
        level: selectedLevel.id.split('-')[1]
      };
    });
  return globalFilter ? {
    selectionMode: selectedOrgUnitLevels.length > 0 ? 'Level' : selectedOrgUnitGroups.length > 0 ? 'Group' : 'orgUnit',
    selectedLevels: selectedOrgUnitLevels,
    showUpdateButton: true,
    selectedGroups: selectedOrgUnitGroups,
    orgUnitLevels: [],
    orgUnitGroups: [],
    selectedOrgUnits,
    userOrgUnits: [],
    type: 'report', // can be 'data_entry'
    selectedUserOrgUnits: []
  } : null;
});
