import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ApiService } from "../../services/apiService";
import { LoadMetaData} from "../../redux/action/event";

 export const MetaData = () => {
  const dispatch = useDispatch();
  const metaDataLoading = useSelector(state => state.data.metaDataLoading)
useEffect(() => {
  if(metaDataLoading){
    ApiService.getMetaData().then(res => {
      if (res.programs.length) {
        res.programs.forEach(program => {
          // if(program.attributeValues.length){
          //   let attribute = []
          //   program.attributeValues.forEach( attr => {
          //    attribute[attr.attribute.id]=Boolean(attr.value);
          //   })
          //   program.attributeValues = attribute; 
          // }
          if (program.programStages.length) {
            program.programStages.forEach(programStage => {
              // if(programStage.attributeValues.length){
              //   let attribute = []
              //   programStage.attributeValues.forEach( attr => {
              //    attribute[attr.attribute.id]=Boolean(attr.value);
              //   })
              //   programStage.attributeValues = attribute; 
              // }
              let programStageDataElements = [];
              let dataElementIndex = [];
              let eventValues = [];
              programStage.programStageDataElements.forEach(psde => {
                eventValues[psde["dataElement"]["id"]] = "";
                programStageDataElements[psde["dataElement"]["id"]] = psde["compulsory"].toString();
              });
              programStage["eventValues"] = eventValues;
              programStage.programStageSections.forEach((programStageSection, index) => {
                let programSectionDataElements = [];
                programStageSection.dataElements.forEach(de => {
                  if (programStageDataElements[de.id]) {
                    de["required"] = programStageDataElements[de.id] == "false" ? false : true;
                  }
  
                  de["hide"] = false;
                  programSectionDataElements[de.id] = de;
                  dataElementIndex[de.id] = index;
                });
                programStageSection.dataElements = programSectionDataElements;
                programStageSection.hide = false;
                dataElementIndex[programStageSection.id] = index;
              });
              programStage.programStageSections["dataElementIndex"] = dataElementIndex;
            });
          }
        });
  
        const programCondition = c => {
          const original = c;
          try {
            const variableDuplicated = c.match(/#\{.*?\}/g);
            const variables = [];
            if (!variableDuplicated) return c;
            variableDuplicated.forEach(duplicated => {
              if (variables.indexOf(duplicated) === -1) variables.push(duplicated);
            });
            variables.forEach(variable => {
              const name = variable.substring(2, variable.length - 1);
              const id = res.programRuleVariables.find(ruleVariable => ruleVariable.name === name).dataElement.id;
              c = c.replace(new RegExp("#{" + name + "}", "g"), "values['" + id + "']");
            });
          } catch (e) {
            console.warn("Improper condition:", original);
          }
          return c;
        };
  
        res.programRules.forEach(programRule => {
          programRule.condition = programCondition(programRule.condition);
        });
      }
      dispatch(LoadMetaData(res));
   });
  }
}, [metaDataLoading])
  return (
    <>
    </>
  );
};
