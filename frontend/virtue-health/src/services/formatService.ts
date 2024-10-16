export const formatDate = (date: Date): Date => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Ensure two-digit month
    const day = date.getDate().toString().padStart(2, '0'); // Ensure two-digit day

    const formattedDateString = `${year}-${month}-${day}`;
    return new Date(formattedDateString);
};


export const calculateAge = (dob: Date): number => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
  
    // If birth month is ahead of current month or it's the current month but the birth date hasn't occurred yet
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
  
    return age;
  };
  
  // Example usage:
  const dob = new Date("1990-10-15");
  console.log(`Age is: ${calculateAge(dob)}`);
  