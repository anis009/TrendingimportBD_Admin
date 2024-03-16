import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../redux/hook';
import Loading from '../components/Loading/Loading';

interface IProps {
  children: ReactNode;
}
export default function PrivateRoute({ children }: IProps) {
  const { pathname } = useLocation();
  const { user, isLoading } = useAppSelector((state) => state.user);
  useEffect(() => {
    console.log('user: ', user);
  }, [user])

  const cond = !user && !isLoading;
  
  useEffect(() => {
    console.log('cond', cond);
  }, [])

  if (isLoading) {
    return <Loading msg="user data loading..." />;
  }
  if (cond) {
    return <Navigate to="/auth/sign-in" state={{ path: pathname }} />;
  }

  return children;
}
