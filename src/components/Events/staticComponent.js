import React, { useEffect } from "react";
import { Paper, Grid, Card, CardContent, CircularProgress } from "@material-ui/core";
import { OrgUnitTree } from "@hisp-amr/org-unit-tree";
import { useDispatch, useSelector } from "react-redux";
import { resetDyanamicData,resetStaticData, getOrgUnitDetail, setPayload, setDataValues, getProgramStages, getPrograms, getProgramStageSections, setProgramRule } from "../../redux/action/event";
import { Sections } from "./sections";
import Loader from "react-loader-spinner";
import "./custom.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const StaticData = (props) => {
  const dispatch = useDispatch();
  const OrgUnit = useSelector(state => state.data.payload.orgUnit);
  const OrgUnitId = useSelector(state => state.data.payload.orgUnitId);
  const programsId = useSelector(state => state.data.payload.programsId);
  const programs = useSelector(state => state.data.dynamicData.programs);
  var programStages = useSelector(state => state.data.dynamicData.programStages);
  const payload = useSelector(state => state.data.payload);
  const metadata = useSelector(state => state.data.metadata);
  const loading = useSelector(state => state.data.loading);
  const orgUnitStatus = useSelector(state => state.data.orgUnitStatus);
  const metaDataLoading = useSelector(state => state.data.metaDataLoading);
  const startDate = useSelector(state => state.data.payload.eventDate);
  console.log('here is ps', programStages)
  if (programStages === undefined) {
    programStages = [{
      name: "Please Select Program Stage"
    }];
  } else {
    programStages = programStages;
  }

  useEffect(() => {
   if( orgUnitStatus && !metaDataLoading){
    // window.location.reload(false)
    let data = [];
    for (let program of metadata.programs) {
      // if(program["attributeValues"]["YiQU1BzZvVQ"]){
        for (let org of program.organisationUnits) {
          if (org.id === payload.orgUnitId ) {
            data.push(program);
          }
        }
      // }
    }
    dispatch(getPrograms(data));
   }  
  }, [orgUnitStatus, metaDataLoading]);

 
  const onSelect = selected => {
        dispatch(getOrgUnitDetail({...selected, eventDate:new Date()}));
        dispatch(resetDyanamicData());
      };
  const onSelectProgram = e => {
    let programRules = [];

    for (let programRule of metadata.programRules) {
      if (programRule.program.id === e.target.value) {
        programRules.push(programRule);
      }
    }

    let data = {
      programId: e.target.value,
      id: OrgUnitId,
      displayName: OrgUnit,
      eventDate: payload.eventDate
    };
    dispatch(setProgramRule(programRules));
    dispatch(setPayload(data));
    dispatch(resetStaticData());
    dispatch(getProgramStages(e.target.value));
  };

  const selectedProgramStage = e => {
    let ps = programStages.filter(programStage => programStage.id === e.target.value);
    let dataValues = [];

    for (let values of ps[0].programStageDataElements) {
      dataValues[values.dataElement.id] = "";
    }

    let data = {
      programId: programsId,
      displayName: OrgUnit,
      id: OrgUnitId,
      programStageId: e.target.value,
      eventDate: payload.eventDate
    };
     let datas ={
    orgUnitId: payload.orgUnitId ,
    programStageId: e.target.value,
    programsId: payload.programsId,
    eventDate: payload.eventDate,
    }
    localStorage.setItem("payload", JSON.stringify(datas))
    dispatch(setPayload(data));
    dispatch(setDataValues(dataValues));
    dispatch(getProgramStageSections(ps[0].programStageSections));
  };

  const onSelectDate = e => {
    let data = {
      programId: payload.programsId,
      displayName: payload.orgUnit,
      id: payload.orgUnitId,
      programStageId: payload.programStageId,
      eventDate: e,
    };
   let datas ={
    orgUnitId: payload.orgUnitId ,
    programStageId: payload.programStageId,
    programsId: payload.programsId,
    eventDate: e,
    }

    localStorage.setItem("payload", JSON.stringify(datas));
    dispatch(setPayload(data));
  };

  const onError = error => console.error(error);

  return (<>
       {loading ? 
       <div>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <div className="sidebars">
                <Paper>
                  <OrgUnitTree onSelect={onSelect} onError={onError} />
                </Paper>
              </div>
            </Grid>
            <Grid item xs={7} elevation={6}>
              <Card>
                <CardContent>
                  <Grid container>
                    <Grid item xs={3}>
                      Organisation Unit :
                    </Grid>
                    <Grid item xs={9}>
                      <input type="text" className="form-control" placeholder="Organisation Unit loading..." value={OrgUnit || ""} />
                      <br />
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={3}>
                      Program :
                    </Grid>
                    <Grid item xs={9}>
                      <select className="form-control" id="programId" onChange={e => onSelectProgram(e)}>
                        <option selected hidden>
                          Please Select Program
                        </option>
                        {programs.map(program => <option value={program.id}>{program.name}</option>)}
                      </select>
                      <br />
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={3}>
                      Program Stage :
                    </Grid>
                    <Grid item xs={9}>
                      <select  defaultValue="Please Select Program Stage" className="form-control" onChange={e => selectedProgramStage(e)}>
                        <option selected hidden>
                          Please Select Program Stage
                        </option>
                        {programStages.map(programStage => <option value={programStage.id}>
                            {programStage.displayName}
                          </option>)}
                      </select>
                      <br />
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={3}>
                      Event Date :
                    </Grid>
                    <Grid item xs={9}>
                      <DatePicker selected={startDate} onChange={date => onSelectDate(date)} className="form-control" />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
           <Sections />
          </Grid>
          </div>
          :
          <div className="loaderPosition">
          <Loader type="Oval" color="#00BFFF" height={150} width={150} />
        </div>}
     </>)
};
