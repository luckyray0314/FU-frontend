import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab } from "@mui/material";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { orsMarks, satisfactionScaleMarks } from './resources';
import { ButtonPrimary } from '../../../../core/components/button/Button';


interface Props {
  orsData: {
    title: string;
    description: string;
  }[];
  satisfactionScaleData: string[];
  orsAndSatisfactionScaleAnswers: number[];
  setOrsAndSatisfactionScaleAnswers: React.Dispatch<React.SetStateAction<number[]>>;
  setShowScore15Page: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: () => void;
}

export default function OrsAndSatisfactionScalePage({
  orsData,
  satisfactionScaleData,
  orsAndSatisfactionScaleAnswers,
  setOrsAndSatisfactionScaleAnswers,
  setShowScore15Page,
  onSubmit
}: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (questionnaireIndex: number, newValue: number) => {
    const newAnswers = [...orsAndSatisfactionScaleAnswers];
    newAnswers[questionnaireIndex] = newValue;
    setOrsAndSatisfactionScaleAnswers(newAnswers);
  };

  const [showDescription, setShowDescription] = useState(false);

  const handleClick = () => {
    setShowDescription(!showDescription);
  };

  return (
    <Container sx={{ maxWidth: "768px", backgroundColor: "#fafafa" }}>
      <Typography variant="h4" align="center" color="success.main" fontWeight="bold" p={6}>VAS
        
      </Typography>

      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h5" color="#FF0000" fontWeight="bold">{t("Label.TotalDisappointment")}</Typography>
        <Typography variant="h5" color="#4BDE51" fontWeight="bold">{t("Label.TotalDisgust")}
        <Fab size="small" sx={{ position: "relative", bottom: "130px", height: "17px", width: "36px" }} color="primary" aria-label="add" onClick={handleClickOpen} >
          <QuestionMarkIcon />
        </Fab></Typography>
      </Stack>

      <Stack gap={3}>
        {orsData.map((data, index) => (
          <Stack alignItems="center" key={index} gap={1}>
            {/* <Typography onClick={handleClick} fontWeight="bold" variant="h6">{data.title}</Typography> */}
            {!showDescription && (
            <Typography fontWeight="bold" variant="h6">{data.description}</Typography>
            )}
            <Slider
              value={orsAndSatisfactionScaleAnswers[index] || 0}
              onChange={(_e, newVal) => handleChange(index, newVal as number)}
              valueLabelDisplay="off"
              step={1}
              marks={orsMarks}
              min={0}
              max={10}
            />
          </Stack>
        ))}
      </Stack>

      {/* Satisfaction Scale is not for v1.0 */}

      <Typography variant="h4" align="center" color="success.main" fontWeight="bold" p={6}>{t("Title.TheSatisfactionScale")}</Typography>

      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h5" color="#FF0000" fontWeight="bold">{t("Label.TotalDisappointment")}</Typography>
        <Typography variant="h5" color="#4BDE51" fontWeight="bold">{t("Label.TotalDisgust")}</Typography>
      </Stack>

      <Stack gap={3}>
        {satisfactionScaleData.map((data, index) => (
          <Stack alignItems="center" key={index} gap={2}>
            <Typography fontWeight="bold" variant="h6">{data}</Typography>
            <Slider
              valueLabelDisplay="off"
              value={orsAndSatisfactionScaleAnswers[orsData.length + index]}
              onChange={(_e, newVal) => handleChange(orsData.length + index, newVal as number)}
              step={1}
              marks={satisfactionScaleMarks}
              min={1}
              max={10}
            />
          </Stack>
        ))}
      </Stack>
     

      <Stack direction="row" justifyContent="center" m={4} gap={4}>
        <Button
          variant="contained"
          onClick={() => setShowScore15Page(true)}
          sx={{
            borderRadius: "100%",
            minWidth: "56px",
            backgroundColor: "#FFFFFF",
            '&:hover': {
              backgroundColor: "#dadada"
            }
          }}
        >
          <KeyboardBackspaceIcon color="success" />
        </Button>
        <ButtonPrimary onClick={() => onSubmit()}>{t("Action.Submit")}</ButtonPrimary>
      </Stack>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t("ORS.DescribeTitle")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          {t("ORS.DescribeSentences")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t("ORS.GotIt")}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}