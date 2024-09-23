import {
  Backdrop,
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Fade,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Typography,
  css,
  styled,
} from '@mui/material';
import { Modal as BaseModal } from '@mui/base/Modal';
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { fetchAPI } from '../../../api/fetch-api';
import { EstimatesDto } from '../../../model/estimates.model';
import { EditUserProps } from '../../../model/user.model';
import { useAppSelector } from '../../../hooks/rtkHooks';
import CancelIcon from '@mui/icons-material/Cancel';
import { ButtonPrimary, ButtonRed } from '../../button/Button';
import { AdultEstimatesDto } from '../../../model/adultEstimates.model';

interface Props {
  estimateCases: EstimatesDto[] | AdultEstimatesDto[];
  isAdult: boolean;
  open: boolean;
  onClose: () => void;
  setLoadAgain: Dispatch<SetStateAction<boolean>>;
}

export default function DeleteCaseModal({
  estimateCases,
  isAdult,
  open,
  onClose,
  setLoadAgain,
}: Props) {
  const { t } = useTranslation();

  const url = useMemo(() => {
    return isAdult ? `/close-status-adult` : `/close-status`;
  }, [isAdult]);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const handleDelete = async () => {
    setLoading(true);
    Promise.all(
      estimateCases?.map(async (estimateCase) => {
        const { data } = await fetchAPI({
          url: `${url}/${estimateCase?.codeNumber}`,
          method: 'DELETE',
        });
      })
    )
      .then(() => {
        setLoadAgain(true);
        setLoading(false);
      })
      .finally(() => {
        onClose();
      });
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
          {t('AdminPage.Delete')}
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
                sx={{ justifyContent: 'center', alignItems: 'center' }}
                direction={'column'}
              >
                <Typography variant='body1'>{`${t('AdminPage.Delete')} ${
                  estimateCases?.length
                } ${t('SideMenu.CaseList')}`}</Typography>
                <Typography>
                  {t('AdminPage.DeleteConfirmationTitle')}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
          <ButtonRed
            type='submit'
            variant='contained'
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? (
              <Box sx={{ display: 'flex' }}>
                <CircularProgress />
              </Box>
            ) : (
              t('AdminPage.Delete')
            )}
          </ButtonRed>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
