import CancelIcon from '@mui/icons-material/Cancel';
import {
  Alert,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonPrimary } from '../../button/Button';
import { fetchAPI } from '../../../api/fetch-api';

interface Props {
  open: boolean;
  onClose: () => void;
  setLoadAgain: Dispatch<SetStateAction<boolean>>;
}

export default function ProfileModal({ open, onClose, setLoadAgain }: Props) {
  const { t } = useTranslation();

  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [department, setDepartment] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [touchedEmail, setTouchedEmail] = useState<boolean>(false);
  const [touchedPassword, setTouchedPassword] = useState<boolean>(false);
  const [touchedName, setTouchedName] = useState<boolean>(false);
  const [isComplexPassword, setIsComplexPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const handleSave = React.useCallback(async () => {
    if (!email && !password && !name) {
      setTouchedEmail(true);
      setTouchedPassword(true);
      setTouchedName(true);
      return;
    } else if (!email && !password) {
      setTouchedEmail(true);
      setTouchedPassword(true);
      return;
    } else if (!email && !name) {
      setTouchedEmail(true);
      setTouchedName(true);
      return;
    } else if (!name && !password) {
      setTouchedName(true);
      setTouchedPassword(true);
      return;
    } else if (!email) {
      setTouchedEmail(true);
      return;
    } else if (!password) {
      setTouchedPassword(true);
      return;
    } else if (!name) {
      setTouchedName(true);
      return;
    }
    try {
      const { data } = await fetchAPI({
        url: `/user`,
        method: 'POST',
        body: {
          email,
          password,
          isAdmin,
          name,
          title,
          department,
          phone,
          address,
        },
      });
      if (data?.id) {
        onClose();
        setLoadAgain(true);
      } else if (data?.message?.length > 0) {
        setError(data?.message[0]);
      }
    } catch (error) {
      setError(JSON.stringify(error));
    }
  }, [password, isAdmin, name, title, department, phone, address]);

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsAdmin(e.target.value === 'admin');
  };

  const getPasswordErrorText = () => {
    if (touchedPassword) {
      if (password === '') {
        return t('Word.Required');
      } else if (!isComplexPassword) {
        return t('Word.PasswordLength');
      } else {
        return '';
      }
    } else {
      return '';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby='new-user-modal'
      aria-describedby='new-user'
      fullWidth={true}
      maxWidth='sm'
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant='h5' component='div'>
          {t('AdminPage.AddUser')}
        </Typography>
        <IconButton aria-label='close' onClick={onClose}>
          <CancelIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box
          sx={{
            textAlign: 'right',
          }}
        >
          <Grid container padding={3}>
            <Grid item xs={12} paddingBottom={1}>
              <Stack
                sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                direction={'row'}
              >
                <Typography>{t('CRUD.Name')}:</Typography>
                <TextField
                  id='name'
                  label={t('CRUD.Name')}
                  required
                  error={touchedName && name === ''}
                  helperText={
                    touchedName && name === '' ? t('Word.Required') : ''
                  }
                  value={name}
                  onChange={(e) => {
                    setTouchedName(true);
                    setName(e.target.value);
                  }}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} paddingBottom={1}>
              <Stack
                sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                direction={'row'}
              >
                <Typography>{t('CRUD.Title')}:</Typography>
                <TextField
                  id='title'
                  label={t('CRUD.Title')}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} paddingBottom={1}>
              <Stack
                sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                direction={'row'}
              >
                <Typography>{t('CRUD.Department')}:</Typography>
                <TextField
                  id='department'
                  label={t('CRUD.Department')}
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} paddingBottom={1}>
              <Stack
                sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                direction={'row'}
              >
                <Typography>{t('CRUD.Address')}:</Typography>
                <TextField
                  id='address'
                  label={t('CRUD.Address')}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} paddingBottom={1}>
              <Stack
                sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                direction={'row'}
              >
                <Typography>{t('CRUD.PhoneNumber')}:</Typography>
                <TextField
                  id='phone'
                  label={t('CRUD.PhoneNumber')}
                  value={phone}
                  type='number'
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} paddingBottom={1}>
              <Stack
                sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                direction={'row'}
              >
                <Typography>{t('CRUD.Email')}:</Typography>
                <TextField
                  id='email'
                  label={t('CRUD.Email')}
                  required
                  error={touchedEmail && email === ''}
                  type='email'
                  helperText={
                    touchedEmail && email === '' ? t('Word.Required') : ''
                  }
                  value={email}
                  onChange={(e) => {
                    setTouchedEmail(true);
                    setEmail(e.target.value);
                  }}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} paddingBottom={1}>
              <Stack
                sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                direction={'row'}
              >
                <Typography>{t('CRUD.Password')}:</Typography>
                <TextField
                  id='password'
                  label={t('CRUD.Password')}
                  type='password'
                  required
                  error={
                    touchedPassword && (password === '' || !isComplexPassword)
                  }
                  helperText={getPasswordErrorText()}
                  value={password}
                  onChange={(e) => {
                    setTouchedPassword(true);
                    setIsComplexPassword(e.target.value?.length >= 8);
                    setPassword(e.target.value);
                  }}
                  sx={{ width: '235px' }}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} paddingBottom={1}>
              <Stack
                sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                direction={'row'}
              >
                <Typography>{t('CRUD.Role')}:</Typography>
                <RadioGroup
                  row
                  aria-labelledby='demo-row-radio-buttons-group-label'
                  name='row-radio-buttons-group'
                  value={isAdmin ? 'admin' : 'manager'}
                  onChange={handleRoleChange}
                >
                  <FormControlLabel
                    value='admin'
                    control={<Radio />}
                    label={t('CRUD.Admin')}
                  />
                  <FormControlLabel
                    value='manager'
                    control={<Radio />}
                    label={t('CRUD.Handler')}
                  />
                </RadioGroup>
              </Stack>
            </Grid>
          </Grid>
          {error && <Alert severity='error'>{error}</Alert>}
          <br />
          <ButtonPrimary
            type='submit'
            variant='contained'
            color='primary'
            onClick={handleSave}
          >
            {t('CRUD.Save')}
          </ButtonPrimary>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
