import Cookies from 'js-cookie';

const setUserToCookie = (user: any) => {
  let temp = user;
  if (temp) {
    temp = JSON.stringify(temp);
  }
  Cookies.set('fcfl-user', temp, { expires: 7 });
};

const getUserFromCookie = () => {
  let user = Cookies.get('fcfl-user');
  if (user) {
    user = JSON.parse(user);
  }
  return user;
};

const removeUser = () => {
  Cookies.remove('fcfl-user');
};

export const StoreToCookies = {
  setUserToCookie,
  getUserFromCookie,
  removeUser,
};
