import React from 'react';
import { useAppDispatch } from '../../core/hooks/rtkHooks';
import SurveyBofImportantEventScreen from './bof/imp/SurveyBofImportantEventScreen';
import { loadImportantEventsBasicData } from '../../core/store/slices/importantEventsSlice';

export default function SurveyBofImportantEventPage() {
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(loadImportantEventsBasicData());
  }, []);

  return <SurveyBofImportantEventScreen />;
}
