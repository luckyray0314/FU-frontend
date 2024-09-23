import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {
  GridActionsCellItem,
  GridColDef,
  GridRenderCellParams,
  GridRowSelectionModel,
  GridTreeNodeWithRender,
} from '@mui/x-data-grid';
import { DataGridPro } from '@mui/x-data-grid-pro';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../core/hooks/rtkHooks';
import DashboardLayout from '../../core/layout/DashboardLayout';
import { EstimatesDto } from '../../core/model/estimates.model';
import { SurveyStatus } from '../../core/model/status.model';
import { setCurrentEstimatesAction } from '../../core/store/slices/backgroundSurveySlice';
import { loadCaseListData } from '../../core/store/slices/caseListSlice';
import { adultCaseList, estimatesPath } from '../../core/util/pathBuilder.util';
import HistorySummary from './resources/HistorySummary';
import StyledTab from './resources/StyledTab';
import StyledTabs from './resources/StyledTabs';
import TabPanel from './resources/TabPanel';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import ViewIcon from '@mui/icons-material/RemoveRedEye';
import EditCaseModal from '../../core/components/modal/case/EditCaseModal';
import DeleteCaseModal from '../../core/components/modal/case/DeleteCaseModal';
import { t } from 'i18next';

const getStatusTranslation = (status: string) => {
  if (
    status.includes('SurveyStatus.Coming') &&
    status.includes('SurveyStatus.Incomplete')
  ) {
    return `${t('SurveyStatus.Coming')} (${t('SurveyStatus.Incomplete')})`;
  } else if (
    status.includes('SurveyStatus.Loss') &&
    status.includes('SurveyStatus.Incomplete')
  ) {
    return `${t('SurveyStatus.Loss')} (${t('SurveyStatus.Incomplete')})`;
  } else if (
    status.includes('SurveyStatus.Clear') &&
    status.includes('SurveyStatus.Incomplete')
  ) {
    return `${t('SurveyStatus.Clear')} (${t('SurveyStatus.Incomplete')})`;
  } else {
    if(t(status) == 'Bortfall')
      return "Ofullständig";
    else
      return t(status);
  }
};

export default function CaseListPage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { caseList } = useAppSelector((state) => state.caseListSurvey);
  const { username, isAdmin } = useAppSelector((state) => state.user);

  const [searchString, setSearchString] = useState('');
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [openEditCase, setOpenEditCase] = useState<boolean>(false);
  const [openDeleteCase, setOpenDeleteCase] = useState<boolean>(false);
  const [loadAgain, setLoadAgain] = useState<boolean>(false);
  const [selectedCases, setSelectedCases] = useState<
    Array<{ id: number } & EstimatesDto>
  >([]);
  const [rowSelectionModel, setRowSelectionModel] =
    React.useState<GridRowSelectionModel>([]);

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'codeNumberForSort',
        headerName: t('CaseList.TableHeader.CodeNumber').toString(),
        headerAlign: 'left',
        align: 'left',
        type: 'number',
        sortable: true,
        width: 300,
        renderCell: ({ row }) => {
          return (
            <Button onClick={handleViewClick(row?.codeNumber)}>
              {row?.codeNumber}
            </Button>
          );
        },
      },
      {
        field: 'status',
        headerName: t('CaseList.TableHeader.Status').toString(),
        headerAlign: 'left',
        align: 'left',
        sortable: false,
        width: 300,
        renderCell: (data) => {
          return getStatusTranslation(data.row.status);
        },
      },
      {
        field: 'history',
        headerName: t('CaseList.TableHeader.SurveyStatus').toString(),
        headerAlign: 'left',
        align: 'left',
        sortable: false,
        width: 400,
        renderCell: (
          props: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>
        ) => {
          if (props?.value) return <HistorySummary data={props.value} />;
        },
      },
      {
        field: 'nextSurvey',
        headerName: t('CaseList.TableHeader.NextSurvey').toString(),
        headerAlign: 'left',
        align: 'left',
        width: 400,
        renderCell: (data) => {
          return !data?.row?.isClosed
            ? data.row.nextSurvey
              ? data.row.nextSurvey + t(data.row.signal)
              : ''
            : t('CaseList.Next.Closed');
        },
      },
      {
        field: 'processor',
        headerName: t('CaseList.TableHeader.Processor').toString(),
        headerAlign: 'left',
        align: 'left',
        width: 200,
        renderCell: (data) => {
          return data?.row?.processor;
        },
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: t('CaseList.TableHeader.Action').toString(),
        width: 120,
        cellClassName: 'actions',
        getActions: ({ row }) => {
          return [
            <GridActionsCellItem
              icon={<ViewIcon />}
              label='View'
              className='textPrimary'
              onClick={handleViewClick(row?.codeNumber)}
              color='inherit'
            />,
            <GridActionsCellItem
              icon={<EditIcon />}
              label='Edit'
              className='textPrimary'
              onClick={handleEditClick(row?.codeNumber)}
              disabled={!isAdmin}
              color='inherit'
            />,
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label='Delete'
              onClick={handleDeleteClick(row?.codeNumber)}
              disabled={!isAdmin}
              color='inherit'
              sx={{ color: '#ff0000' }}
            />,
          ];
        },
      },
    ],
    [t]
  );

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTabIndex(newValue);
  };

  const handleViewClick = (codeNumber: string) => () => {
    navigate(estimatesPath(codeNumber));
    const found = caseList?.find((item) => item?.codeNumber === codeNumber);
    if (found) {
      dispatch(setCurrentEstimatesAction(found));
    }
  };

  const handleEditClick = (codeNumber: string) => () => {
    const found = caseList?.find((item) => item?.codeNumber === codeNumber);
    if (found) {
      setSelectedCases([found]);
      setOpenEditCase(true);
    }
  };

  const handleDeleteClick = (codeNumber: string) => () => {
    const found = caseList?.find((item) => item?.codeNumber === codeNumber);
    if (found) {
      setSelectedCases([found]);
      setOpenDeleteCase(true);
    }
  };

  const handleEditBulkClick = () => {
    if (rowSelectionModel?.length > 0) {
      setOpenEditCase(true);
    }
  };

  const handleDeleteBulkClick = () => {
    if (rowSelectionModel?.length > 0) {
      setOpenDeleteCase(true);
    }
  };

  const caseListFilter = caseList
    .filter((tip) => tip.processor === username)
    .map((row) => {
      return caseList.find((item) => item.codeNumber === row.codeNumber);
    });

  const filteredRows = isAdmin
    ? caseList?.length > 0
      ? (activeTabIndex === 0
          ? caseList?.filter((row) => row.status !== SurveyStatus.Archived)
          : caseList.filter(
              (row) =>
                row.status ===
                (activeTabIndex === 1
                  ? SurveyStatus.Clear
                  : activeTabIndex === 2
                  ? SurveyStatus.Coming
                  : activeTabIndex === 3
                  ? SurveyStatus.Loss
                  : activeTabIndex === 4
                  ? SurveyStatus.Cancelled
                  : SurveyStatus.Archived)
            )
        ).filter((row) => row.codeNumber.includes(searchString))
      : []
    : caseListFilter?.length > 0
    ? (activeTabIndex === 0
        ? caseListFilter
        : caseListFilter.filter(
            (row: any) =>
              row?.status ===
              (activeTabIndex === 1
                ? SurveyStatus.Clear
                : activeTabIndex === 2
                ? SurveyStatus.Coming
                : activeTabIndex === 3
                ? SurveyStatus.Loss
                : activeTabIndex === 4
                ? SurveyStatus.Cancelled
                : SurveyStatus.Archived)
          )
      ).filter((row: any) => row?.codeNumber.includes(searchString))
    : [];

  const getThreeNumber = (number: string) => {
    if (number.length == 1) {
      return '00' + number;
    } else if (number.length == 2) {
      return '0' + number;
    }
    return number;
  };

  const rows = filteredRows.map((d: any, idx) => {
    const codeNumberForSort =
      d.codeNumber.slice(3, 7) + getThreeNumber(d.codeNumber.split('-')[1]);
    return { ...d, codeNumberForSort: Number(codeNumberForSort), id: idx + 1 };
  });

  const sorted = rows.sort((a, b) => b.codeNumberForSort - a.codeNumberForSort);

  useEffect(() => {
    if (caseList?.length === 0) dispatch(loadCaseListData());
  }, []);

  useEffect(() => {
    if (loadAgain) {
      setRowSelectionModel([]);
      dispatch(loadCaseListData());
      setLoadAgain(false);
    }
  }, [loadAgain]);

  return (
    <DashboardLayout>
      <Box sx={{ width: '100%' }}>
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <TextField
              id='search-bar'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              variant='standard'
              placeholder={t('Dashboard.SearchCodeNumber').toString()}
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
            />
          </CardContent>
        </Card>
        <Stack direction='row' spacing={20} paddingTop={2}>
          <Stack direction='row'>
            <NavLink
              to={adultCaseList()}
              className={({ isActive }) => (isActive ? 'active' : 'none')}
            >
              <ToggleOnIcon />
            </NavLink>
            <Typography fontSize={20}>{t('Case.Adult')}</Typography>
          </Stack>
          <Stack>
            <Typography fontSize={30}>{t('System.ChildTopic')}</Typography>
          </Stack>
        </Stack>
        <Card>
          <CardContent sx={{ padding: 0 }}>
            <Box>
              {isAdmin ? (
                <StyledTabs
                  value={activeTabIndex}
                  onChange={handleTabChange}
                  aria-label='basic tabs example'
                >
                  <StyledTab
                    icon={(
                      (caseList?.length || 0) -
                        caseList?.filter(
                          (data) => data.status === SurveyStatus.Archived
                        ).length || 0
                    ).toString()}
                    label={t('CaseList.AllCodeNumber')}
                  />
                  <StyledTab
                    icon={(
                      caseList?.filter(
                        (data) => data.status === SurveyStatus.Clear
                      ).length || 0
                    ).toString()}
                    label={t('CaseList.FullyAnswered')}
                  />
                  <StyledTab
                    icon={(
                      caseList?.filter(
                        (data) => data.status === SurveyStatus.Coming
                      ).length || 0
                    ).toString()}
                    label={t('CaseList.Ongoing')}
                  />
                  <StyledTab
                    icon={(
                      caseList?.filter(
                        (data) => data.status === SurveyStatus.Loss
                      ).length || 0
                    ).toString()}
                    label={t('CaseList.ActionRequired')}
                  />
                  {/* <StyledTab
                    icon={(
                      caseList?.filter(
                        (data) => data.status === SurveyStatus.Cancelled
                      ).length || 0
                    ).toString()}
                    label={t('Status.Cancelled')}
                  /> */}
                  <StyledTab
                    icon={(
                      caseList?.filter(
                        (data) => data.status === SurveyStatus.Archived
                      ).length || 0
                    ).toString()}
                    label={t('Status.Archived')}
                  />
                </StyledTabs>
              ) : (
                <StyledTabs
                  value={activeTabIndex}
                  onChange={handleTabChange}
                  aria-label='basic tabs example'
                >
                  <StyledTab
                    icon={(
                      (caseListFilter?.length || 0) -
                        caseListFilter?.filter(
                          (data: any) => data.status === SurveyStatus.Archived
                        ).length || 0
                    ).toString()}
                    label={t('CaseList.AllCodeNumber')}
                  />
                  <StyledTab
                    icon={(
                      caseListFilter?.filter(
                        (data: any) => data.status === SurveyStatus.Clear
                      ).length || 0
                    ).toString()}
                    label={t('CaseList.FullyAnswered')}
                  />
                  <StyledTab
                    icon={(
                      caseListFilter?.filter(
                        (data: any) => data.status === SurveyStatus.Coming
                      ).length || 0
                    ).toString()}
                    label={t('CaseList.Ongoing')}
                  />
                  <StyledTab
                    icon={(
                      caseListFilter?.filter(
                        (data: any) => data.status === SurveyStatus.Loss
                      ).length || 0
                    ).toString()}
                    label={t('CaseList.ActionRequired')}
                  />
                  {/* <StyledTab
                    icon={(
                      caseListFilter?.filter(
                        (data: any) => data.status === SurveyStatus.Cancelled
                      ).length || 0
                    ).toString()}
                    label={t('Status.Cancelled')}
                  /> */}
                  <StyledTab
                    icon={(
                      caseListFilter?.filter(
                        (data: any) => data.status === SurveyStatus.Archived
                      ).length || 0
                    ).toString()}
                    label={t('Status.Archived')}
                  />
                </StyledTabs>
              )}
            </Box>
            <TabPanel>
              <Box className='w-full'>
                <Stack spacing={2} paddingTop={2}>
                  <Stack direction='row'>
                    <Typography fontSize={20}>
                      {t('CaseList.TableHeader.Action')}
                    </Typography>
                  </Stack>
                  <Stack direction='row'>
                    <IconButton
                      aria-label='edit-bulk'
                      disabled={rowSelectionModel?.length === 0 || !isAdmin}
                      onClick={(e) => {
                        e.preventDefault();
                        handleEditBulkClick();
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label='remove-bulk'
                      disabled={rowSelectionModel?.length === 0 || !isAdmin}
                      onClick={(e) => {
                        e.preventDefault();
                        handleDeleteBulkClick();
                      }}
                      sx={{ color: '#ff0000' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </Stack>
                <DataGridPro
                  checkboxSelection
                  disableRowSelectionOnClick
                  onRowSelectionModelChange={(ids) => {
                    const selectedRowsData = ids.map((id) =>
                      rows.find((row) => row.id === id)
                    );
                    console.log(selectedRowsData);
                    setRowSelectionModel(ids);
                    setSelectedCases(selectedRowsData);
                  }}
                  rowSelectionModel={rowSelectionModel}
                  rows={sorted}
                  columns={columns}
                  autoHeight={true}
                  rowSelection={true}
                  rowHeight={80}
                  classes={{
                    columnHeaderTitle: 'font-bold',
                  }}
                />
              </Box>
            </TabPanel>
          </CardContent>
        </Card>
      </Box>
      {openEditCase && selectedCases?.length > 0 && (
        <EditCaseModal
          estimateCases={selectedCases}
          isAdult={false}
          open={openEditCase}
          onClose={() => setOpenEditCase(false)}
          setLoadAgain={setLoadAgain}
        />
      )}
      {openDeleteCase && selectedCases?.length > 0 && (
        <DeleteCaseModal
          estimateCases={selectedCases}
          isAdult={false}
          open={openDeleteCase}
          onClose={() => setOpenDeleteCase(false)}
          setLoadAgain={setLoadAgain}
        />
      )}
    </DashboardLayout>
  );
}
