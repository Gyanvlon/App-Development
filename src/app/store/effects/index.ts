import { CurrentUserEffects } from './current-user.effects';
import { RouterEffects } from './router.effects';
import { EventEffects } from './event.effects';
import { AttributesEffects } from './attributes.effects';
import { OrganisationUnitEffects } from './organanisation-unit.effects';
import { DistributionPointEffects } from './distribution-point.effect';
import { ProgramEffects } from './program.effect';
import { DashboardEffects } from './dashboard.effects';
import { VisualizationEffects } from './visualization.effects';
import { GlobalFilterEffects } from './global-filter.effects';

export const effects: any[] = [
  CurrentUserEffects,
  RouterEffects,
  EventEffects,
  AttributesEffects,
  OrganisationUnitEffects,
  DistributionPointEffects,
  ProgramEffects,
  DashboardEffects,
  VisualizationEffects,
  GlobalFilterEffects
];

export * from './current-user.effects';
export * from './router.effects';
export * from './event.effects';
export * from './attributes.effects';
export * from './organanisation-unit.effects';
export * from './distribution-point.effect';
export * from './program.effect';
