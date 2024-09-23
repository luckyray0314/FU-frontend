import * as React from 'react';

import { Stack } from '@mui/material';
import Typography from '@mui/material/Typography/Typography';
import { useTranslation } from "react-i18next";
import { GoodIconImage, NotGoodAtAllIconImage, NotGoodIconImage, OkayIconImage, VeryGoodIconImage } from '../../../assets/AppImages';

interface RatingButtonProps {
  isSelected: boolean;
  value: number; // 1 ~ 5. 1: very good, 5: not good at all
  onChange: (newValue: number) => void;
}

export const RatingButton = (props: RatingButtonProps) => {
  const { isSelected, value, onChange } = props;
  const { t } = useTranslation();

  const customIcons: {
    [index: string]: {
      icon: React.ReactElement;
      label: string;
      backgroundColor: string;
      color: string;
    };
  } = {
    5: {
      icon: <NotGoodAtAllIconImage />,
      label: t('Reaction.NotGoodAtAll'),
      backgroundColor: "#F5D5DB",
      color: "#8B0000"
    },
    4: {
      icon: <NotGoodIconImage />,
      label: t('Reaction.NotGood'),
      backgroundColor: "#EDD5F5",
      color: "#8B0086"
    },
    3: {
      icon: <OkayIconImage />,
      label: t('Reaction.Okay'),
      backgroundColor: "#D5E9F5",
      color: "#000E8B"
    },
    2: {
      icon: <GoodIconImage />,
      label: t('Reaction.Good'),
      backgroundColor: "#D5F5F1",
      color: "#007A8B"
    },
    1: {
      icon: <VeryGoodIconImage />,
      label: t('Reaction.VeryGood'),
      backgroundColor: "#D5F5E8",
      color: "#008B50"
    },
  };

  return (
    <Stack
      direction="row"
      gap={1}
      alignItems="center"
      sx={{
        backgroundColor: customIcons[value].backgroundColor,
        borderRadius: "156px",
        padding: "16px 24px",
        cursor: "pointer",
      }}
      className={isSelected ? "active" : ""}
      onClick={() => onChange(value)}
    >
      {customIcons[value].icon}
      <Typography color={customIcons[value].color}>{customIcons[value].label}</Typography>
    </Stack>
  );
};
