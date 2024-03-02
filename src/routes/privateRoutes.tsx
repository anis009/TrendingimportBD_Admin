import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../redux/hook';
import Loading from '../components/Loading/Loading';

interface IProps {
  children: ReactNode;
}
export default function PrivateRoute({ children }: IProps) {
  const { user, isLoading } = useAppSelector((state) => state.user);
  console.log('anis', user);
  const { pathname } = useLocation();
  if (isLoading) {
    return <Loading msg="user data loading..." />;
  }
  const cond = !user && !isLoading;
  console.log('cond', cond);
  if (cond) {
    return <Navigate to="/auth/sign-in" state={{ path: pathname }} />;
  }

  return children;
}
