import { BasicDataUnit, FormDataByEntityName } from "./backgroundData.model";

export type FollowUpSurveyBasicData = {
  interventionPeriodEntities: BasicDataUnit[];
  interventionProgressEntities: BasicDataUnit[];
  reasonForTerminationEntities: BasicDataUnit[];
  timeConsumptionEntities: BasicDataUnit[];
};

export type FollowUpMetadata = {
  codeNumber: string;
  date: string;
}

export type FollowUpData = {
  codeNumber: string;
  date: string;
  formDataByEntityName: FormDataByEntityName;
};

export type FollowUpSurveyFormMetadata = {
  label: string;
  entityName: string;
  entitiesData: BasicDataUnit[];
}[]