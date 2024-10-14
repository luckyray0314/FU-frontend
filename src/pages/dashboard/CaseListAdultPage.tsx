import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  MenuItem,
  Menu
} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {
  GridActionsCellItem,
  GridColDef,
  GridRenderCellParams,
  GridRowId,
  GridRowParams,
  GridRowSelectionModel,
  GridTreeNodeWithRender,
} from '@mui/x-data-grid';
import { DataGridPro } from '@mui/x-data-grid-pro';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  DoneIconImage,
  LossIconImage,
  TodoIconImage,
} from '../../assets/AppImages';
import { useAppDispatch, useAppSelector } from '../../core/hooks/rtkHooks';
import DashboardLayout from '../../core/layout/DashboardLayout';
import { AdultEstimatesDto } from '../../core/model/adultEstimates.model';
import { SurveyStatus } from '../../core/model/status.model';
import { setCurrentEstimatesAction } from '../../core/store/slices/backgroundAdultSurveySlice';
import { loadCaseListAdultData } from '../../core/store/slices/caseListAdultSlice';
import {
  estimatesAdultPath,
  caseListPath,
  estimatesPath,
} from '../../core/util/pathBuilder.util';
import AdultHistorySummary from './resources/AdultHistorySummary';
import StyledTab from './resources/StyledTab';
import StyledTabs from './resources/StyledTabs';
import TabPanel from './resources/TabPanel';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import ViewIcon from '@mui/icons-material/RemoveRedEye';
import EditCaseModal from '../../core/components/modal/case/EditCaseModal';
import DeleteCaseModal from '../../core/components/modal/case/DeleteCaseModal';
import { t } from 'i18next';
import { ArrowDropDownIcon } from '@mui/x-date-pickers';


const getStatusTranslation = (status: string) => {
  if (
    status.includes('SurveyStatus.Coming') &&
    status.includes('SurveyStatus.Incomplete')
  ) {
    console.log(status,'this is coming&incomplete')
    return `${t('SurveyStatus.Coming')} (${t('SurveyStatus.Incomplete')})`;
  } else if (
    status.includes('SurveyStatus.Loss') &&
    status.includes('SurveyStatus.Incomplete')
  ) {
    console.log(status,'this is Loss&incomplete')
    return `${t('SurveyStatus.Loss')} (${t('SurveyStatus.Incomplete')})`;
  } else if (
    status.includes('SurveyStatus.Clear') &&
    status.includes('SurveyStatus.Incomplete')
  ) {
    console.log(status,'this is clear&incomplete')
    return `${t('SurveyStatus.Clear')} (${t('SurveyStatus.Incomplete')})`;
  } else {
    console.log(status,'else case');
    // return "street"
    return t(status);
  }
};

export default function CaseListAdultPage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { caseList } = useAppSelector((state) => state.caseListAdultSurvey);
  const { username, isAdmin } = useAppSelector((state) => state.user);
  const [searchString, setSearchString] = useState('');
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [activeOngoingTabIndex, setActiveOngoingTabIndex] = useState(0);
  const [dropdownAnchorEl, setDropdownAnchorEl] = useState<HTMLElement | null>(null);
  const [openEditCase, setOpenEditCase] = useState<boolean>(false);
  const [openDeleteCase, setOpenDeleteCase] = useState<boolean>(false);
  const [loadAgain, setLoadAgain] = useState<boolean>(false);
  const [selectedCases, setSelectedCases] = useState<
    Array<{ id: number } & AdultEstimatesDto>
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
          if (props?.value) {
            console.log("========>", props.value)
            return <AdultHistorySummary data={props.value} />
          }
        },
      },
      {
        field: 'nextSurvey',
        headerName: t('CaseList.TableHeader.NextSurvey').toString(),
        headerAlign: 'left',
        align: 'left',
        width: 400,
        renderCell: ({ row }) => {
          return !row?.isClosed
            ? row.nextSurvey
              ? row.nextSurvey + t(row.signal)
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
            ,
          ];
        },
      },
    ],
    [t]
  );

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTabIndex(newValue);
  };
  const handleClose = () => {
    setDropdownAnchorEl(null);
  };
  const handleTabClick = (event: React.SyntheticEvent) => {
    setDropdownAnchorEl(event.currentTarget as HTMLElement);
  }
  const handleViewClick = (codeNumber: string) => () => {
    navigate(estimatesAdultPath(codeNumber));
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
    ? caseList
      ? (activeTabIndex === 1
          ? caseList?.filter((row) => row.status !== SurveyStatus.Archived)
          : caseList.filter((row) => {
            const statusToCheck =
              activeTabIndex === 2
                ? SurveyStatus.Clear
                : activeTabIndex === 0
                ? SurveyStatus.Coming
                : activeTabIndex === 3
                ? SurveyStatus.Loss
                : activeTabIndex === 4
                ? [SurveyStatus.Cancelled, SurveyStatus.Archived] // Return an array for both statuses
                : SurveyStatus.Archived;
          const rowStatus = row.status as SurveyStatus;
          if(Array.isArray(statusToCheck)){
            return statusToCheck.includes(rowStatus );
          }
          return row.status === statusToCheck;
          })
        ).filter((row) => row.codeNumber.includes(searchString))
      : []
    : caseListFilter
    ? (activeTabIndex === 1
      ? caseList?.filter((row) => row.status !== SurveyStatus.Archived)
      : caseList.filter((row) => {
        const statusToCheck =
          activeTabIndex === 2
            ? SurveyStatus.Clear
            : activeTabIndex === 0
            ? SurveyStatus.Coming
            : activeTabIndex === 3
            ? SurveyStatus.Loss
            : activeTabIndex === 4
            ? [SurveyStatus.Cancelled, SurveyStatus.Archived] // Return an array for both statuses
            : SurveyStatus.Archived;
      const rowStatus = row.status as SurveyStatus;
      if(Array.isArray(statusToCheck)){
        return statusToCheck.includes(rowStatus );
      }
      return row.status === statusToCheck;
      })
    ).filter((row) => row.codeNumber.includes(searchString))
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
    if (caseList?.length === 0) dispatch(loadCaseListAdultData());
  }, []);

  useEffect(() => {
    if (loadAgain) {
      setRowSelectionModel([]);
      dispatch(loadCaseListAdultData());
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
              to={caseListPath()}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <ToggleOffIcon />
            </NavLink>
            <Typography fontSize={20}>{t('Case.Child')}</Typography>
          </Stack>
          <Stack>
            <Typography fontSize={30}>{t('System.AdultTopic')}</Typography>
          </Stack>
        </Stack>

        <Card>
          <CardContent sx={{ padding: 0 }}>
          <Box>
          {isAdmin ? (
                <Box sx={{display:'flex'}}>     
                  <StyledTabs
                    value={activeTabIndex}
                    onChange={handleTabChange}
                    aria-label='basic tabs example'
                  >
                    <StyledTab
                    onClick={()=>setActiveOngoingTabIndex(0)}
                    icon={(
                        caseList?.filter(
                          (data) => data.status === SurveyStatus.Coming
                        ).length || 0
                    ).toString()}
                    label={t('CaseList.Ongoing')}
                  />
                {activeOngoingTabIndex == 0?
                    <StyledTab
                    onClick={handleTabClick}
                    icon={<Box sx={{ml:4}}>{(
                      (caseList?.length || 0) -
                        caseList?.filter(
                          (data) => data.status === SurveyStatus.Archived
                        ).length || 0
                    ).toString()}</Box>}
                    label={<Box sx={{display:'flex',alignItems:'center'}}>{t('CaseList.AllCodeNumber')}<ArrowDropDownIcon sx={{fontSize:'30px'}}/></Box>}
                  />
                  :<></>                
              }
                    {activeTabIndex == 2 ?
                      <StyledTab
                      onClick={handleTabClick}
                      icon={<Box sx={{ml:4}}>{(
                          caseList?.filter(
                            (data) => data.status === SurveyStatus.Clear
                          ).length || 0
                      ).toString()}</Box>}
                      label={<Box sx={{display:'flex',alignItems:'center'}}>{t('CaseList.FullyAnswered')}<ArrowDropDownIcon sx={{fontSize:'30px'}}/></Box>}
                      />:<></>                  
                    }               
                    {activeTabIndex == 3 ?
                      <StyledTab
                      onClick={handleTabClick}
                      icon={<Box sx={{ml:4}}>{(
                          caseList?.filter(
                            (data) => data.status === SurveyStatus.Loss
                          ).length || 0
                      ).toString()}</Box>}
                      label={<Box sx={{display:'flex',alignItems:'center'}}>{t('CaseList.ActionRequired')}<ArrowDropDownIcon sx={{fontSize:'30px'}}/></Box>}
                    />
                    :<></>}
                    {/* <StyledTab
                      icon={(
                        caseList?.filter(
                          (data) => data.status === SurveyStatus.Cancelled
                        ).length || 0
                      ).toString()}
                      label={t('Status.Cancelled')}
                    /> */}
                  {activeTabIndex == 4 ?
                      <StyledTab
                        onClick={handleTabClick}
                        icon={<Box sx={{ml:6}}>{(
                          caseList?.filter(
                            (data) => data.status === SurveyStatus.Archived || data.status === SurveyStatus.Cancelled
                          ).length || 0
                        ).toString()}</Box>}
                        label={<Box sx={{display:'flex',alignItems:'center'}}>{t('Status.Archived')}<ArrowDropDownIcon sx={{fontSize:'30px', mr:2}}/></Box>}
                      />
                  :<></>}
                  </StyledTabs>
                <Menu
        anchorEl={dropdownAnchorEl}
        open={Boolean(dropdownAnchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => {setActiveTabIndex(1);handleClose();setActiveOngoingTabIndex(0)}} sx={{ml:'5px'}}>{t('CaseList.AllCodeNumber')}</MenuItem>
        <MenuItem onClick={() => {setActiveTabIndex(2);handleClose();setActiveOngoingTabIndex(1)}} sx={{ml:'5px'}}>{t('CaseList.FullyAnswered')}</MenuItem>
        {/* <MenuItem onClick={() => {setActiveTabIndex(2);handleClose();setActiveOngoingTabIndex(1)}} sx={{ml:'5px'}}>{t('CaseList.Ongoing')}</MenuItem> */}
        <MenuItem onClick={() => {setActiveTabIndex(3);handleClose();setActiveOngoingTabIndex(3)}} sx={{ml:'5px'}}>{t('CaseList.ActionRequired')}</MenuItem>
        <MenuItem onClick={() => {setActiveTabIndex(4);handleClose();setActiveOngoingTabIndex(4)}} sx={{ml:'5px'}}>{t('Status.Archived')}</MenuItem>
      </Menu>
                </Box>
              ) : (
                <Box sx={{display:'flex'}}>
                  
                <StyledTabs
                  value={activeTabIndex}
                  onChange={handleTabChange}
                  aria-label='basic tabs example'
                >
                  <StyledTab
                  onClick={()=>setActiveOngoingTabIndex(0)}
                  icon={(
                    caseList?.filter(
                      (data) => data.status === SurveyStatus.Coming
                    ).length || 0
                  ).toString()}
                  label={t('CaseList.Ongoing')}
                />
              {activeOngoingTabIndex == 0?
                  <StyledTab
                  onClick={handleTabClick}
                  icon={(
                    (caseList?.length || 0) -
                      caseList?.filter(
                        (data) => data.status === SurveyStatus.Archived
                      ).length || 0
                  ).toString()}
                  label={<Box sx={{display:'flex',alignItems:'center'}}>{t('CaseList.AllCodeNumber')}<ArrowDropDownIcon sx={{fontSize:'30px'}}/></Box>}
                />
                :<></>                
            }
                  {activeTabIndex == 2 ?
                    <StyledTab
                    onClick={handleTabClick}
                    icon={(
                      caseList?.filter(
                        (data) => data.status === SurveyStatus.Clear
                      ).length || 0
                    ).toString()}
                    label={<Box sx={{display:'flex',alignItems:'center'}}>{t('CaseList.FullyAnswered')}<ArrowDropDownIcon sx={{fontSize:'30px'}}/></Box>}
                    />:<></>                  
                  }               
                  {activeTabIndex == 3 ?
                    <StyledTab
                    onClick={handleTabClick}
                    icon={(
                      caseList?.filter(
                        (data) => data.status === SurveyStatus.Loss
                      ).length || 0
                    ).toString()}
                    label={<Box sx={{display:'flex',alignItems:'center'}}>{t('CaseList.ActionRequired')}<ArrowDropDownIcon sx={{fontSize:'30px'}}/></Box>}
                  />
                  :<></>}
                  {/* <StyledTab
                    icon={(
                      caseList?.filter(
                        (data) => data.status === SurveyStatus.Cancelled
                      ).length || 0
                    ).toString()}
                    label={t('Status.Cancelled')}
                  /> */}
                  {activeTabIndex == 4 ?
                      <StyledTab
                        onClick={handleTabClick}
                        icon={<Box sx={{ml:4}}>{(
                          caseList?.filter(
                            (data) => data.status === SurveyStatus.Archived || data.status === SurveyStatus.Cancelled
                          ).length || 0
                        ).toString()}</Box>}
                        label={<Box sx={{display:'flex',alignItems:'center'}}>{t('Status.Archived')}<ArrowDropDownIcon sx={{fontSize:'30px', mr:2}}/></Box>}
                      />
                  :<></>}
                </StyledTabs>
              <Menu
                anchorEl={dropdownAnchorEl}
                open={Boolean(dropdownAnchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => {setActiveTabIndex(1);handleClose();setActiveOngoingTabIndex(0)}} sx={{ml:'5px'}}>{t('CaseList.AllCodeNumber')}</MenuItem>
                <MenuItem onClick={() => {setActiveTabIndex(2);handleClose();setActiveOngoingTabIndex(1)}} sx={{ml:'5px'}}>{t('CaseList.FullyAnswered')}</MenuItem>
                {/* <MenuItem onClick={() => {setActiveTabIndex(2);handleClose();setActiveOngoingTabIndex(1)}} sx={{ml:'5px'}}>{t('CaseList.Ongoing')}</MenuItem> */}
                <MenuItem onClick={() => {setActiveTabIndex(3);handleClose();setActiveOngoingTabIndex(3)}} sx={{ml:'5px'}}>{t('CaseList.ActionRequired')}</MenuItem>
                <MenuItem onClick={() => {setActiveTabIndex(4);handleClose();setActiveOngoingTabIndex(4)}} sx={{ml:'5px'}}>{t('Status.Archived')}</MenuItem>
              </Menu>
              </Box>
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
          isAdult={true}
          open={openEditCase}
          onClose={() => setOpenEditCase(false)}
          setLoadAgain={setLoadAgain}
        />
      )}
      {openDeleteCase && selectedCases?.length > 0 && (
        <DeleteCaseModal
          estimateCases={selectedCases}
          isAdult={true}
          open={openDeleteCase}
          onClose={() => setOpenDeleteCase(false)}
          setLoadAgain={setLoadAgain}
        />
      )}
    </DashboardLayout>
  );
}
