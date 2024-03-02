export const getLocalDate = (utcTimestamp: string) => {
  if (!utcTimestamp) {
    return '';
  }
  const date = new Date(utcTimestamp);
  // Get local date and time string for Bangladesh timezone
  const localDateTimeString = date.toLocaleDateString('en-US', {
    timeZone: 'Asia/Dhaka',
  });

  return localDateTimeString;
};
