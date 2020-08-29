import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Grid,
  Card,
  CardContent,
  Typography,
} from "@material-ui/core";
import {
  updateEventValues,
  validation,
  getProgramRuleChecking,
} from "../../redux/action/event"; 
import { Element } from "./Elements";
import "./custom.css";

export const DataElement = (props) => {
  const dispatch = useDispatch();
  const dataElements = props.programStageSection.dataElements;
  const programSection = props.programStageSection;
  const programStages = useSelector(
    (state) => state.data.dynamicData.programStages
  );
  const programStageSection = useSelector(
    (state) => state.data.programStageSections
  );
  const hide = useSelector(
    (state) =>
      state.data.programStageSections[
        state.data.programStageSections.dataElementIndex[programSection.id]
      ].hide
  );
  var dataElementObj = Object.assign({}, dataElements);
  var dataElement = [];
  for (let de in dataElementObj) {
    dataElement.push(dataElementObj[de]);
  }
  if (hide) return null;
  return (
    <>
    <div className="cartContent"> 
      <Card elevation={6} item xs={12}>
        <CardContent>
          <Grid>
            <Typography>
              <h4>{programSection.name}</h4>
            </Typography>
          </Grid>
          <Grid container >
           {dataElement.map((element) => (
               <Element element={element} />
            ))}
             </Grid>
        </CardContent>
      </Card>
      </div>
      </>
  );
};
