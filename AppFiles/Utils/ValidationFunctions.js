// name validation function
export const handleNameValidation = val => {
  let pattern = /^[a-zA-Z]{2,40}( [a-zA-Z]{2,40})+$/;
  if (pattern.test(val) === false) {
    setNameErrorMessage('enter a valid name');
    return;
  }
  setNameErrorMessage('');
  return;
};

//Email validation function
export const handleEmailValidation = val => {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  if (val.length === 0) {
    setEmailErrorMessage('email field is empty');
    return;
  } else if (reg.test(val) === false) {
    setEmailErrorMessage('enter valid email address');
    return;
  }
  if (reg.test(val) === true) {
    setEmailErrorMessage('');
    return;
  }
  return;
};
