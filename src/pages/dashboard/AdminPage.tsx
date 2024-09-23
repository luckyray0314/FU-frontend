import { Box, Button, Stack, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import React, { Suspense, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { createClient } from '@supabase/supabase-js';
import {
  ButtonDelete,
  ButtonEdit,
  ButtonPrimary,
} from '../../core/components/button/Button';
import DeleteUserModal from '../../core/components/modal/user/DeleteUserModal';
import EditUserModal from '../../core/components/modal/user/EditUserModal';
import NewUserModal from '../../core/components/modal/user/NewUserModal';
import DashboardLayout from '../../core/layout/DashboardLayout';
import TabPanel from './resources/TabPanel';
import { SUPABASE_KEY, SUPABASE_URL } from '../../core/constants/base.const';
import { CreateUserProps, EditUserProps } from '../../core/model/user.model';
import { fetchAPI } from '../../core/api/fetch-api';

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

interface User {
  id: string;
  name: string;
  isAdmin?: boolean;
  email: string;
  title: string;
  department: string;
  phone: string;
  address: string;
}

export default function AdminPage() {
  const { t } = useTranslation();

  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<EditUserProps>();
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  const [loadAgain, setLoadAgain] = useState<boolean>(true);

  const loadUsers = async () => {
    const { data } = await fetchAPI({
      url: '/user',
      method: 'GET',
    });
    setUsers(data || []);
  };

  useEffect(() => {
    if (loadAgain) {
      loadUsers();
      /* supabaseClient
        .from('vallentuna_users')
        .select('*')
        .then(({ data, error }) => {
          if (error) {
            console.error(error);
          } else {
            setUsers(data || []);
            console.log('user data', data);
          }
        }); */
      setLoadAgain(false);
    }
  }, [loadAgain]);

  const handleAddUserClick = () => {
    setShowNewUserModal(true);
  };

  const handleEditClick = async (user: User) => {
    setShowEditUserModal(true);
    setUser({
      id: user?.id,
      email: user?.email,
      name: user?.name,
      title: user?.title,
      department: user?.department,
      phone: user?.phone,
      address: user?.address,
      isAdmin: user?.isAdmin ? true : false,
    });
  };

  const handleDeleteClick = async (user: User) => {
    setShowDeleteUserModal(true);
    setUser({
      id: user?.id,
      email: user?.email,
      name: user?.name,
      title: user?.title,
      department: user?.department,
      phone: user?.phone,
      address: user?.address,
      isAdmin: user?.isAdmin ? true : false,
    });
  };

  return (
    <DashboardLayout>
      <Box sx={{ width: '100%' }}>
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Stack direction='row' sx={{ justifyContent: 'space-between' }}>
              <Typography>{t('AdminPage.UsersProfileSetting')}</Typography>
              <ButtonPrimary onClick={handleAddUserClick}>
                {t('AdminPage.AddUser')}
              </ButtonPrimary>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ padding: 0 }}>
            <TabPanel>
              <Box className='w-full'>
                <Suspense fallback={`${t('Loading')}...`}>
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                      <TableHead>
                        <TableRow>
                          <TableCell>{t('AdminPage.Name')}</TableCell>
                          <TableCell align='center'>
                            {t('AdminPage.Role')}
                          </TableCell>
                          <TableCell align='left'>
                            {t('AdminPage.Email')}
                          </TableCell>
                          <TableCell align='left'>
                            {t('AdminPage.Title')}
                          </TableCell>
                          <TableCell align='left'>
                            {t('AdminPage.Department')}
                          </TableCell>
                          <TableCell align='left'>
                            {t('AdminPage.Phone')}
                          </TableCell>
                          <TableCell align='left'>
                            {t('AdminPage.Address')}
                          </TableCell>
                          <TableCell align='center'>
                            {t('AdminPage.Edit')}
                          </TableCell>
                          <TableCell align='center'>
                            {t('AdminPage.Delete')}
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow
                            key={user.id}
                            sx={{
                              '&:last-child td, &:last-child th': { border: 0 },
                            }}
                          >
                            <TableCell component='th' scope='row'>
                              {user.name}
                            </TableCell>
                            <TableCell align='center'>
                              {user.isAdmin ? (
                                <Button
                                  variant='contained'
                                  sx={{ paddingLeft: 2.5, paddingRight: 2.5 }}
                                  color='primary'
                                >
                                  {t('AdminPage.Admin')}
                                </Button>
                              ) : (
                                <Button variant='contained' color='secondary'>
                                  {t('AdminPage.Handler')}
                                </Button>
                              )}
                            </TableCell>
                            <TableCell align='left'>{user.email}</TableCell>
                            <TableCell align='left'>{user.title}</TableCell>
                            <TableCell align='left'>
                              {user.department}
                            </TableCell>
                            <TableCell align='left'>{user.phone}</TableCell>
                            <TableCell align='left'>{user.address}</TableCell>
                            <TableCell align='center'>
                              <ButtonEdit onClick={() => handleEditClick(user)}>
                                {t('AdminPage.Edit')}
                              </ButtonEdit>
                            </TableCell>
                            <TableCell align='center'>
                              <ButtonDelete
                                onClick={() => handleDeleteClick(user)}
                              >
                                {t('AdminPage.Delete')}
                              </ButtonDelete>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Suspense>
              </Box>
            </TabPanel>
          </CardContent>
        </Card>
      </Box>
      {showNewUserModal && (
        <NewUserModal
          open={showNewUserModal}
          onClose={() => setShowNewUserModal(false)}
          setLoadAgain={setLoadAgain}
        />
      )}
      {showEditUserModal && user && (
        <EditUserModal
          open={showEditUserModal}
          onClose={() => setShowEditUserModal(false)}
          user={user}
          setLoadAgain={setLoadAgain}
        />
      )}
      {showDeleteUserModal && user && (
        <DeleteUserModal
          open={showDeleteUserModal}
          onClose={() => setShowDeleteUserModal(false)}
          user={user}
          setLoadAgain={setLoadAgain}
        />
      )}
    </DashboardLayout>
  );
}
