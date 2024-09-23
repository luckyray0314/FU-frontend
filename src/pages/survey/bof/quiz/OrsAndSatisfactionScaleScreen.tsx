import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import {
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
} from '@mui/material';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import LinearProgress, {
  linearProgressClasses,
} from '@mui/material/LinearProgress';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import SouthIcon from '@mui/icons-material/South';
import { VasRatingButton } from '../../../../core/components/button/VASRating';
import { ButtonPrimary } from '../../../../core/components/button/Button';

interface Props {
  orsData: {
    title: string;
    description: string;
  }[];
  // satisfactionScaleData: string[];
  orsAndSatisfactionScaleAnswers: number[];
  setOrsAndSatisfactionScaleAnswers: React.Dispatch<
    React.SetStateAction<number[]>
  >;
  setShowScore15Page: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: () => void;
}

export default function OrsAndSatisfactionScalePage({
  orsData,
  // satisfactionScaleData,
  orsAndSatisfactionScaleAnswers,
  setOrsAndSatisfactionScaleAnswers,
  setShowScore15Page,
  onSubmit,
}: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState(0);
  const scrollableDivRef = useRef<HTMLDivElement>(null);
  const [checkAnswer, setCheckAnswer] = useState<Array<boolean>>([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    scrollableDivRef.current
      ?.querySelector('#questionnaire-card-' + step)
      ?.scrollIntoView({
        behavior: 'smooth',
      });
  }, [scrollableDivRef, step]);

  const handleChange = (questionnaireIndex: number, newValue: number) => {
    const newAnswers = [...orsAndSatisfactionScaleAnswers];
    newAnswers[questionnaireIndex] = newValue;
    setOrsAndSatisfactionScaleAnswers(newAnswers);
    setCheckAnswer((prevState) => {
      const updatedCheckAnswer = [...prevState];
      updatedCheckAnswer[questionnaireIndex] = true;
      return updatedCheckAnswer;
    });
  };

  const [showDescription, setShowDescription] = useState(false);

  const handleClick = () => {
    setShowDescription(!showDescription);
  };
  const upStep = () => {
    setStep(step - 1);
  };
  const downStep = (indexNum: number) => {
    // checkAnswer === true ? setDisregarded(true) : setDisregarded(false)
    // setStep(step + 1)
    if (checkAnswer[indexNum] === true) {
      // setDisregarded(true)
      setStep(step + 1);
    } else {
      // setDisregarded(false)
      setCheckAnswer((prevState) => {
        const updatedCheckAnswer = [...prevState];
        updatedCheckAnswer[indexNum] = false;
        return updatedCheckAnswer;
      });
    }
  };

  return (
    <Container sx={{ maxWidth: '768px', backgroundColor: '#fafafa' }}>
      <Typography
        variant='h4'
        align='center'
        color='success.main'
        fontWeight='bold'
        p={6}
      >
        VAS
      </Typography>

      <Stack direction='row' justifyContent='space-between'>
        <Typography variant='h5' color='#FF0000' fontWeight='bold'>
          {/* {t("Label.TotalDisappointment")} */}
        </Typography>
        <Typography variant='h5' color='#4BDE51' fontWeight='bold'>
          {/* {t("Label.TotalDisgust")} */}
          <Fab
            size='small'
            sx={{
              position: 'relative',
              bottom: '130px',
              height: '17px',
              width: '36px',
            }}
            color='primary'
            aria-label='add'
            onClick={handleClickOpen}
          >
            <QuestionMarkIcon />
          </Fab>
        </Typography>
      </Stack>

      <Stack gap={3} ref={scrollableDivRef}>
        {orsData.map((data, index) => (
          <Card
            key={index}
            id={`questionnaire-card-${index}`}
            sx={{
              overflow: 'initial',
              pointerEvents: index === step ? 'auto' : 'none',
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
                display: index === step ? 'none' : 'block',
              },
              // visibility: index !== step ? "hidden" : "visible"
            }}
          >
            <CardContent>
              <Stack
                key={index}
                gap={1}
                sx={{
                  // opacity: step === index ? 1 : 0.2,
                  pointerEvents: index === step ? 'auto' : 'none',
                }}
              >
                <Typography
                  sx={{ visibility: step !== index ? 'hidden' : 'visible' }}
                >{`${(index + 1)
                  .toString()
                  .padStart(orsData.length.toString().length, '0')}/${
                  orsData.length
                }`}</Typography>
                <BorderLinearProgress
                  sx={{ visibility: step !== index ? 'hidden' : 'visible' }}
                  variant='determinate'
                  value={
                    ((step === index ? index + 1 : 0) / orsData.length) * 100
                  }
                />
                <Typography fontWeight='bold' variant='h6'>
                  {data.title}
                </Typography>
                {step === index &&
                  // disregarded === false &&
                  checkAnswer[step] === false && (
                    <Typography color='error' fontSize={12}>
                      * {t('Word.Required')}.
                    </Typography>
                  )}

                <StyledRating>
                  {[...Array(5)].map((_it, index1) => (
                    <VasRatingButton
                      key={index1}
                      isSelected={
                        orsAndSatisfactionScaleAnswers[index] === index1 + 1
                      }
                      value={index1 + 1}
                      onChange={(newValue: number) =>
                        handleChange(index, newValue)
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
                    onClick={upStep}
                    sx={{
                      visibility:
                        index !== step || index === 0 ? 'hidden' : 'visible',
                    }}
                  >
                    <ArrowCircleUpIcon />
                  </Button>
                  {/* {t(index === orsData.length - 1 ? "Action.GoToORS" : "Action.Next")} */}
                  {index === orsData.length - 1 ? (
                    <>
                      <Button
                        variant='contained'
                        onClick={() => setShowScore15Page(true)}
                        sx={{
                          borderRadius: '100%',
                          minWidth: '56px',
                          backgroundColor: '#FFFFFF',
                          '&:hover': {
                            backgroundColor: '#dadada',
                          },
                        }}
                      >
                        <KeyboardBackspaceIcon color='success' />
                      </Button>
                      {checkAnswer[step] !== true ? (
                        <ButtonPrimary onClick={() => downStep(step)}>
                          {t('Action.Submit')}
                        </ButtonPrimary>
                      ) : (
                        <ButtonPrimary onClick={() => onSubmit()}>
                          {t('Action.Submit')}
                        </ButtonPrimary>
                      )}
                    </>
                  ) : (
                    <ButtonPrimary
                      onClick={() => downStep(step)}
                      endIcon={<SouthIcon />}
                      sx={{ textTransform: 'capitalize' }}
                    >
                      {t('Action.Next')}
                    </ButtonPrimary>
                  )}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Stack direction='row' justifyContent='center' m={4} gap={4}></Stack>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          {t('ORS.DescribeTitle')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            {t('ORS.DescribeSentences')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t('ORS.GotIt')}</Button>
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
