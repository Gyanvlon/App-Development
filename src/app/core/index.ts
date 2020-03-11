import { CoreModule } from './core.module';
import { modules } from './modules';

export * from './core.module';
export * from './services';
export * from './utils';
export * from './models';
export * from './modules';

export const coreModules: any[] = [CoreModule, ...modules];
