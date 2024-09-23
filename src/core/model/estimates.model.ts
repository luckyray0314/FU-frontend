import { SurveyStatus } from './status.model';

export type PersonIndex = 1 | 2 | 3;
export type OccasionIndex = 1 | 2 | 3;

export type ScoreDto = {
  codeNumber: string;
  person: PersonIndex;
  date: string;
  occasion: OccasionIndex;
  score15: number;
  ors: number;
};

export type EstimatesDto = {
  codeNumberForSort?: number;
  codeNumber: string; // BoF2023-02...
  status: SurveyStatus;
  signal: string;
  missedFields: string;
  processor: string;
  isClosed: string;
  history: {
    zeroMonth: {
      date: Date;
      statusInDetail: {
        child: SurveyStatus;
        careGiver1: SurveyStatus;
        careGiver2: SurveyStatus;
      };
    };
    sixMonths: {
      date: Date;
      statusInDetail: {
        child: SurveyStatus;
        careGiver1: SurveyStatus;
        careGiver2: SurveyStatus;
      };
    };
    twelveMonths: {
      date: Date;
      statusInDetail: {
        child: SurveyStatus;
        careGiver1: SurveyStatus;
        careGiver2: SurveyStatus;
      };
    };
  };
  nextSurvey: string;
  closeStatus: string;
};
