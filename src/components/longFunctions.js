import axios from "axios";

export const handleRegister = async (e, credentials, role, config, toast, history) => {
  e.preventDefault();
  if (
    !credentials.name ||
    !credentials.email ||
    !credentials.password ||
    !credentials.confirmPassword
  ) {
    return toast({
      title: "Please enter all the fields!",
      status: "error",
      duration: 3000,
      isClosable: true,
      position: "bottom",
    });
  }
  if (credentials.password !== credentials.confirmPassword) {
    return toast({
      title: "Passwords do not match!",
      status: "error",
      duration: 3000,
      isClosable: true,
      position: "bottom",
    });
  }
  try {
    await axios.post(
      "https://e-commerce-production-43d5.up.railway.app/api/auth/register",
      {
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
        role: role,
      },
      config
    );
    history.push("/login")
  } catch (error) {
    return toast({
      title: "An error occured while trying to register",
      status: "error",
      duration: 3000,
      isClosable: true,
      position: "bottom",
    });
  }
};

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