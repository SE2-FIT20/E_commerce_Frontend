import axios from "axios";


export function formatNumber(num) {
  let str = num.toString();
  let result = '';
  let count = 0;
  
  if (str.includes('.')) {
    const parts = str.split('.');
    const integerPart = parts[0];
    const decimalPart = parts[1];
    result = formatIntegerPart(integerPart) + '.' + decimalPart;
  } else {
    result = formatIntegerPart(str);
  }
  
  return result;
}

function formatIntegerPart(str) {
  let result = '';
  let count = 0;
  
  for (let i = str.length - 1; i >= 0; i--) {
    result = str.charAt(i) + result;
    count++;
    
    if (count % 3 === 0 && i !== 0) {
      result = ',' + result;
    }
  }
  
  return result;
}

export function handleClickOutside(event, setOpen, ref) {
  if (ref.current && !ref.current.contains(event.target)) {
    setOpen(false);
  }
};

export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}