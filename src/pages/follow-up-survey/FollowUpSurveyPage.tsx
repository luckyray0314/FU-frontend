import EastIcon from '@mui/icons-material/East';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import SouthIcon from '@mui/icons-material/South';
import {
  Button,
  Checkbox,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchAPI } from '../../core/api/fetch-api';
import { ButtonPrimary } from '../../core/components/button/Button';
import { useAppSelector } from '../../core/hooks/rtkHooks';
import { useFollowUpData } from '../../core/hooks/useFollowUpData';
import { FormDataMap } from '../../core/model/backgroundData.model';
import {
  FollowUpData,
  FollowUpSurveyBasicData,
} from '../../core/model/followUpData.model';
import { estimatesPath, homePath } from '../../core/util/pathBuilder.util';

const singleChoiceEntityNames = [
  'interventionPeriod',
  'timeConsumption',
  'interventionProgress',
];

export default function FollowUpSurveyPage() {
  const navigate = useNavigate();
  const { codeNumber } = useParams();
  const { t } = useTranslation();
  const { data: followUpData, isFetched } = useFollowUpData(codeNumber);
  const {
    loadingFollowUpSurveyBasicData,
    followUpSurveyBasicData,
    followUpSurveyFormMetadata,
  } = useAppSelector((state) => state.followUpSurvey);

  const [formData, setFormData] = useState<FormDataMap | undefined>();
  const [unfilledEntityNames, setUnfilledEntityNames] = useState<Array<string>>(
    []
  );

  const strDate = dayjs().format('YYYY-MM-DD');

  useEffect(() => {
    if (!loadingFollowUpSurveyBasicData && !!followUpSurveyBasicData) {
      const mappedData: FormDataMap = {};
      Object.keys(followUpSurveyBasicData).forEach((entityPluralName) => {
        const entityName = entityPluralName.replace('Entities', '');
        mappedData[entityName] = {};
        const basicDataUnits =
          followUpSurveyBasicData[
            entityPluralName as keyof FollowUpSurveyBasicData
          ];
        basicDataUnits.forEach((basicDataUnit) => {
          const nId = basicDataUnit.id;
          const textValue =
            (followUpData?.formDataByEntityName[entityName]
              .filter((val) => typeof val === 'string')
              .at(0) as string) || '';
          const booleanValue =
            followUpData?.formDataByEntityName[entityName].includes(nId) ||
            false;
          mappedData[entityName][nId.toString()] =
            basicDataUnit.description === 'OtherText'
              ? textValue
              : booleanValue;
        });
      });
      setFormData(mappedData);
    }
  }, [
    loadingFollowUpSurveyBasicData,
    followUpSurveyBasicData,
    codeNumber,
    isFetched,
  ]);

  const handleChangeRadioGroup = (entityName: string, idString: string) => {
    if (!formData) return;
    const x = Object.fromEntries(
      Object.entries(formData[entityName]).map(([idKey, value]) => [
        idKey,
        idKey === idString,
      ])
    );
    setFormData({
      ...formData,
      [entityName]: x,
    });
  };

  const handleChangeTextField = (
    entityName: string,
    idString: string,
    newText: string
  ) => {
    if (!formData) return;
    setFormData({
      ...formData,
      [entityName]: {
        ...formData[entityName],
        [idString]: newText,
      },
    });
  };

  const handleChangeCheckbox = (entityName: string, idString: string) => {
    if (!formData) return;
    setFormData({
      ...formData,
      [entityName]: {
        ...formData[entityName],
        [idString]: !formData[entityName][idString],
      },
    });
  };

  const handleSave = async () => {
    if (formData) {
      try {
        const newFollowUpData = {} as FollowUpData;
        newFollowUpData.codeNumber = codeNumber as string;
        newFollowUpData.date = strDate;
        newFollowUpData.formDataByEntityName = {};

        let hasValue = false;
        const unfilledEntities: string[] = [];
        Object.keys(followUpSurveyBasicData).forEach((entityPluralName) => {
          const entityName = entityPluralName.replace('Entities', '');
          newFollowUpData.formDataByEntityName[entityName] = [];
          for (const idString in formData[entityName]) {
            if (formData[entityName][idString]) {
              hasValue = true;
              newFollowUpData.formDataByEntityName[entityName].push(
                typeof formData[entityName][idString] === 'string'
                  ? (formData[entityName][idString] as string)
                  : +idString
              );
            }
          }
          if (!hasValue && entityName !== 'interventionProgress') {
            unfilledEntities.push(entityName);
          }
          hasValue = false;
        });
        if (unfilledEntities.length) {
          setUnfilledEntityNames(unfilledEntities);
          toast.error('Please fill out all the forms.');
        } else {
          await fetchAPI({
            url: `/follow-up-data/create`,
            method: 'POST',
            body: newFollowUpData,
          });
          setUnfilledEntityNames([]);
          alert('Saved successfully.');
          return true;
        }
      } catch (e) {
        console.log('saving error: ', e);
      }
    }
    return false;
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleSaveAndClose = async () => {
    const saved = await handleSave();
    if (saved) handleBack();
  };

  const handleGoToEstimates = async () => {
    const saved = await handleSave();
    if (saved) navigate(estimatesPath());
  };

  if (!codeNumber) navigate(homePath());

  return (
    <Container maxWidth='lg'>
      <Typography variant='h3' align='center'>
        {t('Title')}
      </Typography>

      <Divider variant='middle' sx={{ my: 5 }} />

      <Typography>{t('Description')}</Typography>

      <Stack
        direction='row'
        justifyContent='space-between'
        alignItems='center'
        mb={4}
      >
        <Typography>{`${t('Word.CodeNumber')}: ${codeNumber}`}</Typography>
        <Typography>{`${t('Word.Date')}: ${strDate}`}</Typography>
      </Stack>

      {/* Show Checkbox Sections */}
      {!!formData && !!followUpSurveyFormMetadata && (
        <Stack gap={3}>
          {followUpSurveyFormMetadata.map((metaData, metaDataIndex) => {
            return (
              <FormControl component='fieldset' fullWidth key={metaDataIndex}>
                <FormLabel component='legend'>
                  <Typography variant='h6' color='#33A474'>
                    {metaData.label}
                  </Typography>
                </FormLabel>
                {metaDataIndex < 3 &&
                  unfilledEntityNames.includes(metaData.entityName) && (
                    <Typography color='error' fontSize={12}>
                      * {t('Word.Required')}.
                    </Typography>
                  )}
                {singleChoiceEntityNames.includes(metaData.entityName) ? (
                  <RadioGroup
                    row
                    defaultValue={
                      Object.keys(formData[metaData.entityName]).at(0) || '1'
                    }
                    name={`radio-group-${metaData.entityName}`}
                    value={
                      Object.entries(formData[metaData.entityName])
                        .filter(([_key, value]) => !!value)
                        .at(0)?.[0] || ''
                    }
                    onChange={(e) =>
                      handleChangeRadioGroup(
                        metaData.entityName,
                        e.target.value
                      )
                    }
                  >
                    {metaData.entitiesData.map((basicDataUnit, bIndex) => (
                      <FormControlLabel
                        key={bIndex}
                        value={basicDataUnit.id}
                        control={<Radio />}
                        label={t(basicDataUnit.description)}
                      />
                    ))}
                  </RadioGroup>
                ) : (
                  <>
                    <FormGroup row>
                      {metaData.entitiesData.map(
                        (basicDataUnit, index) =>
                          basicDataUnit.description !== 'OtherText' && (
                            <FormControlLabel
                              key={index}
                              control={
                                <Checkbox
                                  checked={
                                    !!formData[metaData.entityName][
                                      basicDataUnit.id.toString()
                                    ]
                                  }
                                  onChange={() =>
                                    handleChangeCheckbox(
                                      metaData.entityName,
                                      basicDataUnit.id.toString()
                                    )
                                  }
                                />
                              }
                              label={t(basicDataUnit.description)}
                            />
                          )
                      )}
                    </FormGroup>
                    {/* {metaData.entitiesData
                      .filter(
                        (basicDataUnit) =>
                          basicDataUnit.description === 'OtherText'
                      )
                      .map((basicDataUnit, index) => (
                        <TextField
                          key={index}
                          label='Other'
                          multiline
                          rows={4}
                          value={
                            formData[metaData.entityName][
                              basicDataUnit.id.toString()
                            ]
                          }
                          disabled={
                            !formData[metaData.entityName][
                              metaData.entitiesData.find(
                                (entity) => entity.description === 'Other'
                              )?.id
                                ? Number(
                                    metaData.entitiesData.find(
                                      (entity) => entity.description === 'Other'
                                    )?.id
                                  )
                                : 1
                            ]
                          }
                          onChange={(e) =>
                            handleChangeTextField(
                              metaData.entityName,
                              basicDataUnit.id.toString(),
                              e.target.value
                            )
                          }
                        />
                      ))} */}
                  </>
                )}
              </FormControl>
            );
          })}
        </Stack>
      )}
      <Stack direction='row' justifyContent='center' m={4} gap={4}>
        <Button
          variant='contained'
          onClick={handleBack}
          sx={{
            borderRadius: '100%',
            minWidth: '56px',
            backgroundColor: '#FFFFFF',
            '&:hover': {
              backgroundColor: '#dadada',
            },
          }}
        >
          <KeyboardBackspaceIcon color='success' />
        </Button>
        <ButtonPrimary
          variant='contained'
          onClick={handleSaveAndClose}
          endIcon={<SouthIcon />}
        >
          {t('Action.SaveAndClose')}
        </ButtonPrimary>
      </Stack>
    </Container>
  );
}
