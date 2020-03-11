import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, NavigationStart } from "@angular/router";
import { OrderByPipe } from "../../pipes/order-by.pipe";
import { Observable } from "rxjs/Observable";
import { ChangeService } from "../../providers/change.service";
import { UserService } from "../../providers/user.service";
import { HttpClientService } from "../../../../core/services/http-client.service";
import { GlobalFilter } from "../../../../core/models/global-filter.model";
import { getCurrentGlobalFilter } from "../../../../store/selectors/global-filter.selectors";
import { AppState } from "../../../../store";
import { Store } from "@ngrx/store";
import { OrgUnitService } from "../../../../shared/modules/org-unit-filter/org-unit.service";
import { GlobalFilterUpdateAction } from "../../../../store/actions/global-filter.actions";
import { getPopulationDataForCurrentOrgUnit } from "../../../../store/selectors/";
import { Compiler } from '@angular/core';
import { from } from 'rxjs';

declare var $: any;
declare var document: any;

@Component({
  selector: "app-sub-organisation-units",
  templateUrl: "./sub-organisation-units.component.html",
  styleUrls: ["./sub-organisation-units.component.css"]
})
export class SubOrganisationUnitsComponent implements OnInit {
  private organisationUnit;
  public Percantage: any;
  public childCount: any;
  public children: any;
  loading = true;
  loadingError;
  id;
  rowsLength: any;
  orgUnitMaxLevel: any;
  tempTotalWaterPoint: any;
  waterPointId;
  pager: any = {
    page: 1,
    pageSize: 10
  };
  pageSize = 10;
  selectedOrder = "name";
  searchText = "";
  totalWaterPoints;
  monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  date: Date;
  statusPeriod;
  globalFilter$: Observable<GlobalFilter>;
  globalFilter: GlobalFilter;
  info;
  population$: Observable<number>;
  constructor(
    private http: HttpClientService,
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router,
    private changeService: ChangeService,
    private userService: UserService,
    private orgUnitService: OrgUnitService,
    private compiler: Compiler
  ) {
    this.globalFilter$ = store.select(getCurrentGlobalFilter);
    this.population$ = store.select(getPopulationDataForCurrentOrgUnit);
    this.getInfo();
    console.log('here is data of getinfo',this.getInfo);
    setTimeout(this.getInfo, 8000);
   this.compiler.clearCache();
  }

  getInfo() {
    if (this.http) {
      this.http.get("system/info.json").subscribe(info => {
        this.info = new Date(info.lastAnalyticsTableSuccess);
      });
    }
  }

  selectedWaterPoint;
  loadWaterPoint = false;

  openWaterPoint(selectedOrganisationUnit) {
    this.deletedOrgUnit = undefined;
    if (!this.readonly) {
      let id = "new";
      if (selectedOrganisationUnit) {
        id = selectedOrganisationUnit;
      }
      let relative = ""; // '../../';
      if (this.router.url.indexOf("waterPoint") > -1) {
        relative = "../../";
      }
      if (this.router.url.indexOf("level") > -1) {
        this.router.navigate(
          [relative + "../../level", this.level, "waterPoint", id],
          {
            relativeTo: this.route
          }
        );
      } else {
        this.router.navigate([relative + "waterPoint", id], {
          relativeTo: this.route
        });
      }
      this.loadWaterPoint = true;
      this.selectedWaterPoint = id;
      setTimeout(() => {
        this.loadWaterPoint = false;
      });
    }
  }

  cancelDitributionPoint(data) {
    this.selectedWaterPoint = undefined;
    this.router.navigate(["../../"], {
      relativeTo: this.route
    });
  }

  completed(completeness) {
    if (completeness) {
      this.organisationUnit.children.forEach(child => {
        if (child.id === completeness.orgUnit) {
          if (completeness.completed) {
            child.completeness = 100;
          } else {
            child.completeness = 0;
          }
        }
      });
    }
  }

  codeError;

  open(orgUnit) {
    this.deletedOrgUnit = undefined;
    this.selectedWaterPoint = undefined;
    if (orgUnit.code) {
      const relative = "";
      this.codeError = undefined;
      const results = {
        items: [
          {
            id: orgUnit.id,
            name: orgUnit.name
          }
        ],
        name: "ou",
        value: orgUnit.id
      };
      this.store.dispatch(new GlobalFilterUpdateAction(results));
      if (this.router.url.indexOf("waterPoint") > -1) {
        this.router.navigate(["../../../../orgUnit", orgUnit.id], {
          relativeTo: this.route
        });
      } else {
        this.router.navigate([relative + "../../orgUnit", orgUnit.id], {
          relativeTo: this.route
        });
      }
    } else {
      this.codeError = { ou: orgUnit };
    }
  }

  addOrganisationUnit(orgUnit) {
    this.totalWaterPoints++;
    this.pager.total++;
    const newOrgUnit: any = {};

    Object.keys(orgUnit).forEach(key => {
      newOrgUnit[key] = orgUnit[key];
    });
    if (this.pager.page) {
      newOrgUnit.status = "loaded";
    }
    newOrgUnit.completeness = 0;

    if (!this.organisationUnit.children) {
      this.organisationUnit.children = [];
    }
    this.organisationUnit.children.splice(0, 1);
    this.organisationUnit.children.push(newOrgUnit);
    this.openWaterPoint(newOrgUnit.id);
  }

  updateOrganisationUnit(uporgUnit) {
    if (!this.organisationUnit.children) {
      this.organisationUnit.children = [];
    }
    this.organisationUnit.children.forEach(orgUnit => {
      if (orgUnit.id === uporgUnit.id) {
        Object.keys(uporgUnit).forEach(key => {
          orgUnit[key] = uporgUnit[key];
        });
      }
    });
    const order = new OrderByPipe();
    this.organisationUnit.children = order.transform(
      this.organisationUnit.children,
      this.selectedOrder
    );
  }

  deletedOrgUnit;

  removeOrganisationUnit(orgUnitid) {
    if (!this.organisationUnit.children) {
      this.organisationUnit.children = [];
    }
    const newChildren = [];
    this.organisationUnit.children.forEach(orgUnit => {
      if (orgUnit.id !== orgUnitid) {
        newChildren.push(orgUnit);
      } else {
        this.deletedOrgUnit = orgUnit;
      }
    });
    this.organisationUnit.children = newChildren;
    const order = new OrderByPipe();
    this.organisationUnit.children = order.transform(
      this.organisationUnit.children,
      this.selectedOrder
    );
  }

  addOrUpdateDitributionPoint(data) {
    if (data.isNew) {
      this.addOrganisationUnit(data.distributionPoint);
    } else {
      this.updateOrganisationUnit(data.distributionPoint);
    }
  }
  deleteDitributionPoint(data) {
    this.selectedWaterPoint = undefined;
    this.removeOrganisationUnit(data.id);
  }
  waterPointParentLevel;
  pageClustering;
  level;
  setLevel;
  nextLevel;
  currentLevel;
  authorities;
  readonly = true;
  fieldMap = {
    Regions: "Region",
    LGAs: "Council",
    Wards: "Ward",
    Villages: "Village"
  };
  urlAddition;

  init(globalFilter) {
    this.deletedOrgUnit = undefined;
    this.loading = true;
    this.loadingError = false;
    if (globalFilter.ou.id.indexOf("LEVEL") > -1) {
      const split = globalFilter.ou.id.split(";");
      this.id = split[0];
      this.setLevel = parseInt(split[1].replace("LEVEL-", ""), 10);
      this.level = this.setLevel;
    } else if (globalFilter.ou.id.indexOf("OU_GROUP") > -1) {
      const split = globalFilter.ou.id.split(";");
      this.id = split[0];
      this.setLevel = split[1];
      this.level = this.setLevel;
    } else {
      this.id = globalFilter.ou.id;
    }
    this.periodStatus = globalFilter.pe.id;
    this.searchText = "";
    this.readonly = this.router.url.indexOf("download") > -1;
    this.changeService.setListener(this);
    this.userService.getAuthorities().subscribe(authorities => {
      this.authorities = authorities;
    });
    this.waterPointParentLevel = 6;
    let url = "sqlViews/gwSo7Ohajpr/data.json?var=ou:" + this.id;
    if (globalFilter.ou.id.indexOf("GROUP") > -1) {
      let groupId = "";
      globalFilter.ou.id.split(";").forEach(theid => {
        const ids = theid.split("-");
        if (ids[0] === "OU_GROUP") {
          if (groupId === "") {
            groupId = ids[1];
          } else {
            groupId += "-" + ids[1];
          }
        }
      });
      url =
        "sqlViews/niQU7llDQoP/data.json?var=ou:" +
        this.id +
        "&var=oug:" +
        groupId;
    }
    this.http.get(url).subscribe(
      (data: any) => {
        this.totalWaterPoints = data.rows[0][0];
        this.orgUnitService.getOrgunitById(this.id).subscribe((data: any) => {
          this.organisationUnit = data;
          this.userService
            .getRootOrganisationUnits()
            .subscribe((organisationUnits: any) => {
              const newAncestors = [];
              let rootFound = false;
              this.organisationUnit.ancestors.forEach(ancestor => {
                if (rootFound) {
                  newAncestors.push(ancestor);
                } else {
                  organisationUnits.some((organisationUnit: any) => {
                    if (ancestor.id === organisationUnit.id) {
                      newAncestors.push(ancestor);
                      rootFound = true;
                    }
                  });
                }
              });
              this.organisationUnit.ancestors = newAncestors;
            });
          if (!this.level) {
            this.level = this.organisationUnit.level + 1;
          }
          this.orgUnitService
            .getOrgunitLevelsInformation()
            .subscribe((organisationUnitLevelsData: any) => {
              organisationUnitLevelsData.organisationUnitLevels.forEach(
                organisationUnitLevel => {
                  if (
                    organisationUnitLevel.level ===
                    this.organisationUnit.level + 1
                  ) {
                    this.nextLevel = organisationUnitLevel;
                  }
                  if (
                    organisationUnitLevel.level === this.organisationUnit.level
                  ) {
                    if (this.fieldMap[organisationUnitLevel.name]) {
                      this.urlAddition =
                        "?criteria=" +
                        this.fieldMap[organisationUnitLevel.name] +
                        ":" +
                        this.organisationUnit.name;
                    } else {
                      this.urlAddition = "";
                    }
                    let date = new Date();
                    date.setMonth(date.getMonth() - 1);
                    date.setDate(1);
                    if (this.periodStatus) {
                      date = new Date(
                        parseInt(this.periodStatus.substr(0, 4), 10),
                        parseInt(this.periodStatus.substr(4), 10) - 1,
                        1
                      );
                    }
                    this.urlAddition =
                      "?var=ou:" +
                      this.id +
                      "&var=date:" +
                      date.toISOString().substr(0, 10);
                  }
                  if (this.router.url.indexOf("level") > -1) {
                    if (
                      this.router.url
                        .substr(this.router.url.indexOf("level"))
                        .indexOf(organisationUnitLevel.level) > -1
                    ) {
                      this.currentLevel = organisationUnitLevel;
                    }
                  }
                }
              );
            });
          if (this.waterPointParentLevel === this.organisationUnit.level) {
            this.router.navigate(
              [
                "orgUnit",
                this.organisationUnit.parent.id,
                "waterPoint",
                this.organisationUnit.id
              ],
              { relativeTo: this.route }
            );
          } else {
            this.loadOrganisationUnits();
            this.loading = false;
          }
        });
      },
      error => {
        this.loading = false;
        this.loadingError = error;
      }
    );
    // }
  }
  periodStatus;
  changeOrder(field) {
    if (this.selectedOrder.endsWith(field)) {
      if (this.selectedOrder.startsWith("-")) {
        this.selectedOrder = field;
      } else {
        this.selectedOrder = "-" + field;
      }
    } else {
      this.selectedOrder = field;
    }
  } 

  calculateCompletenessStatus() {
    var ouIds = [];
    this.organisationUnit.children.forEach(child => {
      ouIds.push(child.id);
    });
    if (ouIds.length === 0) {
      return;
    }
   
    let orgUnitMaxLevelUrl = "sqlViews/hhbUrZZTUC4/data.json";

    this.http.get(orgUnitMaxLevelUrl).subscribe(data => {
    this.orgUnitMaxLevel = data.rows["0"]["0"];
    });
    const orgUnitChildren =
      this.organisationUnit && this.organisationUnit.children
        ? this.organisationUnit.children
        : [];
    orgUnitChildren.forEach((child: any) => {
      if (this.rowsLength === 0) {
        child.completeness = -1;
        child.status = "loaded";
      }
      let found = false;
      let year = this.periodStatus.substr(0, 4);
      let month = this.periodStatus.substr(4, 6);
      let LastDay = new Date(year, month, 0).getDate();
      let endDate = year.concat("-", month, "-", LastDay);
      let startDate = year.concat("-", month, "-", "01");
      let apiUrl = "sqlViews/yYBVSmcfSTy/data.json?var=startdate:" + startDate;
      apiUrl += "&var=enddate:" + endDate + "&var=orgunit:" + child.id;
        this.http.get(apiUrl).subscribe(responseData => {
          let tot = responseData.rows[0][0];
          console.log('here is tot', tot, 'here is id', child.id);
          let OrgUnitLevel ="sqlViews/au9MSVJOcI1/data.json?var=selOrgUnit:" + child.id;
            this.http.get(OrgUnitLevel).subscribe(levelCount => {
              let currentLevel = levelCount.rows[0][0];
              console.log('here is current level', currentLevel);
              let childUrls = 'organisationUnits/' + child.id +'.json?fields=id&includeDescendants=true&paging=false';
              this.http.get(childUrls).subscribe( childCount => {
                this.childCount =childCount.organisationUnits.length-1;
                 console.log('here is current level child', this.childCount);
                if (this.orgUnitMaxLevel === currentLevel) {
                  this.tempTotalWaterPoint = 1;
                } else {
                  this.tempTotalWaterPoint = this.childCount;
                }
                this.Percantage = (tot / this.tempTotalWaterPoint) * 100;
                if (this.Percantage === 0) {
                  child.completeness = -1;
                  child.status = "loaded";
                } else {
                  child.completeness = parseFloat(this.Percantage);
                  child.status = "loaded";
                }    
              })
             
            });
         
        });
    });
    this.organisationUnit.children.forEach((child: any) => {
      child.completeness = undefined;
      child.status = undefined;
    });
  }
  ngOnInit() {
    this.compiler.clearCache();
    this.globalFilter$.subscribe(globalFilter => {
      this.globalFilter = globalFilter;
      if (globalFilter) {
        if (
          this.id === globalFilter.ou.id &&
          this.periodStatus !== globalFilter.pe.id &&
          !this.loadPaging
        ) {
          this.periodStatus = globalFilter.pe.id;
          this.calculateCompletenessStatus();            
        } else {
          this.level = undefined;
          this.init(globalFilter);
        }
        if (this.router.url.indexOf("waterPoint") > -1) {
          const split = this.router.url.split("/");
          split.forEach((s, index) => {
            if (s === "waterPoint") {
              this.openWaterPoint(split[index + 1]);
            }
          });
        }
      }
    });
  }

  downloadLoad;
  downloadError;

  download() {
    this.downloadLoad = true;
    this.downloadError = false;
    this.ConvertToCSV(this.organisationUnit.children).subscribe(
      results => {
        const a = document.createElement("a");
        a.setAttribute("style", "display:none;");
        document.body.appendChild(a);
        const blob = new Blob([results], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        const date = new Date();
        a.download =
          this.organisationUnit.name +
          " " +
          this.monthNames[parseInt(this.periodStatus.substr(4), 10) - 1] +
          " " +
          parseInt(this.periodStatus.substr(0, 4), 10) +
          "_generated_on_" +
          date.getDate() +
          "/" +
          (date.getMonth() + 1) +
          "/" +
          date.getFullYear() +
          ".csv";
        a.click();
        this.downloadLoad = false;
      },
      error => {
        this.downloadLoad = false;
        this.downloadError = error;
      }
    );
  }

  getISODate(date) {
    let month = date.getMonth() + 1;
    if (month < 10) {
      month = "0" + month;
    }

    let day = date.getDate();
    if (day < 10) {
      day = "0" + day;
    }
    return date.getFullYear() + "-" + month + "-" + day;
  }

  getCSVURL() {
    if (this.periodStatus) {
      const ndate = new Date(
        parseInt(this.periodStatus.substr(0, 4), 10),
        parseInt(this.periodStatus.substr(4), 10) - 1,
        1
      );
      return "?var=ou:" + this.id + "&var=date:" + this.getISODate(ndate);
    } else {
      const date = new Date();
      date.setMonth(date.getMonth() - 1);
      date.setDate(1);
      return "?var=ou:" + this.id + "&var=date:" + this.getISODate(date);
    }
  }
  getGroupCSVURL(id) {
    let groupId = "";
    id.split(";").forEach(theid => {
      const ids = theid.split("-");
      if (ids[0] === "OU_GROUP") {
        if (groupId === "") {
          groupId = ids[1];
        } else {
          groupId += "-" + ids[1];
        }
      }
    });
    if (this.periodStatus) {
      const ndate = new Date(
        parseInt(this.periodStatus.substr(0, 4), 10),
        parseInt(this.periodStatus.substr(4), 10) - 1,
        1
      );
      return (
        "?var=ou:" +
        this.id +
        "&var=date:" +
        this.getISODate(ndate) +
        "&var=oug:" +
        groupId
      );
    } else {
      const date = new Date();
      date.setMonth(date.getMonth() - 1);
      date.setDate(1);
      return (
        "?var=ou:" +
        this.id +
        "&var=date:" +
        this.getISODate(date) +
        "&var=oug:" +
        groupId
      );
    }
  }
  ConvertToCSV(objArray): any {
    return new Observable(observer => {
      let url =
        "organisationUnits.json?paging=false&fields=id,name,code,ancestors[name],attributeValues[value,attribute[id,name]]&filter=path:like:" +
        this.id +
        "&filter=level:eq:" +
        this.level;
      if (this.level.indexOf) {
        if (this.level.indexOf("OU_GROUP-") > -1) {
          url =
            "organisationUnits.json?paging=false&fields=id,name,code,ancestors[name],attributeValues[value,attribute[id,name]]&filter=path:like:" +
            this.id +
            "&filter=organisationUnitGroups.id:eq:" +
            this.level.replace("OU_GROUP-", "");
          this.level = this.organisationUnit.level + 1;
        }
      }
      this.http.get(url).subscribe(
        (data: any) => {
          const array =
            typeof data.organisationUnits !== "object"
              ? JSON.parse(data.organisationUnits)
              : data.organisationUnits;
          let str = "";
          this.http
            .get("organisationUnitLevels.json?fields=name,level")
            .subscribe(
              (organisationUnitLevelsData: any) => {
                const organisationUnitLevelsDataJSON =
                  organisationUnitLevelsData.organisationUnitLevels;
                organisationUnitLevelsDataJSON.sort((a, b) => {
                  if (a.level < b.level) {
                    return -1;
                  }
                  if (a.level > b.level) {
                    return 1;
                  }
                  // a must be equal to b
                  return 0;
                });
                organisationUnitLevelsDataJSON.forEach(
                  organisationUnitLevel => {
                    if (
                      organisationUnitLevel.level !== 1 &&
                      organisationUnitLevel.level <= this.level
                    ) {
                      if (organisationUnitLevel.name.substr(-1) === "s") {
                        str +=
                          organisationUnitLevel.name.substr(
                            0,
                            organisationUnitLevel.name.length - 1
                          ) + " Name,";
                      } else {
                        str += organisationUnitLevel.name + ",";
                      }
                    }
                  }
                );
                str += "Code";
                const headers = [
                  "Project",
                  "Basin",
                  "Year of Construction",
                  "Source",
                  "Technology",
                  "Old Code",
                  "Extraction System",
                  "Village Population",
                  "Distribution Point Management"
                ];
                if (this.level === this.waterPointParentLevel) {
                  str += "," + headers.join(",");
                }
                str += ",Completeness Status";
                const dx = [
                  "sJE2ASymgbu",
                  "DIC1UYnqUf7",
                  "OXHW0r8lrdk",
                  "WteCqFCRv7H",
                  "d8MNkGPyADo",
                  "kMeKnrbm9UV",
                  "yFLFPloToNW"
                ];
                this.http
                  .get(
                    "analytics.json?dimension=dx:" +
                      dx.join(";") +
                      "&filter=pe:" +
                      this.periodStatus +
                      "&dimension=ou:LEVEL-" +
                      this.level +
                      ";" +
                      this.organisationUnit.id +
                      "&displayProperty=NAME&skipMeta=false"
                  )
                  .subscribe(
                    (analyticsData: any) => {
                      const analyticsDataJSON = analyticsData;
                      const orgUnitsObject = {};
                      analyticsDataJSON.rows.forEach(row => {
                        if (!orgUnitsObject[row[1]]) {
                          orgUnitsObject[row[1]] = {};
                        }
                        orgUnitsObject[row[1]][row[0]] = row[2];
                      });
                      dx.forEach(d => {
                        str += "," + analyticsDataJSON.metaData.items[d].name;
                      });
                      str += "\r\n";

                      array.forEach(orgUnit => {
                        let line = "";
                        orgUnit.ancestors.forEach((ancestor, index) => {
                          if (index !== 0) {
                            line += ancestor.name;
                            if (this.setLevel) {
                              if (this.setLevel.indexOf("OU_GROUP") > -1) {
                                line += "/";
                              } else {
                                line += ",";
                              }
                            } else {
                              line += ",";
                            }
                          }
                        });
                        line +=
                          orgUnit.name +
                          "," +
                          (orgUnit.code ? orgUnit.code : "");
                        if (this.level === this.waterPointParentLevel) {
                          headers.forEach(key => {
                            if (key) {
                              line += "," + this.getAttribute(key, orgUnit);
                            }
                          });
                        }
                        // line += ',' + orgUnit.completeness;
                        dx.forEach(d => {
                          if (orgUnitsObject[orgUnit.id]) {
                            if (orgUnitsObject[orgUnit.id][d]) {
                              line += "," + orgUnitsObject[orgUnit.id][d];
                            } else {
                              line += ",";
                            }
                          } else {
                            line += ",";
                          }
                        });
                        str += line + "\r\n";
                      });
                      observer.next(str);
                      observer.complete();
                    },
                    error => {
                      observer.error(error);
                    }
                  );
              },
              error => {
                observer.error(error);
              }
            );
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  getAttribute(name, orgUnit) {
    let value = "";
    orgUnit.attributeValues.forEach(attributeValue => {
      if (attributeValue.attribute.name === name) {
        value = attributeValue.value;
      }
    });
    return value;
  }

  fetchRequest: any;

  search(event) {
    if (this.fetchRequest) {
      this.fetchRequest.unsubscribe();
    }
    this.loadOrganisationUnits();
  }

  loadPaging = true;

  loadOrganisationUnits() {
    let addSearchFilter = "";
    if (this.searchText !== "") {
      addSearchFilter = "&filter=name:ilike:" + this.searchText;
    }
    this.loadPaging = true;
    let url =
      "organisationUnits.json?page=" +
      this.pager.page +
      "&pageSize=" +
      this.pager.pageSize +
      "&fields=id,name,code,attributeValues[value,attribute[id,name]]&filter=path:like:" +
      this.id +
      "&order=name&filter=level:eq:" +
      this.level +
      addSearchFilter;
    if (this.level.indexOf) {
      if (this.level.indexOf("OU_GROUP-") > -1) {
        url =
          "organisationUnits.json?page=" +
          this.pager.page +
          "&pageSize=" +
          this.pager.pageSize +
          "&fields=id,name,code,attributeValues[value,attribute[id,name]]&filter=path:like:" +
          this.id +
          "&order=name&filter=organisationUnitGroups.id:eq:" +
          this.level.replace("OU_GROUP-", "") +
          addSearchFilter;
        this.level = this.organisationUnit.level + 1;
      }
    }
    this.fetchRequest = this.http.get(url).subscribe(
      (data: any) => {
        this.pager.pageCount = data.pager.pageCount;
        this.pager.total = data.pager.total;
        this.organisationUnit.children = data.organisationUnits;
        this.calculateCompletenessStatus();
        const possibleValues = [10, 25, 50, 100];
        this.pageClustering = [];
        for (let i = 0; i < possibleValues.length; i++) {
          this.pageClustering.push({
            name: possibleValues[i],
            value: possibleValues[i]
          });
        }
        this.pageClustering.push({ name: "All", value: this.pager.total });
        this.loadPaging = false;
      },
      error => {
        this.loading = false;
        this.loadingError = error;
      }
    );
  }
  pageChanged(event) {
    this.pager.page = event.page;
    this.loadOrganisationUnits();
  }

  setPageSize(size) {
    this.pager.pageSize = size;
    this.loadOrganisationUnits();
  }
}
