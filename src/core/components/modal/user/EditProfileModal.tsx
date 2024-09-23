import CancelIcon from '@mui/icons-material/Cancel';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonPrimary } from '../../button/Button';
import { EditUserProps } from '../../../model/user.model';
import { fetchAPI } from '../../../api/fetch-api';

interface Props {
  open: boolean;
  onClose: () => void;
  user: EditUserProps;
  setLoadAgain: Dispatch<SetStateAction<boolean>>;
}

export default function EditSelfModal({
  user,
  open,
  onClose,
  setLoadAgain,
}: Props) {
  const { t } = useTranslation();
  const [name, setName] = useState<string>(user?.name || '');
  const [password, setPassword] = useState<string>();
  const [title, setTitle] = useState<string>(user?.title || '');
  const [department, setDepartment] = useState<string>(user?.department || '');
  const [phone, setPhone] = useState<string>(user?.phone || '');
  const [address, setAddress] = useState<string>(user?.address || '');
  const [touchedName, setTouchedName] = useState<boolean>(false);
  const [touchedPassword, setTouchedPassword] = useState<boolean>(false);
  const [isComplexPassword, setIsComplexPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const handleSave = React.useCallback(async () => {
    if (!name) {
      return;
    }
    if (touchedPassword && !password) {
      return;
    }
    try {
      let body: EditUserProps = {
        id: user?.id,
        email: user?.email,
        name,
        isAdmin: user?.isAdmin,
        title,
        department,
        phone,
        address,
      };
      if (touchedPassword && password !== '') {
        body['password'] = password;
      }
      const { data } = await fetchAPI({
        url: '/auth/profile',
        method: 'PATCH',
        body,
      });
      if (data?.id) {
        onClose();
        setLoadAgain(true);
      }
    } catch (error) {
      setError(JSON.stringify(error));
    }
  }, [name, password, title, department, phone, address]);

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
      aria-labelledby='edit-profile-modal'
      aria-describedby='edit-profile'
      fullWidth={true}
      maxWidth='sm'
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant='h5' component='div'>
          {t('AdminPage.Profile')}
        </Typography>
        <IconButton aria-label='close' onClick={onClose}>
          <CancelIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box
          sx={{
            textAlign: 'center',
          }}
        >
          <form noValidate autoComplete='on'>
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
                  <Typography>{t('CRUD.Email')}:</Typography>
                  <TextField
                    id='email'
                    label={t('CRUD.Email')}
                    type='email'
                    value={user?.email}
                    disabled={true}
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
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </Stack>
              </Grid>
            </Grid>
            <ButtonPrimary
              variant='contained'
              color='primary'
              onClick={handleSave}
            >
              {t('CRUD.Save')}
            </ButtonPrimary>
          </form>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
