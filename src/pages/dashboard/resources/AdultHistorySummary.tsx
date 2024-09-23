import { Stack } from "@mui/material";
import dayjs from "dayjs";
import React from "react";
import StatusCircle from "../../../core/components/status/StatusCircle";
import { AdultEstimatesDto } from "../../../core/model/adultEstimates.model";

const AdultHistorySummary = React.memo((props: { data: AdultEstimatesDto['history']; }) => {
  const { data: { zeroMonth, sixMonths, twelveMonths } } = props;
  return (
    <Stack>
      <Stack direction='row' gap={0.8} alignItems='center'>
        {`0 day: ${dayjs(zeroMonth.date).format('YYYY-MM-DD')} `}
        <StatusCircle status={zeroMonth.statusInDetail.adult} variant='small' />
      </Stack>

      <Stack direction='row' gap={0.8} alignItems='center'>
        {`6 months: ${dayjs(sixMonths.date).format('YYYY-MM-DD')} `}
        <StatusCircle status={sixMonths.statusInDetail.adult} variant='small' />
      </Stack>

      <Stack direction='row' gap={0.8} alignItems='center'>
        {`12 months: ${dayjs(twelveMonths.date).format('YYYY-MM-DD')} `}
        <StatusCircle
          status={twelveMonths.statusInDetail.adult}
          variant='small'
        />
      </Stack>
    </Stack>
  );
});

export default AdultHistorySummary;