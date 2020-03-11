import { ChartModule } from './chart/chart.module';
import { TableModule } from './table/table.module';
import { MapModule } from './map/map.module';
import { FeedbackMessageModule } from './feedback-message/feedback-message.module';
import { InterpretationModule } from './interpretation/interpretation.module';
import { ListTableModule } from './list-table/list-table.module';
import { ReportsModule } from './reports/reports.module';
import { ResourcesModule } from './resources/resources.module';
import { UsersModule } from './users/users.module';
import { SharingFilterModule } from './sharing-filter/sharing-filter.module';

export const modules: any[] = [
  ChartModule, TableModule, MapModule, FeedbackMessageModule, InterpretationModule, ListTableModule,
  ReportsModule, ResourcesModule, UsersModule, SharingFilterModule
];
