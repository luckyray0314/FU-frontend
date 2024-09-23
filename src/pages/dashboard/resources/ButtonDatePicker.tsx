import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import Button from '@mui/material/Button';
import { UseDateFieldProps } from '@mui/x-date-pickers/DateField';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import {
  BaseSingleInputFieldProps,
  DateValidationError,
  FieldSection,
} from '@mui/x-date-pickers/models';
import { Dayjs } from 'dayjs';
import * as React from 'react';

interface ButtonFieldProps
  extends UseDateFieldProps<Dayjs>,
    BaseSingleInputFieldProps<
      Dayjs | null,
      Dayjs,
      FieldSection,
      DateValidationError
    > {
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

function ButtonField(props: ButtonFieldProps) {
  const {
    setOpen,
    label,
    id,
    disabled,
    InputProps: { ref } = {},
    inputProps: { 'aria-label': ariaLabel } = {},
  } = props;

  return (
    <Button
      variant="text"
      id={id}
      disabled={disabled}
      ref={ref}
      aria-label={ariaLabel}
      startIcon={<CalendarTodayIcon sx={{ color: "success.main", }} />}
      sx={{ color: "success.main", textTransform: "capitalize" }}
      onClick={() => setOpen?.((prev) => !prev)}
    >
      {label ?? 'Pick a date'}
    </Button>
  );
}

export default function ButtonDatePicker(
  props: Omit<DatePickerProps<Dayjs>, 'open' | 'onOpen' | 'onClose'>
) {
  const [open, setOpen] = React.useState(false);

  return (
    <DatePicker
      slots={{ field: ButtonField, ...props.slots }}
      slotProps={{ field: { setOpen } as any }}
      {...props}
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
    />
  );
}