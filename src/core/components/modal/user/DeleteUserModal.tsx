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
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonPrimary, ButtonRed } from '../../button/Button';
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

  const [name, setName] = useState<string>(user?.name || ' ');
  const [title, setTitle] = useState<string>(user?.title || ' ');
  const [department, setDepartment] = useState<string>(user?.department || ' ');
  const [phone, setPhone] = useState<string>(user?.phone || ' ');
  const [address, setAddress] = useState<string>(user?.address || ' ');
  const [isAdmin, setIsAdmin] = useState<boolean>(user?.isAdmin);
  const [error, setError] = useState<string>();

  const handleSave = React.useCallback(async () => {
    if (!name) {
      return;
    }
    try {
      const { data } = await fetchAPI({
        url: `/user/${user?.id}`,
        method: 'DELETE',
        body: { name, title, department, phone, address },
      });
      if (data?.affected) {
        onClose();
        setLoadAgain(true);
      }
    } catch (error) {
      setError(JSON.stringify(error));
    }
  }, [name, title, department, phone, address]);

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsAdmin(e.target.value === 'admin');
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
          {t('AdminPage.Delete')}
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
                    disabled
                    value={name}
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
                    value={user?.email}
                    disabled
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
                    disabled
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
                    disabled
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
                    disabled
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
                    disabled
                  />
                </Stack>
              </Grid>
            </Grid>
            <Typography variant='h6'>
              {t('AdminPage.DeleteConfirmationTitle')}
            </Typography>
            <Typography variant='body1'>
              {t('AdminPage.DeleteConfirmationMessage')}
            </Typography>
            <br />
            <Stack
              sx={{ justifyContent: 'space-between', alignItems: 'center' }}
              direction={'row'}
            >
              <ButtonPrimary variant='contained' onClick={onClose}>
                {t('No')}
              </ButtonPrimary>
              <ButtonRed variant='contained' onClick={handleSave}>
                {t('Yes')}
              </ButtonRed>
            </Stack>
          </form>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EditModal;
