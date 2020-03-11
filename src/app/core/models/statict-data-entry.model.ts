export interface OrganisationUnitModel {
  id: string;
  name: string;
  code?: string;
  attributeValues?: Array<AttributeValuesModel>;
  coordinates: Array<string>;
  parent?: any;
  children?: any;
  openingDate?: any;
}

export interface AttributeValuesModel {
  value: string;
  attribute: AttributeModel;
}

export interface AttributeModel {
  id: string;
  name: string;
  mandatory: boolean;
  valueType: string;
  optionSet: Array<OptionsModel>;
}

export interface OptionsModel {
  id: string;
  name: string;
  code: string;
}
