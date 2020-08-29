import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Grid, Card, Checkbox, CardContent, Table, TableBody, TableRow, TableCell, TableHead } from "@material-ui/core";
import { getTEIAttribute, getTrackedEntityInstances, postingEvent,failureEvent } from '../../redux/action/event';
import { ApiService } from "../../services/apiService";
import Loader from "react-loader-spinner";
import SweetAlert from 'react-bootstrap-sweetalert';
import { useHistory,useParams } from 'react-router-dom'
import $ from "jquery";


export const TEIDetails = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const {params}= useParams()
  var payload = useSelector(state => state.data.payload);
  const [hide, setHide] = useState(true)
  const dataValues = useSelector(state => state.data.dataValue);
  const TEIRender = useSelector(state => state.data.TEIRender);
  const teiAttributes = useSelector(state => state.data.attributes);
  const eventPost = useSelector(state => state.data.eventPost);
  const failEvent = useSelector(state => state.data.failEvent);
  const tranckedEntityInstances = useSelector(state => state.data.tranckedEntityInstances);
  useEffect(() => {
    if (TEIRender) {
        payload = JSON.parse(localStorage.getItem('payload'))
      let pram = {
        program: payload.programsId,
        ou: payload.orgUnitId
      };
      var arr = [];
      var teiAttributes = [];
      var displayTEIAttr = [];
      ApiService.getTrackedEntityInstance(pram).then(response => {
        ApiService.getProgramTEIAttribute(pram.program).then(programAttributeResponse => {
          programAttributeResponse.programTrackedEntityAttributes.forEach(proTEIAttr => {
            if (proTEIAttr.displayInList) {
              displayTEIAttr[proTEIAttr.trackedEntityAttribute.id] = true;
              teiAttributes.push(proTEIAttr.trackedEntityAttribute.displayName);
            }
          });
          dispatch(getTEIAttribute(teiAttributes)); //   console.log("here is tei", response);

          response.trackedEntityInstances.forEach(tei => {
            let obj = [];
            obj["tei"] = tei.trackedEntityInstance;
            obj["checked"] = false;
            tei.attributes.forEach(attr => {
              if (displayTEIAttr[attr.attribute]) {
                obj[attr.displayName] = attr.value;
              }
            });
            arr.push(obj);
          });
          dispatch(getTrackedEntityInstances(arr));
        });
      }, error => {
        console.log(error);
      });
    }
  },[]);

  const onHeadChecked = (e) => {
  //   $("#checkAll").click(function () {
  //     $('input:checkbox').not(this).prop('checked', this.checked);
  // });
  // $(document).ready(function() {
  //   $("#checkedAll").change(function(){
  //     if(this.checked){
  //       $(".checkSingle").each(function(){
  //         this.checked=true;
  //       })              
  //     }else{
  //       $(".checkSingle").each(function(){
  //         this.checked=false;
  //       })              
  //     }
  //   });
  // });
  // var headCheckBox = document.querySelector("#checkbox-head").checked;
  //       let changedTei = tranckedEntityInstances.map(teis => {
  //           teis.checked = headCheckBox;
  //           return teis;
  //       })
  //       var checkBox = document.querySelectorAll("input[type='checkbox']");
  //       checkBox.forEach(box => {
  //           box.checked = headCheckBox;
  //       })
        // this.setState({ tei: changedTei, check: headCheckBox })

  };

  const onSelect = (e, i) => {
    let hide = true;
    tranckedEntityInstances[i].checked = !tranckedEntityInstances[i].checked;
    tranckedEntityInstances.forEach(tei => {
      if(tei.checked == true) hide =  false
    })
    setHide(hide)
    dispatch(getTrackedEntityInstances(tranckedEntityInstances));
  };

  const onSubmit = e => {
     payload=JSON.parse(localStorage.getItem('payload'))
    let selectedTEI = tranckedEntityInstances.filter(tei => tei.checked);
    let dataValue = [];
    for(let dv in dataValues) {
      dataValue.push({dataElement:dv, value:dataValues[dv]})
    }
      selectedTEI.forEach( ele => {
        let tei = ele.tei;
        var event = {
            trackedEntityInstance: tei,
            orgUnit: payload.orgUnitId,
            programStage : payload.programStageId,
            program : payload.programsId,
            eventDate: payload.eventDate,
            status : "ACTIVE",
            dataValues: dataValue
            };
           console.log("here is pay load", event)
            ApiService.postEvent(event).then(result => {
            if(result.httpStatus == 'OK'){
              dispatch(postingEvent())
            }
            if(result.httpStatusCode == "409"){
              dispatch(failureEvent())
            }
        }, error => {
          dispatch(failureEvent())
        });
    }) 
  };
  const onConfirm =  () => {
    console.log(params)
    // window.location.reload(false)
    history.goBack()
  }
 
  return <>  
      <Grid elevation={6}>
        <Card item xs={11}> {tranckedEntityInstances.length > 0 ? <CardContent>
        <Table>
          <TableHead>
            <TableRow>
            <TableCell>S.N.</TableCell>
            {teiAttributes.map(header => <TableCell>{header}</TableCell>)}
            <TableCell> 
               {/* <Checkbox type="checkbox" name="check" color="primary" className="checkBox" onChange={e =>onHeadChecked(e, document.table.check)} /> */}
               {/* <input type="checkbox" name="check" color="primary" id="checkAll" onChange={e =>onHeadChecked(e)} /> */}
               {/* <input type="checkbox" id="checkedAll" onClick={e =>onHeadChecked(e)} />  */}
             </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tranckedEntityInstances.map((ele, index) => <TableRow>
              <TableCell>{index + 1}</TableCell>
              {teiAttributes.map(teiAttrName => <TableCell>{ele[teiAttrName]} </TableCell>)}
                <TableCell>
                <Checkbox type="checkbox" name="check" color="primary"  onChange={e => onSelect(e, index)} />
                {/* <input type="checkbox" className="checkSingle" onClick={e => onSelect(e, index)} />  */}
                </TableCell>
              </TableRow>)}
          </TableBody>
        </Table><br />
       <Button type="submit"  variant="contained"  raised disabled={hide} color="primary" onClick={e => onSubmit(e)}>Submit</Button> 
      </CardContent> :
       <div>
       <div className="loaderPosition">
       <Loader type="Oval" color="#00BFFF" height={150} width={150} />
       </div>
       {tranckedEntityInstances.length ? 
        <CardContent>
        <h3>Tracked Entity Instance not available</h3>
        </CardContent> :
        ""
       }
     
      </div> 
     }   
      </Card>
      </Grid>
     {eventPost ? 
     <SweetAlert
     success
     title="OK"
     onConfirm={onConfirm}
     >
     Event Push Success
   </SweetAlert>
   : ''}
   {failEvent ?
   <SweetAlert
   warning
   confirmBtnBsStyle="danger"
   onConfirm={onConfirm}
 >
  Already Event available 
 </SweetAlert>
 :
 " "
   }
    </>;
};