export type LoginUserProps = {
  email: string;
  password: string;
};

export type SignUpUserProps = {
  username: string;
  email: string;
  password: string;
};

export type CreateUserProps = {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  title?: string;
  department?: string;
  phone?: string;
  address?: string;
};

export type EditUserProps = {
  id: string;
  name: string;
  email: string;
  password?: string;
  isAdmin: boolean;
  title?: string;
  department?: string;
  phone?: string;
  address?: string;
};

export type ForgotPasswordProps = {
  email: string;
};
