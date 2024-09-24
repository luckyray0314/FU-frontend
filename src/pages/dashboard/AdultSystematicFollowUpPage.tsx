import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  FormGroup,
  LinearProgress,
  Paper,
  Stack,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchAPI } from '../../core/api/fetch-api';
import StatusCircle from '../../core/components/status/StatusCircle';
import { useAppSelector } from '../../core/hooks/rtkHooks';
import DashboardLayout from '../../core/layout/DashboardLayout';
import { BasicDataUnit } from '../../core/model/backgroundData.model';
import { OccasionIndex } from '../../core/model/estimates.model';
import { SurveyStatus } from '../../core/model/status.model';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from './resources/AccordionComponents';
import ButtonDatePicker from './resources/ButtonDatePicker';
import { FilterMenuItem } from './resources/FilterMenuItem';
import { FilterToggleButton } from './resources/FilterToggleButton';
import { StyledDateRange } from './resources/StyledDateRange';
import { NavLink } from 'react-router-dom';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import { systematicFollowUpPath } from '../../core/util/pathBuilder.util';

enum Filters {
  Filter1,
  Filter2,
}

export default function AdultSystematicFollowUpPage() {
  const { t } = useTranslation();
  const { language, isSuccess } = useAppSelector((state) => state.translation);
  const { backgroundAdultSurveyFormMetadata } = useAppSelector(
    (state) => state.backgroundAdultSurvey
  );
  const { importantEventsVuxFormMetadata } = useAppSelector(
    (state) => state.importantEventsVux
  );

  // date range
  const minDate = useMemo(() => {
    return dayjs('2021-01-01');
  }, []);
  const maxDate = useMemo(() => {
    return dayjs();
  }, []);
  const minDistance = useMemo(() => {
    return 1;
  }, []);
  const dateRangeSize = useMemo(() => {
    return maxDate.diff(minDate, 'day');
  }, []);

  // occasion filter
  const [occasionsOfSelections, setOccasionsOfSelections] = useState<{
    [Filters.Filter1]: Array<OccasionIndex>;
    [Filters.Filter2]: Array<OccasionIndex>;
  }>({
    [Filters.Filter1]: [1, 2, 3],
    [Filters.Filter2]: [1, 2, 3],
  });
  // right side filters section
  const [activeFilter, setActiveFilter] = useState<Filters>(Filters.Filter1);
  const [filtersByEntityName, setFiltersByEntityName] = useState<{
    [Filters.Filter1]: {
      background: { [entityName: string]: BasicDataUnit[] };
      importantEvent: { [entityName: string]: BasicDataUnit[] };
    };
    [Filters.Filter2]: {
      background: { [entityName: string]: BasicDataUnit[] };
      importantEvent: { [entityName: string]: BasicDataUnit[] };
    };
  }>({
    [Filters.Filter1]: { background: {}, importantEvent: {} },
    [Filters.Filter2]: { background: {}, importantEvent: {} },
  });

  const [dateRanges, setDateRanges] = useState<{
    [Filters.Filter1]: number[];
    [Filters.Filter2]: number[];
  }>({
    [Filters.Filter1]: [0, dateRangeSize],
    [Filters.Filter2]: [0, dateRangeSize],
  });
  // Filter results
  const [filterResult, setFilterResult] = useState<{
    [Filters.Filter1]: {
      status: SurveyStatus;
      numOfClients: number;
      ors: number;
      score15: number;
      percentage: number;
    };
    [Filters.Filter2]: {
      status: SurveyStatus;
      numOfClients: number;
      ors: number;
      score15: number;
      percentage: number;
    };
  }>({
    [Filters.Filter1]: {
      status: SurveyStatus.Loss,
      numOfClients: 0,
      ors: 0,
      score15: 0,
      percentage: 0,
    },
    [Filters.Filter2]: {
      status: SurveyStatus.Loss,
      numOfClients: 0,
      ors: 0,
      score15: 0,
      percentage: 0,
    },
  });

  const handleChangeOccasion = (
    targetOccasion: OccasionIndex,
    checked: boolean
  ) => {
    let newOccasions = [...occasionsOfSelections[activeFilter]];
    if (
      checked &&
      !occasionsOfSelections[activeFilter].includes(targetOccasion)
    ) {
      newOccasions.push(targetOccasion);
    }
    if (
      !checked &&
      occasionsOfSelections[activeFilter].includes(targetOccasion)
    ) {
      newOccasions = newOccasions.filter(
        (occasion) => occasion !== targetOccasion
      );
    }
    setOccasionsOfSelections({
      ...occasionsOfSelections,
      [activeFilter]: newOccasions,
    });
  };

  const handleChangeDateRange = (
    _event: Event,
    newValue: number | number[],
    activeThumb: number,
    filter: Filters
  ) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      setDateRanges({
        ...dateRanges,
        [filter]: [
          Math.min(newValue[0], dateRanges[filter][1] - minDistance),
          dateRanges[filter][1],
        ],
      });
    } else {
      setDateRanges({
        ...dateRanges,
        [filter]: [
          dateRanges[filter][0],
          Math.max(newValue[1], dateRanges[filter][0] + minDistance),
        ],
      });
    }
  };

  const handleStartDateChange = (
    filter: Filters,
    newValue: dayjs.Dayjs | null
  ) => {
    if (newValue) {
      setDateRanges({
        ...dateRanges,
        [filter]: [
          Math.min(
            newValue.diff(minDate, 'day'),
            dateRanges[filter][1] - minDistance
          ),
          dateRanges[filter][1],
        ],
      });
    }
  };

  const handleEndDateChange = (
    filter: Filters,
    newValue: dayjs.Dayjs | null
  ) => {
    if (newValue) {
      setDateRanges({
        ...dateRanges,
        [filter]: [
          dateRanges[filter][0],
          Math.max(
            maxDate.diff(newValue, 'day'),
            dateRanges[filter][0] + minDistance
          ),
        ],
      });
    }
  };

  const handleSelectionBackgroundFilterChange = (
    _e: React.MouseEvent<HTMLElement, MouseEvent>,
    newVal: number[],
    formMetadata: {
      label: string;
      entityName: string;
      entitiesData: BasicDataUnit[];
    }
  ) => {
    setFiltersByEntityName({
      ...filtersByEntityName,
      [activeFilter]: {
        importantEvent: {
          ...filtersByEntityName[activeFilter]?.importantEvent,
        },
        background: {
          ...filtersByEntityName[activeFilter]?.background,
          [formMetadata.entityName]: backgroundAdultSurveyFormMetadata
            .filter((d) => d.entityName === formMetadata.entityName)
            ?.at(0)
            ?.entitiesData.filter((d) => newVal.includes(d.id)),
        },
      },
    });
  };

  const handleSelectionImportantEventFilterChange = (
    _e: React.MouseEvent<HTMLElement, MouseEvent>,
    newVal: number[],
    formMetadata: {
      label: string;
      entityName: string;
      entitiesData: BasicDataUnit[];
    }
  ) => {
    setFiltersByEntityName({
      ...filtersByEntityName,
      [activeFilter]: {
        background: {
          ...filtersByEntityName[activeFilter]?.background,
        },
        importantEvent: {
          ...filtersByEntityName[activeFilter]?.importantEvent,
          [formMetadata.entityName]: importantEventsVuxFormMetadata
            .filter((d) => d.entityName === formMetadata.entityName)
            ?.at(0)
            ?.entitiesData.filter((d) => newVal.includes(d.id)),
        },
      },
    });
  };

  const handleBackgroundDeleteChip = (
    filter: Filters,
    entityIndex: number,
    rowId: number
  ) => {
    const entityName = Object.keys(filtersByEntityName[filter]?.background)[
      entityIndex
    ];
    const newVal = filtersByEntityName[filter]?.background[entityName].filter(
      (row) => row.id !== rowId
    );
    setFiltersByEntityName({
      ...filtersByEntityName,
      [filter]: {
        importantEvent: {
          ...filtersByEntityName[filter]?.importantEvent,
        },
        background: {
          ...filtersByEntityName[filter]?.background,
          [entityName]: newVal,
        },
      },
    });
  };

  const handleImportantDeleteChip = (
    filter: Filters,
    entityIndex: number,
    rowId: number
  ) => {
    const entityName = Object.keys(filtersByEntityName[filter]?.importantEvent)[
      entityIndex
    ];
    const newVal = filtersByEntityName[filter]?.importantEvent[
      entityName
    ].filter((row) => row.id !== rowId);
    setFiltersByEntityName({
      ...filtersByEntityName,
      [filter]: {
        background: {
          ...filtersByEntityName[filter]?.background,
        },
        importantEvent: {
          ...filtersByEntityName[filter]?.importantEvent,
          [entityName]: newVal,
        },
      },
    });
  };

  useEffect(() => {
    if (isSuccess) {
      dayjs.locale(language);
    }
  }, [isSuccess, language]);

  // fetch filter result from backend
  useEffect(() => {
    const idsByEntityName: {
      [entityName: string]: number[];
    } = {};
    for (const entityName in filtersByEntityName[activeFilter]?.background) {
      idsByEntityName[entityName] = [];
      idsByEntityName[entityName] = filtersByEntityName[
        activeFilter
      ]?.background[entityName]?.map((d) => d.id);
    }
    for (const entityName in filtersByEntityName[activeFilter]
      ?.importantEvent) {
      idsByEntityName[entityName] = [];
      idsByEntityName[entityName] = filtersByEntityName[
        activeFilter
      ]?.importantEvent[entityName]?.map((d) => d.id);
    }
    (async () => {
      const { response, data } = await fetchAPI({
        url: '/adult-score/getFollowUpFilterResult',
        method: 'POST',
        body: {
          startDate: minDate
            .add(dateRanges[activeFilter][0], 'day')
            .format('YYYY-MM-DD'),
          endDate: minDate
            .add(dateRanges[activeFilter][1], 'day')
            .format('YYYY-MM-DD'),
          occasions: occasionsOfSelections[activeFilter],
          idsByEntityName,
        },
      });
      if (response?.status === 201) {
        setFilterResult({
          ...filterResult,
          [activeFilter]: {
            status: SurveyStatus.Loss,
            numOfClients: data.numOfClients,
            ors: Math.round(+data.ors),
            score15: +(+data.score15).toFixed(2),
            percentage: +(+data.percentage).toFixed(1),
          },
        });
      }
    })();
  }, [
    filtersByEntityName[activeFilter],
    dateRanges[activeFilter],
    activeFilter,
    occasionsOfSelections[activeFilter],
  ]);

  useEffect(() => {
    if (backgroundAdultSurveyFormMetadata) {
      const initialBackgroundFilters = backgroundAdultSurveyFormMetadata.reduce(
        (prev, next) => {
          return {
            ...prev,
            [next.entityName]: [],
          };
        },
        {}
      );
      const initialImportantEventFilters =
        importantEventsVuxFormMetadata.reduce((prev, next) => {
          return {
            ...prev,
            [next.entityName]: [],
          };
        }, {});
      setFiltersByEntityName({
        [Filters.Filter1]: {
          background: initialBackgroundFilters,
          importantEvent: initialImportantEventFilters,
        },
        [Filters.Filter2]: {
          background: initialBackgroundFilters,
          importantEvent: initialImportantEventFilters,
        },
      });
    }
  }, [backgroundAdultSurveyFormMetadata, importantEventsVuxFormMetadata]);

  if (!backgroundAdultSurveyFormMetadata || !importantEventsVuxFormMetadata) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>
      {/* Occasion Filter */}
      <Stack direction='row' spacing={30} paddingTop={2}>
        <Stack direction='row'>
          <NavLink
            to={systematicFollowUpPath()}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            <ToggleOffIcon />
          </NavLink>
          <Typography fontSize={10}>{t('System.Child')}</Typography>
        </Stack>
        <Stack>
          <Typography fontSize={30}>{t('System.AdultOutPatient')}</Typography>
        </Stack>
      </Stack>
      <FormGroup row sx={{ paddingTop: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={occasionsOfSelections[activeFilter]?.includes(1)}
              onChange={(
                _event: ChangeEvent<HTMLInputElement>,
                checked: boolean
              ) => handleChangeOccasion(1, checked)}
            />
          }
          label={`${t('Word.Month')} 0`}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={occasionsOfSelections[activeFilter]?.includes(2)}
              onChange={(
                _event: ChangeEvent<HTMLInputElement>,
                checked: boolean
              ) => handleChangeOccasion(2, checked)}
            />
          }
          label={`${t('Word.Month')} 6`}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={occasionsOfSelections[activeFilter]?.includes(3)}
              onChange={(
                _event: ChangeEvent<HTMLInputElement>,
                checked: boolean
              ) => handleChangeOccasion(3, checked)}
            />
          }
          label={`${t('Word.Month')} 12`}
        />
      </FormGroup>

      <Stack direction='row' spacing={2} paddingTop={2}>
        <Stack spacing={3} flex={1}>
          {[Filters.Filter1, Filters.Filter2].map((filter, filterIndex) => (
            <Card
              key={filterIndex}
              sx={{ borderRadius: '20px', padding: '16px' }}
            >
              <CardContent>
                {/* Date Range */}
                <Stack spacing={1} direction='row' alignItems='center'>
                  <Typography color='text.secondary'>
                    {t('Word.From')}:
                  </Typography>
                  <ButtonDatePicker
                    label={minDate
                      .add(dateRanges[filter][0], 'day')
                      .format('D MMM YYYY')}
                    minDate={minDate}
                    maxDate={minDate.add(dateRanges[filter][1] - 1, 'day')}
                    value={minDate.add(dateRanges[filter][0], 'day')}
                    onChange={(newValue) =>
                      handleStartDateChange(filter, newValue)
                    }
                  />
                  <StyledDateRange
                    getAriaLabel={() => 'Minimum distance shift'}
                    min={0}
                    max={dateRangeSize}
                    step={1}
                    value={dateRanges[filter]}
                    onChange={(...props) =>
                      handleChangeDateRange(...props, filter)
                    }
                    valueLabelDisplay='off'
                    disableSwap
                  />
                  <Typography color='text.secondary'>
                    {t('Word.To')}:
                  </Typography>
                  <ButtonDatePicker
                    label={minDate
                      .add(dateRanges[filter][1], 'day')
                      .format('D MMM YYYY')}
                    minDate={minDate.add(dateRanges[filter][0] + 1, 'day')}
                    maxDate={maxDate}
                    value={minDate.add(dateRanges[filter][1], 'day')}
                    onChange={(newValue) =>
                      handleEndDateChange(filter, newValue)
                    }
                  />
                </Stack>

                {/* Completeness Progress Bar */}
                <Stack direction='row' alignItems='center'>
                  <Typography color='#5C5C5C'>{t('Word.Surveys')}:</Typography>
                  <LinearProgress
                    variant='determinate'
                    value={filterResult[filter].percentage}
                    color='success'
                    sx={{
                      flex: 1,
                      margin: '32px 16px',
                      height: 16,
                      borderRadius: '24px',
                    }}
                  />
                  <Typography color='success.main'>{`${filterResult[filter].percentage}%`}</Typography>
                </Stack>

                {/* Static Title & Info */}
                <Stack
                  direction='row'
                  justifyContent='space-between'
                  paddingX={4}
                  alignItems='center'
                >
                  <Typography
                    variant='h5'
                    fontWeight='medium'
                    color='success.main'
                  >
                    {t('Word.Selection') +
                      (filter === Filters.Filter1 ? '1' : '2')}
                  </Typography>
                  <Box
                    sx={{
                      backgroundColor: '#FFF0F0',
                      boxShadow: '0px 0px 34px rgba(0, 0, 0, 0.05)',
                      borderRadius: '40px',
                      padding: '18px 24px',
                    }}
                  >
                    <Typography sx={{ color: '#FF5252' }}>
                    {t('Systematic.CompletedVSNonResponsive').substring(9)}
                    </Typography>
                  </Box>
                </Stack>

                <Divider sx={{ margin: '16px 0px' }} />

                {/* Filter Items & Clients */}
                <Stack direction='row' gap={2} alignItems='center'>
                  <Typography
                    variant='h5'
                    fontWeight='medium'
                    color='success.main'
                  >
                    {t('Word.Filter')}
                  </Typography>
                  <Stack
                    direction='row'
                    spacing={2}
                    flex={1}
                    sx={{ flexWrap: 'wrap', rowGap: '16px' }}
                  >
                    {Object.values(filtersByEntityName[filter]?.background).map(
                      (item, itemIndex) =>
                        item.map((row, rowIndex) => (
                          <Chip
                            key={`${itemIndex}-${rowIndex}`}
                            label={t(row.description)}
                            color='success'
                            variant='filled'
                            sx={{
                              padding: '8px',
                              height: '48px',
                              borderRadius: '40px',
                            }}
                            onDelete={() =>
                              handleBackgroundDeleteChip(
                                filter,
                                itemIndex,
                                row.id
                              )
                            }
                          />
                        ))
                    )}
                    {Object.values(
                      filtersByEntityName[filter]?.importantEvent
                    ).map((item, itemIndex) =>
                      item.map((row, rowIndex) => (
                        <Chip
                          key={`${itemIndex}-${rowIndex}`}
                          label={t(row.description)}
                          color='success'
                          variant='filled'
                          sx={{
                            padding: '8px',
                            height: '48px',
                            borderRadius: '40px',
                          }}
                          onDelete={() =>
                            handleImportantDeleteChip(filter, itemIndex, row.id)
                          }
                        />
                      ))
                    )}
                  </Stack>
                  <Typography fontWeight='medium' color='#55B26C'>{`${
                    filterResult[filter].numOfClients
                  } ${t('Systematic.survey')}`}</Typography>
                </Stack>

                {/* ORS & Score15 */}
                <Stack
                  direction='row'
                  justifyContent='space-around'
                  alignItems='center'
                  mt={2}
                >
                  <Paper
                    elevation={6}
                    sx={{
                      borderRadius: '100%',
                      width: '120px',
                      height: '120px',
                      padding: '16px',
                    }}
                  >
                    <Stack
                      justifyContent='center'
                      alignItems='center'
                      height='100%'
                    >
                      <Typography
                        color='text.secondary'
                        fontWeight='medium'
                        variant='h6'
                      >
                        VAS
                      </Typography>
                      <Typography
                        color='info.main'
                        fontWeight='600'
                        variant='h5'
                      >
                        {filterResult[filter].ors}
                      </Typography>
                      {/* <StatusCircle variant="large" status={filterResult[filter].status} /> */}
                    </Stack>
                  </Paper>

                  <Typography
                    color='info.main'
                    variant='h5'
                    fontWeight='medium'
                  >
                    {t('Systematic.AverageValue')}
                  </Typography>

                  <Paper
                    elevation={6}
                    sx={{
                      borderRadius: '100%',
                      width: '120px',
                      height: '120px',
                      padding: '16px',
                    }}
                  >
                    <Stack
                      justifyContent='center'
                      alignItems='center'
                      height='100%'
                    >
                      <Typography
                        color='text.secondary'
                        fontWeight='medium'
                        variant='h6'
                      >
                        TFS
                      </Typography>
                      <Typography
                        color='info.main'
                        fontWeight='600'
                        variant='h5'
                      >
                        {filterResult[filter].score15}
                      </Typography>
                      {/* <StatusCircle variant="large" status={filterResult[filter].status} /> */}
                    </Stack>
                  </Paper>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>

        {/* Right Side Filter Section */}
        <Stack alignItems='center' spacing={2} sx={{ maxWidth: '30%' }}>
          <ToggleButtonGroup
            color='success'
            value={activeFilter}
            exclusive
            onChange={(e, newVal) => {
              if (newVal !== null) {
                setActiveFilter(newVal);
              }
            }}
            aria-label='Filter'
          >
            <FilterToggleButton value={Filters.Filter1}>
              {t('Word.Selection')} 1
            </FilterToggleButton>
            <FilterToggleButton value={Filters.Filter2}>
              {t('Word.Selection')} 2
            </FilterToggleButton>
          </ToggleButtonGroup>
          <Stack direction='row' spacing={2}>
            <Card>
              <CardHeader
                title={
                  <Typography
                    variant='h5'
                    align='center'
                    color='success.main'
                    fontWeight='600'
                  >
                    {t('Word.BackgroundFilter')}
                  </Typography>
                }
              />
              <CardContent>
                {backgroundAdultSurveyFormMetadata.map(
                  (formMetadata, formIndex) => {
                    return (
                      <Accordion key={formIndex}>
                        <AccordionSummary>
                          <Typography color='success.main'>
                            {t(formMetadata.label)}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <ToggleButtonGroup
                            orientation='vertical'
                            fullWidth
                            value={filtersByEntityName[
                              activeFilter
                            ]?.background?.[formMetadata.entityName]?.map(
                              (row) => row.id
                            )}
                            onChange={(...props) =>
                              handleSelectionBackgroundFilterChange(
                                ...props,
                                formMetadata
                              )
                            }
                            sx={{
                              '&.MuiToggleButtonGroup-root': {
                                gap: '3px',
                                '.MuiToggleButton-root': {
                                  border: 0,
                                  padding: '6px 12px',
                                },
                                '.MuiToggleButton-root.Mui-selected': {
                                  color: 'text.primary',
                                  backgroundColor: '#7BC29A',
                                },
                              },
                            }}
                          >
                            {formMetadata.entitiesData.map((row, rowIndex) => (
                              <FilterMenuItem key={rowIndex} value={row.id}>
                                {t(row.description)}
                              </FilterMenuItem>
                            ))}
                          </ToggleButtonGroup>
                        </AccordionDetails>
                      </Accordion>
                    );
                  }
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader
                title={
                  <Typography
                    variant='h5'
                    align='center'
                    color='success.main'
                    fontWeight='600'
                  >
                    {t('Word.ImportantEventFilter')}
                  </Typography>
                }
              />
              <CardContent>
                {importantEventsVuxFormMetadata.map(
                  (formMetadata, formIndex) => {
                    return (
                      <Accordion key={formIndex}>
                        <AccordionSummary>
                          <Typography color='success.main'>
                            {t(formMetadata.label)}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <ToggleButtonGroup
                            orientation='vertical'
                            fullWidth
                            value={filtersByEntityName[
                              activeFilter
                            ]?.importantEvent?.[formMetadata.entityName]?.map(
                              (row) => row.id
                            )}
                            onChange={(...props) =>
                              handleSelectionImportantEventFilterChange(
                                ...props,
                                formMetadata
                              )
                            }
                            sx={{
                              '&.MuiToggleButtonGroup-root': {
                                gap: '3px',
                                '.MuiToggleButton-root': {
                                  border: 0,
                                  padding: '6px 12px',
                                },
                                '.MuiToggleButton-root.Mui-selected': {
                                  color: 'text.primary',
                                  backgroundColor: '#7BC29A',
                                },
                              },
                            }}
                          >
                            {formMetadata.entitiesData.map((row, rowIndex) => (
                              <FilterMenuItem key={rowIndex} value={row.id}>
                                {t(row.description)}
                              </FilterMenuItem>
                            ))}
                          </ToggleButtonGroup>
                        </AccordionDetails>
                      </Accordion>
                    );
                  }
                )}
              </CardContent>
            </Card>
          </Stack>
        </Stack>
      </Stack>
    </DashboardLayout>
  );
}
