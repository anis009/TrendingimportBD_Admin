export const getImageUrl = (url: string | '') => {
  if (url && url.includes('https')) {
    return url;
  }

  return `https://media.trendingimportbd.com${url}`;
};
