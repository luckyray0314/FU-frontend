import { Box, Button, Container, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { IdImage, SecureImage } from '../../assets/AppImages';
import {
  ButtonPrimary,
  ButtonSecondary,
} from '../../core/components/button/Button';
import InputWithIcon from '../../core/components/input/InputWithIcon';
import { useAppDispatch, useAppSelector } from '../../core/hooks/rtkHooks';
import AuthLayout from '../../core/layout/AuthLayout';
import { LoginUserProps } from '../../core/model/user.model';
import { clearState, loginUser } from '../../core/store/slices/userSlice';
import {
  forgotPasswordPath,
  homePath,
  registerPath,
} from '../../core/util/pathBuilder.util';
import { ENVIRONMENT } from '../../core/constants/base.const';

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { isSuccess, isError, errorMessage } = useAppSelector(
    (state) => state.user
  );

  const [environment, setEnvironment] = useState<string>(ENVIRONMENT);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginUserProps>();

  const onSubmit = (data: LoginUserProps) => {
    dispatch(loginUser(data));
  };

  useEffect(() => {
    return () => {
      dispatch(clearState());
    };
  }, []);

  useEffect(() => {
    if (isError) {
      toast.error(errorMessage);
      dispatch(clearState());
    }
    if (isSuccess) {
      dispatch(clearState());
      navigate(homePath());
    }
  }, [isError, isSuccess]);

  return (
    <AuthLayout>
      <Typography variant='h3' sx={{ mb: 2 }}>
        {t('Enter_Login_Credentials')}
      </Typography>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col w-[40%] gap-[16px]'
      >
        <Controller
          control={control}
          name='email'
          defaultValue=''
          render={({ field: { onChange, value, onBlur } }) => (
            <InputWithIcon
              iconSrc={IdImage().props.src}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              placeholder='Email'
              type='text'
            />
          )}
        />
        <Controller
          control={control}
          name='password'
          defaultValue=''
          render={({ field: { onChange, value, onBlur } }) => (
            <InputWithIcon
              iconSrc={SecureImage().props.src}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              placeholder='Password'
              type='password'
            />
          )}
        />
        {/* {errors?.email && <p>{errors.email.message}</p>} */}
        <Box className='flex justify-end gap-[16px] mt-[8px]'>
          {/* <ButtonSecondary onClick={() => navigate(registerPath())}>{t("Register")}</ButtonSecondary> */}
          <ButtonPrimary type='submit'>{t('Login')}</ButtonPrimary>
        </Box>
        {/* <Button onClick={() => navigate(forgotPasswordPath())}>{t("Forgot_Password")}</Button> */}
      </form>
      <div className='flex flex-row justify-center'>
        {environment !== 'production' && (
          <span className='text-xs italic'>
            {environment?.charAt(0)?.toUpperCase() + environment.slice(1)}{' '}
            environment
          </span>
        )}
      </div>
    </AuthLayout>
  );
}
