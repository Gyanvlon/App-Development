export interface GlobalFilter {
  id: string;
  pe: {name: string, id: string, type: string, year: number};
  ou: {name: string, id: string};
  visitedPages: Array<string>;
}
