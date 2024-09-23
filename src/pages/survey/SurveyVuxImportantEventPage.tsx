import React from 'react';
import { useAppDispatch } from '../../core/hooks/rtkHooks';
import { loadImportantEventsVuxBasicData } from '../../core/store/slices/importantEventsVuxSlice';
import SurveyVuxImportantEventScreen from './vux/imp/SurveyVuxImportantEventScreen';

export default function SurveyVuxImportantEventPage() {
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(loadImportantEventsVuxBasicData());
  }, []);

  return <SurveyVuxImportantEventScreen />;
}
