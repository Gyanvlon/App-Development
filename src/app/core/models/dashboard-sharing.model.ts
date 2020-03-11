import { SharingEntity } from '../../pages/dashboard/modules/sharing-filter/models/sharing-entity';

export interface DashboardSharing {
  id: string;
  user: {
    id: string;
    name: string;
  };
  sharingEntity: SharingEntity;
}
