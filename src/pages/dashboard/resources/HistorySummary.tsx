import { Stack } from '@mui/material';
import dayjs from 'dayjs';
import React from 'react';
import StatusCircle from '../../../core/components/status/StatusCircle';
import { EstimatesDto } from '../../../core/model/estimates.model';

const HistorySummary = React.memo(
  (props: { data: EstimatesDto['history'] }) => {
    const {
      data: { zeroMonth, sixMonths, twelveMonths },
    } = props;
    return (
      <Stack>
        <Stack direction='row' gap={0.8} alignItems='center'>
          {`0 day: ${dayjs(zeroMonth.date).format('YYYY-MM-DD')} `}
          <StatusCircle
            status={zeroMonth.statusInDetail.child}
            variant='small'
          />
          <StatusCircle
            status={zeroMonth.statusInDetail.careGiver1}
            variant='small'
          />
          <StatusCircle
            status={zeroMonth.statusInDetail.careGiver2}
            variant='small'
          />
        </Stack>

        <Stack direction='row' gap={0.8} alignItems='center'>
          {`6 months: ${dayjs(sixMonths.date).format('YYYY-MM-DD')} `}
          <StatusCircle
            status={sixMonths.statusInDetail.child}
            variant='small'
          />
          <StatusCircle
            status={sixMonths.statusInDetail.careGiver1}
            variant='small'
          />
          <StatusCircle
            status={sixMonths.statusInDetail.careGiver2}
            variant='small'
          />
        </Stack>

        <Stack direction='row' gap={0.8} alignItems='center'>
          {`12 months: ${dayjs(twelveMonths.date).format('YYYY-MM-DD')} `}
          <StatusCircle
            status={twelveMonths.statusInDetail.child}
            variant='small'
          />
          <StatusCircle
            status={twelveMonths.statusInDetail.careGiver1}
            variant='small'
          />
          <StatusCircle
            status={twelveMonths.statusInDetail.careGiver2}
            variant='small'
          />
        </Stack>
      </Stack>
    );
  }
);

export default HistorySummary;
