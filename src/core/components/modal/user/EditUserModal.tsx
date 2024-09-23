import CancelIcon from '@mui/icons-material/Cancel';
import {
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
import * as React from 'react';
import { Dispatch, SetStateAction, useState } from 'react';
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

const EditModal = ({ user, open, onClose, setLoadAgain }: Props) => {
  const { t } = useTranslation();

  const [name, setName] = useState<string>(user?.name || '');
  const [title, setTitle] = useState<string>(user?.title || '');
  const [department, setDepartment] = useState<string>(user?.department || '');
  const [phone, setPhone] = useState<string>(user?.phone || '');
  const [address, setAddress] = useState<string>(user?.address || '');
  const [password, setPassword] = useState<string>();
  const [isAdmin, setIsAdmin] = useState<boolean>(user?.isAdmin);
  const [touchedName, setTouchedName] = useState<boolean>(false);
  const [touchedPassword, setTouchedPassword] = useState<boolean>(false);
  const [isComplexPassword, setIsComplexPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const handleSave = React.useCallback(async () => {
    if (!name || (touchedPassword && !password)) {
      return;
    }
    try {
      const { data } = await fetchAPI({
        url: `/user/${user?.id}`,
        method: 'PATCH',
        body: { password, isAdmin, name, title, department, phone, address },
      });
      if (data?.id) {
        onClose();
        setLoadAgain(true);
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
      aria-labelledby='edit-user-modal'
      aria-describedby='edit-user'
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
          {t('AdminPage.Edit')}
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
};

export default EditModal;
