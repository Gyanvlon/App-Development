import { PROGRAMSTAGE_SECTIONS_UPDATE,RESET,RESET_FORM, METADATA_RECEIVED, EVENT_FAILURE,EVENT_POST, SET_DATA_VALUES, SET_TEI_ATTRIBUTE, TRACKED_ENTITY_RECEIVED, CHECKED_VALIDATION, UPDATE_EVENT_VALUES, SET_PROGRAM_RULES, SET_PAYLOAD, PROGRAMS_RECEIVED, PROGRAMSTAGE_RECEIVED, PROGRAMSTAGE_SECTIONS_RECEIVED } from './types';
import { createAction } from './actions';
import { eventRules } from '../../helpers/eventRules';
export const LoadMetaData = payload => dispatch => {
  dispatch(createAction(METADATA_RECEIVED, payload))
};
export const setPayload = payload => (dispatch, getState) => {
  const programs = getState().data.dynamicData.programs
  const programStages = getState().data.dynamicData.programStages
   let data= {
    programs:programs,
    programStages:programStages
   }
  dispatch(createAction(SET_PAYLOAD, payload));
  dispatch(createAction(PROGRAMSTAGE_RECEIVED, data));
}
export const getOrgUnitDetail = payload => dispatch => dispatch(createAction(SET_PAYLOAD, payload));
export const getProgramStageSections = payload => (dispatch, getState) => {
  
  const dataValues = getState().data.dataValue;
  const programRules = getState().data.programsRules;
  try {
    dispatch(createAction(PROGRAMSTAGE_SECTIONS_RECEIVED, payload));
    const data = eventRules(dataValues, payload , programRules);

    dispatch(createAction(SET_DATA_VALUES, data['0']));
    dispatch(createAction(PROGRAMSTAGE_SECTIONS_UPDATE, data['1']));
  } catch (error) {
    console.error("Error in Program stage Section!");
  }
} 
export const setDataValues = payload => dispatch => dispatch(createAction(SET_DATA_VALUES, payload));
export const getPrograms = payload => dispatch => dispatch(createAction(PROGRAMS_RECEIVED, payload));
export const getProgramStages = id => (dispatch, getState) => {
  const programs = getState().data.dynamicData.programs;
  let program = programs.filter(program => program.id === id);
  let ps = program['0'].programStages  //.filter( ps => ps["attributeValues"]["YiQU1BzZvVQ"]);
  let payload = {
    programs: programs,
    programStages: ps
  };
  dispatch(createAction(PROGRAMSTAGE_RECEIVED, payload));
};
export const updateEventValues = payload => dispatch => dispatch(createAction(UPDATE_EVENT_VALUES, payload));
export const getTEIAttribute = payload => dispatch => dispatch(createAction(SET_TEI_ATTRIBUTE, payload));
export const getTrackedEntityInstances = payload => dispatch => dispatch(createAction(TRACKED_ENTITY_RECEIVED, payload));
export const validation = payload => dispatch => dispatch(createAction(CHECKED_VALIDATION, payload));
export const setProgramRule = payload => dispatch => dispatch(createAction(SET_PROGRAM_RULES, payload));
export const getProgramRuleChecking = (dataValues, programStageSection, programRules) => dispatch => {
  try {
    const data = eventRules(dataValues, programStageSection, programRules);
    dispatch(createAction(SET_DATA_VALUES, data['0']));
    dispatch(createAction(PROGRAMSTAGE_SECTIONS_UPDATE, data['1']));
  } catch (error) {
    console.error(error);
  }
};
export const postingEvent = () => dispatch => dispatch(createAction(EVENT_POST));
export const failureEvent = () => dispatch => dispatch(createAction(EVENT_FAILURE));
export const resetDyanamicData = () => dispatch => {
  dispatch(createAction(RESET));
}
export const resetStaticData = () => (dispatch, getState) => {
  const programs = getState().data.dynamicData.programs;
  dispatch(createAction(RESET_FORM, programs));
}

