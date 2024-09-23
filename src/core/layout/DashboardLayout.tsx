import BorderColorIcon from '@mui/icons-material/BorderColor';
import ListIcon from '@mui/icons-material/List';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import WysiwygRoundedIcon from '@mui/icons-material/WysiwygRounded';
import {
  Box,
  Button,
  Container,
  Drawer,
  FormControlLabel,
  FormLabel,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate } from 'react-router-dom';

import NewClientModal from '../components/modal/NewClientModal';
import { useAppDispatch, useAppSelector } from '../hooks/rtkHooks';
import { clearState } from '../store/slices/userSlice';
import { setStorageValue } from '../util/localStorage.util';
import {
  homePath,
  settingsPath,
  systematicFollowUpPath,
} from '../util/pathBuilder.util';
import dayjs from 'dayjs';
import { updateTranslation } from '../store/slices/translationSlice';
import { fetchAPI } from '../api/fetch-api';

const SideMenu = (props: {
  onClickNewBof: () => void;
  onClickNewVux: () => void;
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { username, isAdmin, email } = useAppSelector((state) => state.user);
  const { language } = useAppSelector((state) => state.translation);
  const [anchorEl, setAnchorEl] = useState(null);

  const onLogOut = () => {
    setStorageValue('token', '');
    dispatch(clearState());
    navigate('/login');
  };

  const handleMenuOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <StyledDrawer variant='permanent' anchor='left'>
      <Stack direction='row' justifyContent='space-between' alignItems='center'>
        <Typography variant='h4' color='#68D7BB'>
          {t('SideMenu.Menu')}
        </Typography>
        <Button variant='text' onClick={handleMenuOpen}>
          <Stack direction='column' alignItems='center'>
            <BorderColorIcon sx={{ color: 'success.main' }} />
            <Typography variant='caption' sx={{ textTransform: 'capitalize' }}>
              {t('SideMenu.NewClient')}
            </Typography>
          </Stack>
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={props.onClickNewBof}>BoF</MenuItem>
          <MenuItem onClick={props.onClickNewVux}>Vux</MenuItem>
        </Menu>
      </Stack>
      <Stack
        direction='column'
        justifyContent='space-between'
        alignItems='right'
      >
        <FormLabel id='demo-row-radio-buttons-group-label'>
          {t('Label.Translation')}
        </FormLabel>
        <FormControlLabel
          control={
            <Switch
              value={language}
              onChange={(e) => {
                if (e.target.value === 'sv') {
                  dispatch(updateTranslation({ language: 'en' }));
                } else {
                  dispatch(updateTranslation({ language: 'sv' }));
                }
              }}
              checked={language === 'sv'}
            />
          }
          label={language === 'sv' ? t('Label.Swedish') : t('Label.English')}
        />
      </Stack>
      <List component='nav' className='pt-[16px]'>
        {isAdmin && (
          <NavLink
            to={systematicFollowUpPath()}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            <ListItemButton key='Systematic follow-up'>
              <ListItemIcon>
                <WysiwygRoundedIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography fontWeight='600'>
                    {t('SideMenu.SystematicFollowUp')}
                  </Typography>
                }
              />
            </ListItemButton>
          </NavLink>
        )}
        <NavLink
          to={homePath()}
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          <ListItemButton key='Case list'>
            <ListItemIcon>
              <ListIcon />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography fontWeight='600'>
                  {t('SideMenu.ChildCaseList')}
                </Typography>
              }
            />
          </ListItemButton>
        </NavLink>
      </List>

      <Button
        startIcon={<SettingsIcon />}
        className='justify-start mt-auto mb-4'
      >
        <NavLink
          to={settingsPath()}
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          <Typography fontWeight='600'>{t('SideMenu.Settings')}</Typography>
        </NavLink>
      </Button>

      <Button
        startIcon={<LogoutIcon />}
        className='justify-start mb-10'
        onClick={onLogOut}
      >
        <Typography fontWeight='600'>{t('SideMenu.LogOut')}</Typography>
      </Button>
    </StyledDrawer>
  );
};

interface Props {
  children: any;
}

export default function DashboardLayout({ children }: Props) {
  const [openNewClientModal, setOpenNewClientModal] = useState(false);
  const [choose, setChoose] = useState('');
  const [newBofCodeNumber, setNewBofCodeNumber] = useState<string>('');
  const [newVuxCodeNumber, setNewVuxCodeNumber] = useState<string>('');

  const loadLastBofCodeNumber = async () => {
    const lastBofCodeNumberResult = await fetchAPI({
      url: '/close-status/getLast',
      method: 'GET',
    });
    const lastBofParts = lastBofCodeNumberResult?.data?.codeNumber?.split('-');
    if (lastBofParts?.length > 1) {
      setNewBofCodeNumber(
        `${dayjs().format('YYYY')}-${Number(lastBofParts[1]) + 1}`
      );
    } else {
      setNewBofCodeNumber(`${dayjs().format('YYYY')}-001`);
    }
  };

  const loadLastVuxCodeNumber = async () => {
    const lastVuxCodeNumberResult = await fetchAPI({
      url: '/close-status-adult/getLast',
      method: 'GET',
    });
    const lastVuxParts = lastVuxCodeNumberResult?.data?.codeNumber?.split('-');
    if (lastVuxParts?.length > 1) {
      setNewVuxCodeNumber(
        `${dayjs().format('YYYY')}-${Number(lastVuxParts[1]) + 1}`
      );
    } else {
      setNewVuxCodeNumber(`${dayjs().format('YYYY')}-001`);
    }
  };

  const resetNewBofClientModal = async () => {
    await loadLastBofCodeNumber();
    setOpenNewClientModal(true);
    setChoose('Bof');
  };

  const resetNewVuxClientModal = async () => {
    await loadLastBofCodeNumber();
    setOpenNewClientModal(true);
    setChoose('Vux');
  };

  useEffect(() => {
    loadLastBofCodeNumber();
    loadLastVuxCodeNumber();
  }, []);

  return (
    <Container maxWidth={false} className='bg-[#F2FAFF] min-h-[100vh] flex'>
      <SideMenu
        onClickNewBof={resetNewBofClientModal}
        onClickNewVux={resetNewVuxClientModal}
      />
      <Box className='flex-1'>{children}</Box>
      {choose === 'Bof' ? (
        <NewClientModal
          strNumber={newBofCodeNumber}
          choose={choose}
          open={openNewClientModal}
          onClose={() => setOpenNewClientModal(false)}
        />
      ) : (
        <NewClientModal
          strNumber={newVuxCodeNumber}
          choose={choose}
          open={openNewClientModal}
          onClose={() => setOpenNewClientModal(false)}
        />
      )}
    </Container>
  );
}

const StyledDrawer = styled(Drawer)({
  width: '300px',
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: '300px',
    padding: '32px 16px 0px 32px',
    boxSizing: 'border-box',
  },
  '& a': {
    color: '#363D4B',
    textDecoration: 'none',
    '.MuiListItemButton-root': {
      borderLeftWidth: '0px',
      borderColor: '#016A54',
      borderStyle: 'solid',
    },
    '.MuiListItemIcon-root': {
      minWidth: '40px',
    },
  },
  '& a.active': {
    color: '#016A54',
    '.MuiListItemButton-root': {
      borderLeftWidth: '4px',
    },
    '.MuiListItemIcon-root': {
      color: '#016A54',
    },
  },
  '& button': {
    color: '#363D4B',
    textTransform: 'none',
  },
});
