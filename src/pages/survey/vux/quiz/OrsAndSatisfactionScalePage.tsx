import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { satisfactionScaleMarks } from './resources';
import { ButtonPrimary } from '../../../../core/components/button/Button';

interface Props {
  satisfactionScaleData: string[];
  score15Answers: number[];
  setScore15Answers: Dispatch<SetStateAction<number[]>>;
  setShowScore15Page: Dispatch<SetStateAction<boolean>>;
  onSubmit: () => void;
}

export default function OrsAndSatisfactionScalePage({
  satisfactionScaleData,
  score15Answers,
  setScore15Answers,
  setShowScore15Page,
  onSubmit,
}: Props) {
  console.log('score15Answers', score15Answers);

  const { t } = useTranslation();

  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (questionnaireIndex: number, newValue: number) => {
    const newAnswers = [...score15Answers];
    newAnswers[questionnaireIndex] = newValue;
    setScore15Answers(newAnswers);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  return (
    <Container sx={{ maxWidth: '768px', backgroundColor: '#fafafa' }}>
      <Typography
        variant='h4'
        align='center'
        color='success.main'
        fontWeight='bold'
        p={6}
      >
        {t('TheSatisfactionScale')}
      </Typography>

      <Stack direction='row' justifyContent='space-between'>
        <Typography variant='h5' color='#FF0000' fontWeight='bold'>
          {t('Label.TotalDisappointment')}
        </Typography>
        <Typography variant='h5' color='#4BDE51' fontWeight='bold'>
          {t('Label.TotalDisgust')}
        </Typography>
      </Stack>

      <Stack gap={3}>
        {satisfactionScaleData.map((data, index) => (
          <Stack alignItems='center' key={index} gap={2}>
            <Typography fontWeight='bold' variant='h6'>
              {data}
            </Typography>
            <Slider
              valueLabelDisplay='off'
              value={score15Answers[index]}
              onChange={(_e, newVal) =>
                handleChange(index, newVal as number)
              }
              step={1}
              marks={satisfactionScaleMarks}
              min={1}
              max={10}
            />
          </Stack>
        ))}
      </Stack>

      <Stack direction='row' justifyContent='center' m={4} gap={4}>
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
        <ButtonPrimary onClick={() => onSubmit()}>
          {t('Action.Submit')}
        </ButtonPrimary>
      </Stack>
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
