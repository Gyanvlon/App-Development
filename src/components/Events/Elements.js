import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Grid,
  Radio,
  RadioGroup,
  Checkbox,
  FormControlLabel,
  Table,
  TableRow,
  TableCell,
} from "@material-ui/core";
import {
  updateEventValues,
  validation,
  getProgramRuleChecking,
} from "../../redux/action/event";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./custom.css";

export const Element = (props) => {
  const dispatch = useDispatch();
  const programStages = useSelector(
    (state) => state.data.dynamicData.programStages
  );
  const programStageSection = useSelector(
    (state) => state.data.programStageSections
  );
  const dataValues = useSelector((state) => state.data.dataValue);
  const programRules = useSelector((state) => state.data.programsRules);
  const Error = useSelector((state) => state.data.Error);
  const errorDataElement = useSelector((state) => state.data.checkingId);
  const payload = useSelector((state) => state.data.payload);
  const element = props.element;
  const values = useSelector((state) => state.data.dataValue[element.id]);
  const hide = useSelector(
    (state) =>
      state.data.programStageSections[
        state.data.programStageSections.dataElementIndex[element.id]
      ].dataElements[element.id].hide
  );
  const onChange = (key, e, valueType) => {
    if (valueType != "DATE") {
      const re = /^[0-9\b]+$/;
      if (
        (valueType === "INTEGER_ZERO_OR_POSITIVE" || valueType === "NUMBER") &&
        !re.test(e.target.value)
      ) {
        dispatch(validation({ id: key, type: true }));
      } else if (
        re.test(e.target.value) &&
        valueType != "INTEGER_ZERO_OR_POSITIVE" &&
        valueType != "NUMBER" &&
        valueType == undefined
      ) {
        dispatch(validation({ id: key, type: true }));
      } else dispatch(validation({ id: null, type: false }));
    }
    let value;

    if (valueType != "DATE" && valueType != "TRUE_ONLY") {
      if (e.target.value === "true") {
        value = true;
      } else if (e.target.value === "false") {
        value = false;
      } else {
        value = e.target.value;
      }
    }
    if (valueType == "TRUE_ONLY") {
      value = e.target.checked;
    } else if (valueType == "DATE") {
      value = e;
    }
    dataValues[key] = value;
    dispatch(updateEventValues(dataValues));
    dispatch(
      getProgramRuleChecking(dataValues, programStageSection, programRules)
    );
  };
  if (hide) return null;
  return (
    <Grid spacing={2} item xs={6}>
      {element.optionSetValue && element.valueType === "TEXT" ? (
        <>
          <div className="row">
            <div className="col float-left m-2">
              {element.name}
              {element.required ? (
                <span
                  style={{
                    color: "red",
                  }}
                >
                  {" "}
                  *
                </span>
              ) : (
                ""
              )}
            </div>
            <div className="col m-2">
              <select
                className="form-control"
                id={element.id}
                onChange={(e) => onChange(element.id, e)}
              >
                {element.optionSet.options.map((opt) => (
                  <>
                    <option selected hidden>
                      Please Select Option
                    </option>
                    <option value={opt.code}>{opt.name}</option>
                  </>
                ))}
              </select>
            </div>
          </div>
        </>
      ) : null}
      {element.valueType === "TEXT" && !element.optionSetValue ? (
        <>
          <div className="row">
            <div className="col float-left m-2">
              {element.name}
              {element.required ? (
                <span
                  style={{
                    color: "red",
                  }}
                >
                  *
                </span>
              ) : (
                ""
              )}
            </div>
            <div className="col m-2">
              <input
                type="text"
                id={element.id}
                className="form-control"
                placeholder="Text value only"
                onChange={(e) => onChange(element.id, e)}
              />
              {Error && errorDataElement === element.id ? (
                <span
                  style={{
                    color: "red",
                  }}
                >
                  Please Enter text value Only
                </span>
              ) : (
                ""
              )}
            </div>
          </div>
        </>
      ) : null}
      {element.valueType === "BOOLEAN" ? (
        <>
          <div className="row">
            <div className="col float-left m-2">
              {element.name}
              {element.required ? (
                <span
                  style={{
                    color: "red",
                  }}
                >
                  {" "}
                  *
                </span>
              ) : (
                ""
              )}
            </div>
            <div className="col m-2">
              <RadioGroup row>
                <FormControlLabel
                  control={<Radio color="primary" />}
                  label="Yes"
                  value="true"
                  onChange={(e) => onChange(element.id, e)}
                  id={element.id}
                />
                <FormControlLabel
                  control={<Radio color="primary" />}
                  label="No"
                  value="false"
                  onChange={(e) => onChange(element.id, e)}
                  id={element.id}
                />
              </RadioGroup>
            </div>
          </div>
        </>
      ) : (
        ""
      )}

      {element.valueType === "DATE" ? (
        <>
          <div className="row">
            <div className="col float-left m-2">
              {element.name}
              {element.required ? (
                <span
                  style={{
                    color: "red",
                  }}
                >
                  {" "}
                  *
                </span>
              ) : (
                ""
              )}
            </div>
            <div className="col m-2">
              <DatePicker
                selected={values}
                onChange={(date) =>
                  onChange(element.id, date, element.valueType)
                }
                className="form-control"
              />
            </div>
          </div>
        </>
      ) : (
        ""
      )}
      {element.valueType === "TRUE_ONLY" ? (
        <>
          <div className="row">
            <div className="col float-left m-2">
              {element.name}
              {element.required ? (
                <span
                  style={{
                    color: "red",
                  }}
                >
                  {" "}
                  *
                </span>
              ) : (
                ""
              )}
            </div>
            <div className="col m-2">
              <Checkbox
                color="primary"
                id={element.id}
                onChange={(e) => onChange(element.id, e, element.valueType)}
              />
            </div>
          </div>
        </>
      ) : (
        ""
      )}
      {element.valueType === "NUMBER" ? (
        <>
          <div className="row">
            <div className="col float-left m-2">
              {element.name}
              {element.required ? (
                <span
                  style={{
                    color: "red",
                  }}
                >
                  *
                </span>
              ) : (
                ""
              )}
            </div>
            <div className="col m-2">
              <input
                type="number"
                id={element.id}
                className="form-control"
                placeholder="Number value only"
                onChange={(e) => onChange(element.id, e, element.valueType)}
              />
              {Error && errorDataElement === element.id ? (
                <span
                  style={{
                    color: "red",
                  }}
                >
                  Please Enter number value Only
                </span>
              ) : (
                ""
              )}
            </div>
          </div>
        </>
      ) : (
        ""
      )}
      {element.valueType === "INTEGER_ZERO_OR_POSITIVE" ? (
        <>
          <div className="row">
            <div className="col float-left m-2">
              {element.name}
              {element.required ? (
                <span
                  style={{
                    color: "red",
                  }}
                >
                  *
                </span>
              ) : (
                ""
              )}
            </div>
            <div className="col m-2">
              <input
                type="number"
                id={element.id}
                className="form-control"
                placeholder="Number value only"
                onChange={(e) => onChange(element.id, e, element.valueType)}
              />
              {Error && errorDataElement === element.id ? (
                <span
                  style={{
                    color: "red",
                  }}
                >
                  Please Enter number value Only
                </span>
              ) : (
                ""
              )}
            </div>
          </div>
        </>
      ) : (
        ""
      )}
    </Grid>
  );
};
