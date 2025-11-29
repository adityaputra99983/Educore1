// Script to clear localStorage for the NOAH application
const clearLocalStorage = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.removeItem('noah_student_data');
    console.log('Cleared noah_student_data from localStorage');
  } else {
    console.log('localStorage not available in this environment');
  }
};

// Run the function
clearLocalStorage();