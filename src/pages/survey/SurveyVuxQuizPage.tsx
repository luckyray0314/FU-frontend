import axios from 'axios';
import dayjs from 'dayjs';
import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { API_URL } from '../../core/constants/base.const';
import VASScalePage from './vux/quiz/VASScalePage';
import OrsAndSatisfactionScalePage from './vux/quiz/OrsAndSatisfactionScalePage';
import { useParams } from 'react-router-dom';
import { getSurveyEmojiPercentage } from '../../core/functions/surveyEmojiValue.function';

type ScoreEntity = {
  codeNumber: string;
  person: 1 | 2 | 3;
  occasion: 1 | 2 | 3;
  date: string;
  score15: number;
  ors: number;
};

export default function SurveyVuxQuizPage() {
  const { t } = useTranslation();
  const hashedCode = useParams().hashedCode;
  const [scoreEntity, setScoreEntity] = useState<ScoreEntity>();
  const [showScore15Page, setShowScore15Page] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [hasError, setHasError] = useState(false);

  // static title & descriptions
  const orsData = [
    {
      title: t('ORS.Feeling1'),
      description: t('ORS.Individual'),
    },
    {
      title: t('ORS.Feeling2'),
      description: t('ORS.CloseRelationships'),
    },
    {
      title: t('ORS.Feeling3'),
      description: t('ORS.Social'),
    },
  ];
  const satisfactionScaleData = [
    t('TSS.Accommodation'),
    t('TSS.PhysicalHealth'),
    t('TSS.Work'),
    t('TSS.Economy'),
    t('TSS.Alcohol'),
    t('TSS.Drug'),
    t('TSS.Game'),
    t('TSS.LegalIssues'),
    t('TSS.FamilySocialInteraction'),
    t('TSS.FreeTime'),
    t('TSS.PystoneHealth'),
    t('TSS.Communication'),
    t('TSS.GeneralWellBeing'),
  ];
  const [orsAndSatisfactionScaleAnswers, setOrsAndSatisfactionScaleAnswers] =
    useState<Array<number>>([
      ...Array.from({ length: orsData?.length }, (_, i) => 0),
    ]);
  const [score15Answers, setScore15Answers] = useState<Array<number>>([
    ...Array.from({ length: satisfactionScaleData?.length }, (_, i) => 1),
  ]);

  const nextSatisfation = () => {
    setShowScore15Page(false);
  };

  useEffect(() => {
    try {
      const decoded = JSON.parse(atob(atob(atob(hashedCode || ''))));
      console.log('decoded', decoded);
      setScoreEntity(decoded);
      axios
        .get(
          `${API_URL}/adult-score/getOne/${decoded.codeNumber}/${decoded.person}/${decoded.occasion}`
        )
        .then((response) => response?.data)
        .then((data: any) => {
          if (data) {
            setScore15Answers(toNumberArray(data?.score15Answers, true));
            setOrsAndSatisfactionScaleAnswers(
              toNumberArray(data?.orsAndSatisfactionScaleAnswers, false)
            );
          }
        })
        .catch((err) => {
          console.log(err);
          setHasError(true);
        });
    } catch (e) {
      console.log(e);
      setHasError(true);
    }
  }, [hashedCode]);

  const toNumberArray = useCallback(
    (values: string[] | undefined, isScore15: boolean) => {
      if (isScore15) {
        return values
          ? values.map((value) => +value)
          : [
              ...Array.from(
                { length: satisfactionScaleData?.length },
                (_, i) => 1
              ),
            ];
      } else {
        return values
          ? values.map((value) => +value)
          : [...Array.from({ length: orsData?.length }, (_, i) => 0)];
      }
    },
    []
  );

  const handleSubmit = () => {
    let score15: number = 0;
    score15Answers?.map((score) => {
      score15 += score;
    });
    let ors: number = 0;
    orsAndSatisfactionScaleAnswers?.map((orsAndSatisfactionScale) => {
      ors += getSurveyEmojiPercentage(orsAndSatisfactionScale);
    });
    console.log(
      'data',
      ors / 3,
      score15,
      score15Answers,
      orsAndSatisfactionScaleAnswers
    );
    axios
      .post(`${API_URL}/adult-score/create`, {
        ...scoreEntity,
        ors: ors / 3,
        score15,
        score15Answers,
        orsAndSatisfactionScaleAnswers,
        date: dayjs().format('YYYY-MM-DD'),
      })
      .then((res) => {
        console.log(res);
        setSubmitted(true);
      })
      .catch((err) => {
        console.log(err);
        setHasError(true);
      });
  };

  if (scoreEntity?.codeNumber && scoreEntity?.occasion && scoreEntity?.person) {
    if (submitted) {
      return <div>{t('Message.SubmitSuccess')}</div>;
    } else if (hasError) {
      return <div>{t('Message.Error')}</div>;
    } else if (showScore15Page) {
      return (
        <Suspense fallback='Loading...'>
          <VASScalePage
            orsData={orsData}
            orsAndSatisfactionScaleAnswers={orsAndSatisfactionScaleAnswers}
            setOrsAndSatisfactionScaleAnswers={
              setOrsAndSatisfactionScaleAnswers
            }
            onNextSatisfaction={nextSatisfation}
          />
        </Suspense>
      );
    } else {
      return (
        <Suspense fallback='Loading...'>
          <OrsAndSatisfactionScalePage
            satisfactionScaleData={satisfactionScaleData}
            score15Answers={score15Answers}
            setScore15Answers={setScore15Answers}
            setShowScore15Page={setShowScore15Page}
            onSubmit={handleSubmit}
          />
        </Suspense>
      );
    }
  }
  return <div>Loading...</div>;
}
