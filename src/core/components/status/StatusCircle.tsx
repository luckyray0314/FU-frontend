import React from 'react';
import { SurveyStatus } from '../../model/status.model';

interface Props {
  status: string;
  variant: 'large' | 'medium' | 'small';
}

const getStatus = (status: string) => {
  switch (status) {
    case SurveyStatus.Clear:
      return '#00FF00';
    case SurveyStatus.Coming:
      return '#FFE500';
    case SurveyStatus.Loss:
      return '#FF0000';
    case SurveyStatus.NoBackgroundData:
      return '#2986cc';
    case SurveyStatus.Archived:
      return '#999999';
    case SurveyStatus.Cancelled:
      return '#7e10e1';
    case SurveyStatus.Incomplete:
      return '#3e90e8';
  }
};

export default function StatusCircle(props: Props) {
  const size = {
    large: 16,
    medium: 13,
    small: 10,
  };
  const backgroundColor = {
    [SurveyStatus.Clear]: '#00FF00',
    [SurveyStatus.Coming]: '#FFE500',
    [SurveyStatus.Loss]: '#FF0000',
    [SurveyStatus.NoBackgroundData]: '#2986cc',
    [SurveyStatus.Archived]: '#999999',
    [SurveyStatus.Cancelled]: '#7e10e1',
    [SurveyStatus.Incomplete]: '#3e90e8',
  };

  return (
    <div
      style={{
        width: `${size[props.variant]}px`,
        height: `${size[props.variant]}px`,
        backgroundColor: getStatus(props.status),
        backgroundSize: 'cover',
        borderRadius: '100%',
      }}
    />
  );
}
