// Script to check localStorage for the NOAH application
const checkLocalStorage = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const data = localStorage.getItem('noah_student_data');
    console.log('noah_student_data in localStorage:', data);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        console.log('Parsed data:', parsed);
      } catch (e) {
        console.error('Error parsing localStorage data:', e);
      }
    }
  } else {
    console.log('localStorage not available in this environment');
  }
};

// Run the function
checkLocalStorage();