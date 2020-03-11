import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataEntryRoutingModule } from './data-entry-routing.module';
import { DataEntryComponent } from './containers/data-entry/data-entry.component';
import { StatictDataEntryComponent } from './containers/statict-data-entry/statict-data-entry.component';
import { StatictDataEntryViewComponent } from './components/statict-data-entry-view/statict-data-entry-view.component';
import { StatictDataEntryEditComponent } from './components/statict-data-entry-edit/statict-data-entry-edit.component';
import { ChangeService } from './providers/change.service';
import { UserService } from './providers/user.service';
import { SubOrganisationUnitsComponent } from './containers/sub-organisation-units/sub-organisation-units.component';
import { HomeComponent } from './containers/home/home.component';
import { AttributePipe } from './pipes/attribute.pipe';
import { DataElementFinderPipe } from './pipes/data-element-finder.pipe';
import { OrderByPipe } from './pipes/order-by.pipe';
import { SearchPipe } from './pipes/search.pipe';
import { InputComponent } from './components/input/input.component';
import { FilterOrgUnitAttributesPipe } from './pipes/filter-org-unit-attributes.pipe';
import { ErrorPipe } from './pipes/error.pipe';
import { HideOptionsPipe } from './pipes/hide-options.pipe';
import { SelectComponent } from './components/select/select.component';
import { YearPickerComponent } from './components/year-picker/year-picker.component';
import { CoordinateComponent } from './components/coordinate/coordinate.component';
import { PeriodPickerComponent } from './components/period-picker/period-picker.component';
import { DatasetComponent } from './containers/dataset/dataset.component';
import { WaterPointComponent } from './containers/water-point/water-point.component';
import { KeysPipe } from './pipes/keys.pipe';
import { MessageComponent } from './components/message/message.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MomentModule } from 'ngx-moment';
import {
  OrgUnitFilterModule,
  coreModules,
  PeriodFilterModule
} from '../../core';
import { SelectModule } from 'ng2-select/ng2-select';
import { MyDatePickerModule } from 'mydatepicker';
import {
  TooltipModule,
  CollapseModule,
  ModalModule,
  PaginationModule,
  BsDropdownModule
} from 'ngx-bootstrap/index';
import { Ng2PaginationModule } from 'ng2-pagination';
import { LoaderComponent } from './components/loader/loader.component';
import { FuseSearchPipe } from './pipes/fuse-search.pipe';
import { OrgUnitService } from '../../shared/modules/org-unit-filter/org-unit.service';
import { EventCaptureComponent } from './components/event-capture/event-capture.component';
import { EventContainerComponent } from './containers/event-container/event-container.component';
import { SelectUnorderedComponent } from './components/select-unordered/select-unordered.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CollapseModule,
    MomentModule,
    ModalModule,
    SelectModule,
    DataEntryRoutingModule,
    Ng2PaginationModule,
    OrgUnitFilterModule,
    PeriodFilterModule,
    PaginationModule.forRoot(),
    MyDatePickerModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot()
  ],
  declarations: [
    StatictDataEntryViewComponent,
    StatictDataEntryEditComponent,
    StatictDataEntryComponent,
    LoaderComponent,
    WaterPointComponent,
    DatasetComponent,
    PeriodPickerComponent,
    CoordinateComponent,
    DataEntryComponent,
    SubOrganisationUnitsComponent,
    HomeComponent,
    AttributePipe,
    DataElementFinderPipe,
    KeysPipe,
    OrderByPipe,
    SearchPipe,
    FuseSearchPipe,
    InputComponent,
    FilterOrgUnitAttributesPipe,
    ErrorPipe,
    MessageComponent,
    HideOptionsPipe,
    SelectComponent,
    YearPickerComponent,
    EventCaptureComponent,
    EventContainerComponent,
    SelectUnorderedComponent
  ],
  providers: [ChangeService, UserService, OrgUnitService]
})
export class DataEntryModule {}
