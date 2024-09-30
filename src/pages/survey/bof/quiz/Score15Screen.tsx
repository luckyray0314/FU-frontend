import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import SouthIcon from '@mui/icons-material/South';
import {
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
} from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import LinearProgress, {
  linearProgressClasses,
} from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { RatingButton } from '../../../../core/components/button/RatingButton';
import { ButtonPrimary } from '../../../../core/components/button/Button';

interface Props {
  score15Data: string[];
  activeScore15QuestionnaireIndex: number;
  setActiveScore15QuestionnaireIndex: React.Dispatch<
    React.SetStateAction<number>
  >;
  score15Answers: number[];
  setScore15Answers: React.Dispatch<React.SetStateAction<number[]>>;
  setScore15: (val: number) => void;
  setShowScore15Page: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Score15Page({
  score15Data,
  activeScore15QuestionnaireIndex,
  setActiveScore15QuestionnaireIndex,
  score15Answers,
  setScore15Answers,
  setScore15,
  setShowScore15Page,
}: Props) {
  console.log('score15Data', score15Data);
  console.log(
    'activeScore15QuestionnaireIndex',
    activeScore15QuestionnaireIndex
  );
  console.log('score15Answers', score15Answers);
  const { t } = useTranslation();
  const scrollableDivRef = useRef<HTMLDivElement>(null);

  const [disregarded, setDisregarded] = useState<boolean>(false);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    scrollableDivRef.current
      ?.querySelector(
        '#questionnaire-card-' + (activeScore15QuestionnaireIndex + 1)
      )
      ?.scrollIntoView({
        behavior: 'smooth',
      });
  }, [scrollableDivRef, activeScore15QuestionnaireIndex]);

  const handleClickRatingButton = (
    questionnaireIndex: number,
    newValue: number
  ) => {
    const newAnswers = [...score15Answers];
    newAnswers[questionnaireIndex] = newValue;
    setScore15Answers(newAnswers);
  };

  const handleClickNext = () => {
    if (!score15Answers[activeScore15QuestionnaireIndex]) {
      setDisregarded(true);
      return;
    } else {
      setDisregarded(false);
    }

    if (activeScore15QuestionnaireIndex + 1 === score15Data.length) {
      const totalScore =
        60 +
        score15Answers[0] +
        score15Answers[2] +
        score15Answers[5] +
        score15Answers[9] +
        score15Answers[14] -
        score15Answers[1] -
        score15Answers[3] -
        score15Answers[4] -
        score15Answers[6] -
        score15Answers[7] -
        score15Answers[8] -
        score15Answers[10] -
        score15Answers[11] -
        score15Answers[12] -
        score15Answers[13];

      const score15 = totalScore / score15Answers.length;
      setScore15(+score15.toFixed(2));
      setShowScore15Page(false);
      return;
    }
    setActiveScore15QuestionnaireIndex(activeScore15QuestionnaireIndex + 1);
  };

  const handleClickPrev = () => {
    if (activeScore15QuestionnaireIndex === 0) return;
    scrollableDivRef.current
      ?.querySelector('#questionnaire-card-' + activeScore15QuestionnaireIndex)
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'center',
      });
    setActiveScore15QuestionnaireIndex(activeScore15QuestionnaireIndex - 1);
  };

  return (
    <Container
      sx={{ maxWidth: '768px', backgroundColor: '#fafafa', maxHeight: '100vh' }}
    >
      <Box sx={{ position: 'relative', py: 1 }}>
        <Typography variant='h5' align='center'>{`${t(
          'SurveyQuestion'
        )}`}</Typography>
        <Typography
          sx={{ fontSize: '12px' }}
          align='center'
          variant='subtitle1'
        >
          SCORE-15 © Association for Family Therapy
          <a
            rel='aft.org.uk'
            href='http://www.aft.org.uk'
            target='_blank'
            className='text-blue-600 underline cursor-pointer'
          >
            {' '}
            www.aft.org.uk
          </a>
        </Typography>
        <Fab
          size='small'
          sx={{
            position: 'absolute',
            right: '10px',
            bottom: '37px',
            height: '17px',
            width: '36px',
          }}
          color='primary'
          aria-label='add'
          onClick={handleClickOpen}
        >
          <QuestionMarkIcon />
        </Fab>
        <Typography>{`${(activeScore15QuestionnaireIndex + 1)
          .toString()
          .padStart(score15Data.length.toString().length, '0')}/${
          score15Data.length
        }`}</Typography>
        <BorderLinearProgress
          variant='determinate'
          value={
            ((activeScore15QuestionnaireIndex + 1) / score15Data.length) * 100
          }
        />
        <Button
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            justifyContent: 'start',
            visibility:
              activeScore15QuestionnaireIndex === 0 ? 'hidden' : 'visible',
          }}
          onClick={handleClickPrev}
        >
          <KeyboardBackspaceIcon />
        </Button>
      </Box>

      <Stack
        gap={2}
        sx={{ height: 'calc(100vh - 84px)', overflowY: 'hidden' }}
        ref={scrollableDivRef}
      >
        {score15Data.map((d, questionnaireIndex) => (
          <Card
            key={questionnaireIndex}
            id={`questionnaire-card-${questionnaireIndex + 1}`}
            sx={{
              overflow: 'initial',
              pointerEvents:
                questionnaireIndex === activeScore15QuestionnaireIndex
                  ? 'auto'
                  : 'none',
              boxShadow: '0px 0px 20px 10px rgba(0, 0, 0, 0.04)',
              backgroundColor: 'rgba(66, 65, 65, 0.01)',
              borderRadius: '0px 40px 40px 0px',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                backdropFilter: 'blur(3.5px)',
                display:
                  questionnaireIndex === activeScore15QuestionnaireIndex
                    ? 'none'
                    : 'block',
              },
            }}
          >
            <CardContent>
              <Typography variant='h6'>{`${
                questionnaireIndex + 1
              }. ${d}`}</Typography>
              {disregarded && (
                <Typography color='error' fontSize={12}>
                  * {t('Word.Required')}.
                </Typography>
              )}

              <StyledRating>
                {[...Array(5)].map((_it, index) => (
                  <RatingButton
                    key={index}
                    isSelected={
                      score15Answers[questionnaireIndex] === index + 1
                    }
                    value={index + 1}
                    onChange={(newValue: number) =>
                      handleClickRatingButton(questionnaireIndex, newValue)
                    }
                  />
                ))}
              </StyledRating>

              <Stack
                direction='row'
                gap={2}
                justifyContent='center'
                alignItems='center'
              >
                <Button
                  onClick={handleClickPrev}
                  sx={{
                    visibility: questionnaireIndex === 0 ? 'hidden' : 'visible',
                  }}
                >
                  <ArrowCircleUpIcon />
                </Button>

                <ButtonPrimary
                  onClick={handleClickNext}
                  endIcon={<SouthIcon />}
                  sx={{ textTransform: 'capitalize' }}
                >
                  {t(
                    questionnaireIndex === score15Data.length - 1
                      ? 'Action.GoToORS'
                      : 'Action.Next'
                  )}
                </ButtonPrimary>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          {t('Score.DescribeTitle')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            {t('Score.DescribeSentences')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t('Score.GotIt')}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

const StyledRating = styled(Stack)({
  border: 'none',
  '& .active': {
    border: '3px solid #2BBA42',
  },
  flexDirection: 'column',
  gap: '16px',
  justifyContent: 'space-between',
  width: '100%',
  padding: '16px',
});

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: '#D1D1D1',
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: '#60A9FF',
  },
}));
