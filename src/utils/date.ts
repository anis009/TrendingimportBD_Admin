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

export function convertToLocalDate(dateString: string) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
