export interface Event {
  event: string;
  program: string;
  orgUnit: string;
  eventDate: string;
  status: string;
  storedBy: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  dataValues: DataValues[];
}

export interface DataValues {
  dataElement: string;
  value: string;
}
