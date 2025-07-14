import Cookies from 'js-cookie';

const setUserToCookie = (user: any) => {
  let temp = user;
  if (temp) {
    temp = JSON.stringify(temp);
  }
  Cookies.set('TrendingImportBD-user', temp, { expires: 7 });
};

const getUserFromCookie = () => {
  let user = Cookies.get('TrendingImportBD-user');
  if (user) {
    user = JSON.parse(user);
  }
  return user;
};

const removeUser = () => {
  Cookies.remove('TrendingImportBD-user');
};

export const StoreToCookies = {
  setUserToCookie,
  getUserFromCookie,
  removeUser,
};
