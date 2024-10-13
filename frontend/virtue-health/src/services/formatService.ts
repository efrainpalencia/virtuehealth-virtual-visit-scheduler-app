export const formatDate = (date: Date): Date => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Ensure two-digit month
    const day = date.getDate().toString().padStart(2, '0'); // Ensure two-digit day

    const formattedDateString = `${year}-${month}-${day}`;
    return new Date(formattedDateString);
};
