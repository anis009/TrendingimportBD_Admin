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

export function timeAgo(inputDate: any) {
  if (!inputDate) {
    return null;
  }
  var date = new Date(inputDate);
  var now = new Date();
  var diff = now.getTime() - date.getTime();
  var seconds = Math.floor(diff / 1000);
  var minutes = Math.floor(seconds / 60);
  var hours = Math.floor(minutes / 60);
  var days = Math.floor(hours / 24);
  var months = Math.floor(days / 30);
  var years = Math.floor(months / 12);

  if (years > 0) {
    return years + ' years ago';
  } else if (months > 0) {
    return months + ' months ago';
  } else if (days > 0) {
    return days + ' days ago';
  } else if (hours > 0) {
    return hours + ' hours ago';
  } else if (minutes > 0) {
    return minutes + ' minutes ago';
  } else {
    return seconds + ' seconds ago';
  }
}

// Example usage:
var pastDate = '2024-03-19T12:00:00';
console.log(timeAgo(pastDate)); // This will output something like "2 days ago" or "2 minutes ago" or "10 seconds ago"
