export type BasicDataUnit = {
  id: number;
  description: string;
};

export type ImportantEventsVuxBasicData = {
  changeLiveEntities: BasicDataUnit[];
  changeOverEntities: BasicDataUnit[];
  investigationOutEntities: BasicDataUnit[];
  otherInitiativeEntities: BasicDataUnit[];
};

export type FormDataByEntityName = {
  [entityName: string]: Array<number | string>;
};

export type FormDataMap = {
  [entityName: string]: {
    [idString: string]: boolean | string;
  };
};

export type ImportantEventsVuxData = {
  codeNumber: string;
  formDataByEntityName: FormDataByEntityName;
};

export type ImportantEventsVuxFormMetadata = {
  label: string;
  entityName: string;
  entitiesData: BasicDataUnit[];
}[]