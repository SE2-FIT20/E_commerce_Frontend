import axios from "axios";

export function formatNumber(num) {
  let str = num.toString();
  let result = "";
  let count = 0;

  if (str.includes(".")) {
    const parts = str.split(".");
    const integerPart = parts[0];
    const decimalPart = parts[1];
    result = formatIntegerPart(integerPart) + "." + decimalPart;
  } else {
    result = formatIntegerPart(str);
  }

  return result;
}

function formatIntegerPart(str) {
  let result = "";
  let count = 0;

  for (let i = str.length - 1; i >= 0; i--) {
    result = str.charAt(i) + result;
    count++;

    if (count % 3 === 0 && i !== 0) {
      result = "," + result;
    }
  }

  return result;
}

export function handleClickOutside(event, setOpen, ref) {
  if (ref.current && !ref.current.contains(event.target)) {
    setOpen(false);
  }
}

export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const formattedDate = `${year}-${padNumber(month)}-${padNumber(day)}`;
  return formattedDate;
};

const padNumber = (number) => {
  return number.toString().padStart(2, "0");
};

export const formatDaysAgo = (timestampString) => {
  const timestamp = new Date(timestampString);
  const seconds = Math.floor((new Date() - timestamp) / 1000);
  const interval = Math.floor(seconds / 86400);
  if (interval === 0) {
    return "today";
  } else if (interval === 1) {
    return "yesterday";
  } else {
    return `${interval} days ago`;
  }
};

export const revertTimeStamp = (timestampString) => {
  const timestamp = new Date(timestampString);
  return timestamp.getTime() / 1000;
}

export const formatDaysLeft = (localDateTime) => {
  const localDate = new Date(localDateTime);
  const currentDate = new Date();
  const diffInMs = localDate - currentDate;

  if (diffInMs > 0) {
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    if (diffInDays >= 1) {
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} left`;
    } else {
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInMinutes = Math.floor(
        (diffInMs % (1000 * 60 * 60)) / (1000 * 60)
      );
      return `${diffInHours} hours ${diffInMinutes} minutes left`;
    }
  } else {
    return "Expired";
  }
};

export const formatDaysToStart = (localDateTime) => {
  const localDate = new Date(localDateTime);
  const currentDate = new Date();
  const diffInMs = localDate - currentDate; 
  if (diffInMs > 0) {
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    if (diffInDays >= 1) {
      return `Valid in ${diffInDays} day${diffInDays > 1 ? "s" : ""}`;
    } else {
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInMinutes = Math.floor(
        (diffInMs % (1000 * 60 * 60)) / (1000 * 60)
      );
      return `Valid in ${diffInHours} hours ${diffInMinutes} minutes`;
    }
  } else {
    return "Expired";
  }
};
