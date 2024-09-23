import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { signupUser, clearState } from '../../core/store/slices/userSlice';
import { useAppDispatch, useAppSelector } from '../../core/hooks/rtkHooks';
import { homePath, loginPath } from '../../core/util/pathBuilder.util';
import { SignUpUserProps } from '../../core/model/user.model';
import AuthLayout from '../../core/layout/AuthLayout';
import InputWithIcon from '../../core/components/input/InputWithIcon';
import { IdImage, SecureImage } from '../../assets/AppImages';
import { ButtonPrimary } from '../../core/components/button/Button';

const Signup = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isSuccess, isError, errorMessage } = useAppSelector(state => state.user);
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<SignUpUserProps>();

  const onSubmit = (data: SignUpUserProps) => {
    dispatch(signupUser(data));
  };

  useEffect(() => {
    return () => {
      dispatch(clearState());
    };
  }, []);

  useEffect(() => {
    if (isSuccess) {
      console.log("asdfasdfasdf");
      dispatch(clearState());
      navigate(loginPath());
    }
    if (isError) {
      toast.error(errorMessage);
      dispatch(clearState());
    }
  }, [isSuccess, isError]);

  return (
    <AuthLayout>
      <form
        className="space-y-6"
        onSubmit={handleSubmit(onSubmit)}
        method="POST"
      >
        <Controller
          control={control}
          name="username"
          defaultValue=""
          render={({ field: { onChange, value, onBlur } }) => (
            <InputWithIcon
              iconSrc={IdImage().props.src}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              placeholder="Username"
              type="text"
            />
          )}
        />
        {errors?.username && <p>{errors.username.message}</p>}

        <Controller
          control={control}
          name="email"
          defaultValue=""
          render={({ field: { onChange, value, onBlur } }) => (
            <InputWithIcon
              iconSrc={IdImage().props.src}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              placeholder="Email"
              type="text"
            />
          )}
        />
        {errors?.email && <p>{errors.email.message}</p>}
        <Controller
          control={control}
          name="password"
          defaultValue=""
          render={({ field: { onChange, value, onBlur } }) => (
            <InputWithIcon
              iconSrc={SecureImage().props.src}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              placeholder="Password"
              type="password"
            />
          )}
        />

        <ButtonPrimary type='submit'>Register</ButtonPrimary>
      </form>
      Or <Link to={loginPath()}> Login</Link>
    </AuthLayout>
  );
};
export default Signup;