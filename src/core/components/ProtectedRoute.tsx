import React from "react";
import { Navigate } from "react-router-dom";

import { useAppSelector } from "../hooks/rtkHooks";
import { loginPath } from "../util/pathBuilder.util";

interface Props {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: Props): JSX.Element {
  const { isFetching, isError } = useAppSelector(state => state.user);

  return isFetching ? (
    <div>Loading...</div>
  ) : isError ? (
    <Navigate to={loginPath()} />
  ) : (
    children
  );
};