export type BasicDataUnit = {
  id: number;
  description: string;
};

export type ImportantEventsBasicData = {
  otherInterventionsStartedEntities: BasicDataUnit[];
  duringInterventionEntities: BasicDataUnit[];
  duringPastEntities: BasicDataUnit[];
  childSchoolEntities: BasicDataUnit[];
  changeAccomodationEntities: BasicDataUnit[];
  changeEmploymentVh1Entities: BasicDataUnit[];
  changeEmploymentVh2Entities: BasicDataUnit[];
};

export type FormDataByEntityName = {
  [entityName: string]: Array<number | string>;
};

export type FormDataMap = {
  [entityName: string]: {
    [idString: string]: boolean | string;
  };
};

export type ImportantEventsData = {
  codeNumber: string;
  formDataByEntityName: FormDataByEntityName;
};

export type ImportantEventsFormMetadata = {
  label: string;
  entityName: string;
  entitiesData: BasicDataUnit[];
}[]