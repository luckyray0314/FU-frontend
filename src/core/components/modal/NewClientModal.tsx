import CancelIcon from '@mui/icons-material/Cancel';
import {
  Box,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  FormGroup,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import * as React from 'react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/rtkHooks';
import { BackgroundData } from '../../model/backgroundData.model';
import { BackgroundAdultData } from '../../model/backgroundAdultData.model';
import { loadCaseListData } from '../../store/slices/caseListSlice';
import {
  backgroundSurveyPath,
  homePath,
  backgroundAdultSurveyPath,
} from '../../util/pathBuilder.util';
import { ButtonPrimary } from '../button/Button';
import { fetchAPI } from '../../api/fetch-api';
import ReactToPrint from 'react-to-print';
import { useRef, useState } from 'react';
import ComponentToPrint from './print/PrintModal';
import ComponentToPrintAdult from './print/PrintModalAdult';
import { API_URL } from '../../constants/base.const';
import axios from 'axios';
import { loadCaseListAdultData } from '../../store/slices/caseListAdultSlice';

type CloseStatusEntity = {
  codeNumber: string;
  processor: string;
  isClosed: string;
};

interface Props {
  open: boolean;
  onClose: () => void;
  choose: string;
  strNumber: string;
}
export default function NewClientModal(props: Props) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { username } = useAppSelector((state) => state.user);
  const [valueShowableButton, setValueShowableButton] = React.useState(false);
  const [checkedGuardianOne, setCheckedGuardianOne] = React.useState(false);
  const [checkedGuardianTwo, setCheckedGuardianTwo] = React.useState(false);
  const [checkedChild, setCheckedChild] = React.useState(false);
  const [error, setError] = useState<string>('');

  const strCodeNumber = React.useMemo(() => {
    return `${props.choose}${props.strNumber}`;
  }, [props.choose, props.strNumber]);

  const handleClickBackgroundSurvey = () => {
    if (checkedGuardianOne || checkedGuardianTwo || checkedChild) {
      axios
        .post(`${API_URL}/close-status/create`, {
          codeNumber: strCodeNumber,
          processor: username,
          isClosed: 'false',
          isGuardianOne: checkedGuardianOne ? 'true' : 'false',
          isGuardianTwo: checkedGuardianTwo ? 'true' : 'false',
          isChild: checkedChild ? 'true' : 'false',
        })
        .then(async (res) => {
          if (res?.data) {
            console.log(res);
            toast.success('Saved successfully.');
            props.onClose();
            navigate(backgroundSurveyPath(strCodeNumber));
            await dispatch(loadCaseListData());
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setError(`${t('NewClientModal.WhoParticipatesRequired')}`);
    }
  };

  const handleClickWithoutBackgroundSurvey = () => {
    if (checkedGuardianOne || checkedGuardianTwo || checkedChild) {
      axios
        .post(`${API_URL}/close-status/create`, {
          codeNumber: strCodeNumber,
          processor: username,
          isClosed: 'false',
          isGuardianOne: checkedGuardianOne ? 'true' : 'false',
          isGuardianTwo: checkedGuardianTwo ? 'true' : 'false',
          isChild: checkedChild ? 'true' : 'false',
        })
        .then(async (res) => {
          if (res?.data) {
            console.log('res?.data', res?.data);
            await dispatch(loadCaseListData());
            navigate(homePath());
            props.onClose();
            toast.success('Saved successfully.');
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setError(`${t('NewClientModal.WhoParticipatesRequired')}`);
    }
  };

  const handleClickBackgroundAdultSurvey = () => {
    axios
      .post(`${API_URL}/close-status-adult/create`, {
        codeNumber: strCodeNumber,
        processor: username,
        isClosed: 'false',
      })
      .then(async (res) => {
        console.log(res);
        toast.success('Saved successfully.');
        props.onClose();
        navigate(backgroundAdultSurveyPath(strCodeNumber));
        await dispatch(loadCaseListData());
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleClickWithoutBackgroundAdultSurvey = () => {
    axios
      .post(`${API_URL}/close-status-adult/create`, {
        codeNumber: strCodeNumber,
        processor: username,
        isClosed: 'false',
      })
      .then(async (res) => {
        if (res?.data) {
          console.log(res);
          toast.success('Saved successfully.');
          props.onClose();
          await dispatch(loadCaseListAdultData());
          navigate(homePath());
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleClickCreate = () => {
    setValueShowableButton(!valueShowableButton);
  };

  const handleClickRegisterAsAbsent = async () => {
    const payload: BackgroundData = {
      codeNumber: strCodeNumber,
      date: dayjs().format('YYYY-MM-DD'),
      yearOfBirth: dayjs().get('year'),
      country: 'Sweden',
      formDataByEntityName: {},
    };

    try {
      await fetchAPI({
        url: `/background-data/create`,
        method: 'POST',
        body: payload,
      });
      const payloadCloseStatus = {
        codeNumber: strCodeNumber,
        processor: username,
        isClosed: 'true',
        isAbsent: 'true',
      };
      axios
        .post(`${API_URL}/close-status/create`, {
          ...payloadCloseStatus,
        })
        .then(async (res) => {
          console.log(res);
          toast.success('Saved successfully.');
          props.onClose();
          await dispatch(loadCaseListData());
          navigate(homePath());
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (e) {
      console.log(e);
      toast.error('Error.');
    }
  };

  const handleClickAdultRegisterAsAbsent = async () => {
    const payload: BackgroundAdultData = {
      codeNumber: strCodeNumber,
      date: dayjs().format('YYYY-MM-DD'),
      yearOfBirth: dayjs().get('year'),
      country: 'Sweden',
      formDataByEntityName: {},
    };

    try {
      await fetchAPI({
        url: `/background-adult-data/create`,
        method: 'POST',
        body: payload,
      });
      const payloadCloseStatus = {
        codeNumber: strCodeNumber,
        processor: username,
        isClosed: 'true',
        isAbsent: 'true',
      };
      axios
        .post(`${API_URL}/close-status-adult/create`, {
          ...payloadCloseStatus,
        })
        .then(async (res) => {
          console.log(res);
          toast.success('Saved successfully.');
          props.onClose();
          await dispatch(loadCaseListAdultData());
          navigate(homePath());
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (e) {
      console.log(e);
      toast.error('Error.');
    }
  };

  const handleChangeChild = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCheckedChild(event.target.checked);
  };

  const handleChangeGuadianOne = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCheckedGuardianOne(event.target.checked);
  };

  const handleChangeGuadianTwo = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCheckedGuardianTwo(event.target.checked);
  };

  const componentRef = useRef<ComponentToPrint>(null);
  const componentAdultRef = useRef<ComponentToPrintAdult>(null);

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      aria-labelledby='new-client-modal'
      aria-describedby='new-client'
      fullWidth={true}
      maxWidth='xs'
      PaperProps={{ sx: { borderRadius: '30px', padding: '8px' } }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography color='#006D56' variant='h5' component='p'>
          {t('Word.CodeNumber')}
        </Typography>
        <IconButton aria-label='close' onClick={props.onClose}>
          <CancelIcon />
        </IconButton>
      </DialogTitle>

      <Divider variant='middle' />

      <DialogContent>
        <Box
          sx={{
            backgroundColor: '#E6E6E6',
            textAlign: 'center',
            padding: '12px',
            borderRadius: '40px',
            width: '100%',
            marginBottom: '24px',
          }}
        >
          {strCodeNumber}
        </Box>
        <Stack direction='row' gap={4} alignItems='center'>
          <Stack sx={{ display: valueShowableButton ? 'inline' : 'none' }}>
            {props.choose === 'Bof' ? (
              <Stack sx={{ display: 'flex', gap: 2 }}>
                <Stack direction='column' gap={4} alignItems='center'>
                  <span>{t('NewClientModal.WhoParticipates')}</span>
                  <FormGroup sx={{ display: 'flex' }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checkedGuardianOne}
                          onChange={handleChangeGuadianOne}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                      }
                      label={t('NewClientModal.GuardianOne')}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checkedGuardianTwo}
                          onChange={handleChangeGuadianTwo}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                      }
                      label={t('NewClientModal.GuardianTwo')}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checkedChild}
                          onChange={handleChangeChild}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                      }
                      label={t('NewClientModal.Child')}
                    />
                  </FormGroup>
                  {error && (
                    <Box
                      sx={{
                        color: '#ff0000',
                        fontSize: '14px',
                        textAlign: 'center',
                        padding: '2px',
                        fontStyle: 'italic',
                        width: '100%',
                      }}
                    >
                      {error} *
                    </Box>
                  )}
                </Stack>
                <ButtonPrimary
                  sx={{ width: '380px' }}
                  onClick={handleClickWithoutBackgroundSurvey}
                >
                  {t('NewClientModal.GoWithoutBackgroundSurvey')}
                </ButtonPrimary>
                <ButtonPrimary
                  sx={{ width: '380px' }}
                  onClick={handleClickBackgroundSurvey}
                >
                  {t('NewClientModal.Go To BackgroundSurvey')}
                </ButtonPrimary>
              </Stack>
            ) : (
              <Stack sx={{ display: 'flex', gap: 2 }}>
                <ButtonPrimary
                  sx={{ width: '380px' }}
                  onClick={handleClickWithoutBackgroundAdultSurvey}
                >
                  {t('NewClientModal.GoWithoutBackgroundSurvey')}
                </ButtonPrimary>
                <ButtonPrimary
                  sx={{ width: '380px' }}
                  onClick={handleClickBackgroundAdultSurvey}
                >
                  {t('NewClientModal.Go To BackgroundSurvey')}
                </ButtonPrimary>
              </Stack>
            )}
          </Stack>
          <Stack sx={{ display: valueShowableButton ? 'none' : 'inline' }}>
            <ReactToPrint
              pageStyle={`@media print {
                  display: 'block';
                  @page {
                    size: portrait;
                    margin: 2mm;
                  }
                }`}
              trigger={() => (
                <ButtonPrimary onClick={handleClickCreate}>
                  {t('NewClientModal.Create')}
                </ButtonPrimary>
              )}
              content={() =>
                props.choose === 'Bof'
                  ? componentRef.current
                  : componentAdultRef.current
              }
              onBeforePrint={handleClickCreate}
            />
          </Stack>
          {/* component to be printed */}
          <Stack sx={{ display: 'none' }}>
            <ComponentToPrint ref={componentRef} uri={strCodeNumber} />
            <ComponentToPrintAdult
              ref={componentAdultRef}
              uri={strCodeNumber}
            />
          </Stack>
          {props.choose === 'Bof' ? (
            <ButtonPrimary
              sx={{ display: valueShowableButton ? 'none' : 'inline' }}
              onClick={handleClickRegisterAsAbsent}
            >
              {t('NewClientModal.RegisterAsAbsent')}
            </ButtonPrimary>
          ) : (
            <ButtonPrimary
              sx={{ display: valueShowableButton ? 'none' : 'inline' }}
              onClick={handleClickAdultRegisterAsAbsent}
            >
              {t('NewClientModal.RegisterAsAbsent')}
            </ButtonPrimary>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
