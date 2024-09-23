export type BasicDataUnit = {
  id: number;
  description: string;
};

export type BackgroundAdultSurveyBasicData = {
  genderAdultEntities: BasicDataUnit[];
  actionAssignmentEntities: BasicDataUnit[];
  duringOperationEntities: BasicDataUnit[];
  educationLevelEntities: BasicDataUnit[];
  employmentEntities: BasicDataUnit[];
  establishDiagnoseEntities: BasicDataUnit[];
  familyConstellationAdultEntities: BasicDataUnit[];
  otherOngoingEffortEntities: BasicDataUnit[];
  previousEffortEntities: BasicDataUnit[];
  problemAreaAdultEntities: BasicDataUnit[];
};

export type FormDataByEntityName = {
  [entityName: string]: Array<number | string>;
};

export type FormDataMap = {
  [entityName: string]: {
    [idString: string]: boolean | string;
  };
};

export type BackgroundAdultMetadata = {
  codeNumber: string;
  date: string;
  yearOfBirth: number;
}

export type BackgroundAdultData = {
  codeNumber: string;
  date: string;
  yearOfBirth: number;
  country: string | null;
  formDataByEntityName: FormDataByEntityName;
};

export type BackgroundAdultSurveyFormMetadata = {
  label: string;
  entityName: string;
  entitiesData: BasicDataUnit[];
}[]