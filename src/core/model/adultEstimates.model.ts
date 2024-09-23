import { SurveyStatus } from './status.model';

export type PersonIndex = 1;
export type OccasionIndex = 1 | 2 | 3;

export type AdultScoreDto = {
  codeNumber: string;
  person: PersonIndex;
  date: string;
  occasion: OccasionIndex;
  score15: number;
  ors: number;
};

export type AdultEstimatesDto = {
  codeNumber: string; // BoF2023-02...
  status: string;
  missedFields: string;
  processor: string;
  isClosed: string;
  history: {
    zeroMonth: {
      date: Date;
      statusInDetail: {
        adult: SurveyStatus;
      };
    };
    sixMonths: {
      date: Date;
      statusInDetail: {
        adult: SurveyStatus;
      };
    };
    twelveMonths: {
      date: Date;
      statusInDetail: {
        adult: SurveyStatus;
      };
    };
  };
  nextSurvey: string;
};
