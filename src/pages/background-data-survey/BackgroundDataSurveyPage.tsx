import EastIcon from '@mui/icons-material/East';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import SouthIcon from '@mui/icons-material/South';
import {
  Autocomplete,
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
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import countryList from 'country-list';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchAPI } from '../../core/api/fetch-api';
import { ButtonPrimary } from '../../core/components/button/Button';
import { useAppDispatch, useAppSelector } from '../../core/hooks/rtkHooks';
import { useBackgroundData } from '../../core/hooks/useBackgroundData';
import {
  BackgroundData,
  BackgroundSurveyBasicData,
  FormDataMap,
} from '../../core/model/backgroundData.model';
import { estimatesPath, homePath } from '../../core/util/pathBuilder.util';
import { setCurrentEstimatesAction } from '../../core/store/slices/backgroundSurveySlice';
import { GridRowParams } from '@mui/x-data-grid';
import { loadCaseListData } from '../../core/store/slices/caseListSlice';

const singleChoiceEntityNames = [
  'gender',
  'reasonForUpdate',
  'interpreterRequired',
];
const specialEntityPairs = [
  ['educationVh1', 'educationVh2'],
  ['educationVh2', 'educationVh1'],
  ['employmentVh1', 'employmentVh2'],
  ['employmentVh2', 'employmentVh1'],
];

export default function BackgroundDataSurveyPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { codeNumber } = useParams();
  const {
    data: backgroundData,
    isFetched,
    refetch,
  } = useBackgroundData(codeNumber);
  const {
    loadingBackgroundSurveyBasicData,
    backgroundSurveyBasicData,
    backgroundSurveyFormMetadata,
  } = useAppSelector((state) => state.backgroundSurvey);

  const [formData, setFormData] = useState<FormDataMap | undefined>();
  const [unfilledEntityNames, setUnfilledEntityNames] = useState<Array<string>>(
    []
  );
  const [disabledEntityNames, setDisabledEntityNames] = useState<Array<string>>(
    []
  );
  
  const [yearOfBirth, setYearOfBirth] = useState<number>(
    backgroundData?.yearOfBirth as number
  );

  const [country, setCountry] = useState<null | string>(
    backgroundData?.country || 'Sweden'
  );
  const strDate = dayjs().format('YYYY-MM-DD');

  useEffect(() => {
    refetch();
    setYearOfBirth(backgroundData?.yearOfBirth as number)
  }, [backgroundData]);

  useEffect(() => {
    if (!loadingBackgroundSurveyBasicData && !!backgroundSurveyBasicData) {
      const mappedData: FormDataMap = {};
      Object.keys(backgroundSurveyBasicData).forEach((entityPluralName) => {
        const entityName = entityPluralName.replace('Entities', '');
        mappedData[entityName] = {};
        const basicDataUnits =
          backgroundSurveyBasicData[
            entityPluralName as keyof BackgroundSurveyBasicData
          ];
        basicDataUnits.forEach((basicDataUnit) => {
          const nId = basicDataUnit.id;
          const textValue =
            (backgroundData?.formDataByEntityName[entityName]
              ?.filter((val:any) => typeof val === 'string')
              .at(0) as string) || '';
          const booleanValue =
            backgroundData?.formDataByEntityName[entityName]?.includes(nId) ||
            false;
          mappedData[entityName][nId.toString()] =
            basicDataUnit.description === 'OtherText'
              ? textValue
              : booleanValue;
        });
      });

      // disable appropriate sections
      let disabledEntityNames_: string[] = [];
      specialEntityPairs.forEach((specialEntityPair) => {
        if (!disabledEntityNames_?.includes(specialEntityPair[0])) {
          let isFilled = false;
          for (const itrIdString in mappedData[specialEntityPair[0]]) {
            if (mappedData[specialEntityPair[0]][itrIdString]) {
              isFilled = true;
              disabledEntityNames_ = [
                ...disabledEntityNames_,
                specialEntityPair[1],
              ];
              break;
            }
          }
          if (!isFilled) {
            disabledEntityNames_ = disabledEntityNames_?.filter(
              (disabledEntityName) =>
                disabledEntityName !== specialEntityPair[1]
            );
          }
        }
      });

      setFormData(mappedData);
      setDisabledEntityNames(disabledEntityNames_);
    }
  }, [
    loadingBackgroundSurveyBasicData,
    backgroundSurveyBasicData,
    backgroundData,
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

  const handleChangeCheckbox = (
    entityName: string,
    idString: string,
    metaData: any
  ) => {
    if (!formData) return;

    let disabledEntityNames_: string[] = [];
    specialEntityPairs.forEach((specialEntityPair) => {
      if (!disabledEntityNames_?.includes(specialEntityPair[0])) {
        let isFilled = false;
        for (const itrIdString in formData[specialEntityPair[0]]) {
          if (
            entityName === specialEntityPair[0] && itrIdString === idString
              ? !formData[specialEntityPair[0]][idString]
              : formData[specialEntityPair[0]][itrIdString]
          ) {
            isFilled = true;
            disabledEntityNames_ = [
              ...disabledEntityNames_,
              specialEntityPair[1],
            ];
            break;
          }
        }
        if (isFilled) {
          disabledEntityNames_ = disabledEntityNames_?.filter(
            (disabledEntityName) => disabledEntityName !== specialEntityPair[1]
          );
        }
      }
    });

    setDisabledEntityNames(disabledEntityNames_);

    setFormData({
      ...formData,
      [entityName]: {
        ...formData[entityName],
        [idString]: !formData[entityName][idString],
      },
    });
  };

  const handleBack = () => {
    navigate(-1);
  };
  
  const handleSave = async () => {
    if (formData) {
      try {
        const newBackgroundData = {} as BackgroundData;
        newBackgroundData.codeNumber = codeNumber as string;
        newBackgroundData.date = backgroundData?.date ? backgroundData?.date : strDate;
        newBackgroundData.yearOfBirth = parseInt(String(yearOfBirth)) || dayjs().get('year');
        newBackgroundData.country = country;
        newBackgroundData.formDataByEntityName = {};

        let hasValue = false;
        let unfilledEntities: string[] = [];
        Object.keys(backgroundSurveyBasicData).forEach((entityPluralName) => {
          const entityName = entityPluralName.replace('Entities', '');
          newBackgroundData.formDataByEntityName[entityName] = [];
          for (const idString in formData[entityName]) {
            if (formData[entityName][idString]) {
              hasValue = true;
              newBackgroundData.formDataByEntityName[entityName].push(
                typeof formData[entityName][idString] === 'string'
                  ? (formData[entityName][idString] as string)
                  : +idString
              );
            }
          }
          if (!hasValue/*  && !entityName?.includes('participants') */) {
            unfilledEntities.push(entityName);
          }
          hasValue = false;
        });

        // In the background survey, it needs to be only one caretaker.
        hasValue = false;
        if (
          unfilledEntities?.includes('educationVh1') ||
          unfilledEntities?.includes('educationVh2')
        ) {
          for (const idString in formData['educationVh1']) {
            if (formData['educationVh1'][idString]) {
              unfilledEntities = unfilledEntities?.filter(
                (entityName) =>
                  entityName == 'educationVh1' || entityName == 'employmentVh1'
              );
              hasValue = true;
              break;
            }
          }
          if (!hasValue) {
            for (const idString in formData['employmentVh1']) {
              if (formData['employmentVh1'][idString]) {
                unfilledEntities = unfilledEntities?.filter(
                  (entityName) =>
                    entityName == 'educationVh1' ||
                    entityName == 'employmentVh1'
                );
                break;
              }
            }
          }
        }
        hasValue = false;
        if (
          unfilledEntities?.includes('educationVh2') ||
          unfilledEntities?.includes('employmentVh1')
        ) {
          for (const idString in formData['educationVh2']) {
            if (formData['educationVh2'][idString]) {
              unfilledEntities = unfilledEntities?.filter(
                (entityName) =>
                  entityName == 'educationVh2' || entityName == 'employmentVh2'
              );
              hasValue = true;
              break;
            }
          }
          if (!hasValue) {
            for (const idString in formData['employmentVh2']) {
              if (formData['employmentVh2'][idString]) {
                unfilledEntities = unfilledEntities?.filter(
                  (entityName) =>
                    entityName == 'educationVh2' ||
                    entityName == 'employmentVh2'
                );
                break;
              }
            }
          }
        }
        if (unfilledEntities.length) {
          setUnfilledEntityNames(unfilledEntities);
          toast.error('Please fill out all the forms.');
        } else {
          await fetchAPI({
            url: `/background-data/create`,
            method: 'POST',
            body: newBackgroundData,
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

  const handleSaveAndClose = async () => {
    const saved = await handleSave();
    if (saved) {
      dispatch(loadCaseListData());
      navigate(homePath());
    }
  };

  const handleGoToEstimates = async () => {
    const saved = await handleSave();
    if (saved) {
      dispatch(loadCaseListData());
      navigate(estimatesPath(codeNumber));
      console.log(codeNumber);
    }
  };

  if (!codeNumber) navigate(homePath());

  return (
    <Container maxWidth='lg'>
      <Typography variant='h3' align='center'>
        {t('SurveyTitle')}
      </Typography>

      <Divider variant='middle' sx={{ my: 5 }} />

      <Grid container spacing={2}>
        <Grid item xs={6}>
          {t('SubTitle')}
        </Grid>
        <Grid item xs={6}>
          <table>
            <tbody>
              <tr>
                <td>{t('Word.CodeNumber')}:</td>
                <td>{codeNumber}</td>
              </tr>
              <tr>
                <td>{t('Word.Date')}:</td>
                <td>{backgroundData?.date ? backgroundData?.date : strDate}</td>
              </tr>
              <tr>
                <td>{t('Word.YC')}:</td>
                <td>
                  <TextField
                    hiddenLabel
                    id='yob'
                    variant='outlined'
                    size='small'
                    type='number'
                    value={
                      yearOfBirth
                    }
                    onChange={(e:any) => setYearOfBirth(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td>{t('Word.Country')}:</td>
                <td>
                  <Autocomplete
                    disablePortal
                    id='countries'
                    size='small'
                    value={
                      backgroundData?.country
                        ? backgroundData?.country
                        : country
                    }
                    onChange={(_e, newVal) => setCountry(newVal)}
                    options={countryList.getNames().sort()}
                    sx={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField {...params} size='small' />
                    )}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </Grid>
      </Grid>

      {/* Show Checkbox Sections */}
      {!!formData && !!backgroundSurveyFormMetadata && (
        <Stack gap={3}>
          {backgroundSurveyFormMetadata
            /* ?.filter((item) => !item?.label?.includes('Participants')) */
            .map((metaData, metaDataIndex) => {
              return (
                <FormControl component='fieldset' fullWidth key={metaDataIndex}>
                  <FormLabel component='legend'>
                    <Typography variant='h6' color='#33A474'>
                      {t(metaData.label)}
                    </Typography>
                  </FormLabel>
                  {unfilledEntityNames?.includes(metaData.entityName) && (
                    <Typography color='error' fontSize={12}>
                      * {t('Word.Required')}.
                    </Typography>
                  )}
                  {singleChoiceEntityNames?.includes(metaData.entityName) ? (
                    <RadioGroup
                      row
                      defaultValue={
                        Object.keys(formData[metaData.entityName]).at(0) || '1'
                      }
                      name={`radio-group-${metaData.entityName}`}
                      value={
                        Object.entries(formData[metaData.entityName])
                          ?.filter(([_key, value]) => !!value)
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
                                        basicDataUnit.id.toString(),
                                        metaData
                                      )
                                    }
                                    disabled={disabledEntityNames?.includes(
                                      metaData.entityName
                                    )}
                                  />
                                }
                                label={t(basicDataUnit.description)}
                              />
                            )
                        )}
                      </FormGroup>
                      {/* {metaData.entitiesData?.filter(basicDataUnit => basicDataUnit.description === "OtherText").map((basicDataUnit, index) => (
                      <TextField
                        key={index}
                        label={t("Default.Other")}
                        multiline
                        rows={4}
                        value={formData[metaData.entityName][basicDataUnit.id.toString()]}
                        disabled={!formData[metaData.entityName][(metaData.entitiesData.find((entity) => entity.description === 'Other')?.id ? Number(metaData.entitiesData.find((entity) => entity.description === 'Other')?.id) : 1)]}
                        onChange={e => handleChangeTextField(metaData.entityName, basicDataUnit.id.toString(), e.target.value)}
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
        <ButtonPrimary
          variant='contained'
          onClick={handleGoToEstimates}
          endIcon={<EastIcon />}
        >
          {t('Action.GoToEstimates')}
        </ButtonPrimary>
      </Stack>
    </Container>
  );
}
