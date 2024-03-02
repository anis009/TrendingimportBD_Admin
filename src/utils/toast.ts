import toast from 'react-hot-toast';

const success = (msg: string = 'added') => {
  return toast.success(msg);
};

const error = (msg: string = 'added') => {
  return toast.error(msg);
};

export const Toast = {
  success,
  error,
};
