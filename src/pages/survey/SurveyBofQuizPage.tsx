import axios from 'axios';
import dayjs from 'dayjs';
import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { API_URL } from '../../core/constants/base.const';
import Score15Page from './bof/quiz/Score15Screen';
import OrsAndSatisfactionScalePage from './bof/quiz/OrsAndSatisfactionScaleScreen';
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

export default function SurveyBofQuizPage() {
  const { t } = useTranslation();

  const hashedCode = useParams().hashedCode;
  const [scoreEntity, setScoreEntity] = useState<ScoreEntity>();
  const [showScore15Page, setShowScore15Page] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [hasError, setHasError] = useState(false);

  // static title & descriptions
  const score15Data = [
    t('Score15-1'),
    t('Score15-2'),
    t('Score15-3'),
    t('Score15-4'),
    t('Score15-5'),
    t('Score15-6'),
    t('Score15-7'),
    t('Score15-8'),
    t('Score15-9'),
    t('Score15-10'),
    t('Score15-11'),
    t('Score15-12'),
    t('Score15-13'),
    t('Score15-14'),
    t('Score15-15'),
  ];
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

  const [orsAndSatisfactionScaleAnswers, setOrsAndSatisfactionScaleAnswers] =
    useState<Array<number>>([
      ...Array.from({ length: orsData?.length }, (_, i) => 0),
    ]);
  const [score15Answers, setScore15Answers] = useState<Array<number>>([
    ...Array.from({ length: score15Data?.length }, (_, i) => 0),
  ]);
  const [activeScore15QuestionnaireIndex, setActiveScore15QuestionnaireIndex] =
    useState(0);

  const toNumberArray = useCallback(
    (values: string[] | undefined, isScore15: boolean) => {
      if (isScore15) {
        return values
          ? values.map((value) => +value)
          : [...Array.from({ length: score15Data?.length }, (_, i) => 1)];
      } else {
        return values
          ? values.map((value) => +value)
          : [...Array.from({ length: orsData?.length }, (_, i) => 0)];
      }
    },
    []
  );

  useEffect(() => {
    try {
      const decoded = JSON.parse(atob(atob(atob(hashedCode || ''))));
      console.log('decoded', decoded);
      setScoreEntity(decoded);
      axios
        .get(
          `${API_URL}/score/getOne/${decoded.codeNumber}/${decoded.person}/${decoded.occasion}`
        )
        .then((response) => response.data)
        .then((data) => {
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

  const handleSubmit = () => {
    const partA: number =
      score15Answers[0] +
      score15Answers[2] +
      score15Answers[5] +
      score15Answers[9] +
      score15Answers[14];
    const partB: number =
      score15Answers[1] +
      score15Answers[3] +
      score15Answers[4] +
      score15Answers[6] +
      score15Answers[7] +
      score15Answers[8] +
      score15Answers[10] +
      score15Answers[11] +
      score15Answers[12] +
      score15Answers[13];
    let score15: number = 60 + (partA - partB);
    let ors: number = 0;
    orsAndSatisfactionScaleAnswers?.map((orsAndSatisfactionScale) => {
      ors += getSurveyEmojiPercentage(orsAndSatisfactionScale);
    });
    console.log(
      'data',
      ors / 3,
      score15 / 15,
      score15Answers,
      orsAndSatisfactionScaleAnswers
    );
    axios
      .post(`${API_URL}/score/create`, {
        ...scoreEntity,
        ors: ors / 3,
        score15: score15 / 15,
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

  const updateScore15 = (newVal: number) => {
    if (scoreEntity) {
      setScoreEntity({
        ...scoreEntity,
        score15: newVal,
      });
    }
  };

  if (scoreEntity?.codeNumber && scoreEntity?.occasion && scoreEntity?.person) {
    if (submitted) {
      return <div>{t('Message.SubmitSuccess')}</div>;
    } else if (hasError) {
      return <div>{t('Message.Error')}</div>;
    } else if (showScore15Page) {
      return (
        <Suspense fallback='Loading...'>
          <Score15Page
            score15Data={score15Data}
            activeScore15QuestionnaireIndex={activeScore15QuestionnaireIndex}
            setActiveScore15QuestionnaireIndex={
              setActiveScore15QuestionnaireIndex
            }
            score15Answers={score15Answers}
            setScore15Answers={setScore15Answers}
            setScore15={updateScore15}
            setShowScore15Page={setShowScore15Page}
          />
        </Suspense>
      );
    } else {
      return (
        <Suspense fallback='Loading...'>
          <OrsAndSatisfactionScalePage
            orsData={orsData}
            orsAndSatisfactionScaleAnswers={orsAndSatisfactionScaleAnswers}
            setOrsAndSatisfactionScaleAnswers={
              setOrsAndSatisfactionScaleAnswers
            }
            setShowScore15Page={setShowScore15Page}
            onSubmit={handleSubmit}
          />
        </Suspense>
      );
    }
  }
  return <div>Loading...</div>;
}
