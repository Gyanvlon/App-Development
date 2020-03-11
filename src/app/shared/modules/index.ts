

import { OrgUnitFilterModule } from './org-unit-filter/org-unit-filter.module';
import { PeriodFilterModule } from './period-filter/period-filter.module';
import { DataFilterModule } from './data-filter/data-filter.module';
import { LayoutModule } from './layout/layout.module';

export * from './org-unit-filter/org-unit-filter.module';
export * from './period-filter/period-filter.module';
export * from './data-filter/data-filter.module';
export * from './layout/layout.module';
export const modules: any[] = [OrgUnitFilterModule, PeriodFilterModule, DataFilterModule, LayoutModule];
