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
import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchAPI } from '../../../api/fetch-api';
import { EstimatesDto } from '../../../model/estimates.model';
import { EditUserProps } from '../../../model/user.model';
import { useAppSelector } from '../../../hooks/rtkHooks';
import CancelIcon from '@mui/icons-material/Cancel';
import { ButtonPrimary } from '../../button/Button';
import { AdultEstimatesDto } from '../../../model/adultEstimates.model';

interface Props {
  estimateCases: EstimatesDto[] | AdultEstimatesDto[];
  isAdult: boolean;
  open: boolean;
  onClose: () => void;
  setLoadAgain: Dispatch<SetStateAction<boolean>>;
}

export default function EditCaseModal({
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

  const [processors, setProcessors] = useState<EditUserProps[]>([]);
  const [processor, setProcessor] = useState<string>(
    estimateCases[0]?.processor
  );
  const [loading, setLoading] = useState<boolean>(false);
  
  const [error, setError] = useState<string>();

  const handleProcessorSave = async () => {
    setLoading(true);
    Promise.all(
      estimateCases?.map(async (estimateCase) => {
        const { data } = await fetchAPI({
          url: `${url}/update-processor/${estimateCase?.codeNumber}`,
          method: 'PATCH',
          body: { processor },
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

  const handleProcessorChange = (e: any) => {
    setProcessor(e?.target?.value);
  };

  const loadProcessors = async () => {
    setLoading(true);
    const { data } = await fetchAPI({ url: '/user', method: 'GET' });
    setProcessors(data);
    setProcessor(estimateCases[0]?.processor);
    setLoading(false);
  };

  useEffect(() => {
    loadProcessors();
  }, []);

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
          {t('AdminPage.Edit')}
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
                <Typography>{t('CaseList.TableHeader.Processor')}:</Typography>
                {loading ? (
                  <Box sx={{ display: 'flex' }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  processors?.length > 0 && (
                    <Select
                      value={processor}
                      onChange={handleProcessorChange}
                      MenuProps={{
                        style: { zIndex: 35001 },
                      }}
                    >
                      {processors?.map((processor: EditUserProps, i) => {
                        return (
                          <MenuItem key={i} value={processor.name}>
                            {processor.name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  )
                )}
              </Stack>
            </Grid>
          </Grid>
          <ButtonPrimary
            type='submit'
            variant='contained'
            color='primary'
            onClick={handleProcessorSave}
            disabled={loading}
          >
            {loading ? (
              <Box sx={{ display: 'flex' }}>
                <CircularProgress />
              </Box>
            ) : (
              t('CRUD.Save')
            )}
          </ButtonPrimary>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
