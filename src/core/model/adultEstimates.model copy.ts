import { SurveyStatus } from "./status.model";

export type PersonIndex = 1;
export type OccasionIndex = 1 | 2 | 3;

export type AdultScoreDto = {
  codeNumber: string;
  person: PersonIndex;
  date: string;
  occasion: OccasionIndex;
  score15: number;
  ors: number;
}

export type AdultEstimatesDto = {
  codeNumber: string; // BoF2023-02...
  status: SurveyStatus;
  missedFields: string;
  history: {
    zeroMonth: {
      date: Date;
      statusInDetail: {
        child: SurveyStatus;
      };
    },
    sixMonths: {
      date: Date;
      statusInDetail: {
        child: SurveyStatus;
      };
    },
    twelveMonths: {
      date: Date;
      statusInDetail: {
        child: SurveyStatus;
      };
    };
  };
  nextSurvey: string;
};