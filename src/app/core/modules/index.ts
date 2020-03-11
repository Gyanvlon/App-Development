import { OrgUnitFilterModule } from '../../shared/modules/org-unit-filter/org-unit-filter.module';
import { PeriodFilterModule } from '../../shared/modules/period-filter/period-filter.module';

export * from '../../shared/modules/org-unit-filter/org-unit-filter.module';
export * from '../../shared/modules/period-filter/period-filter.module';
export const modules: any[] = [OrgUnitFilterModule, PeriodFilterModule];
