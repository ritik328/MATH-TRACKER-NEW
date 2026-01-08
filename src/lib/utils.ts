export const formatDate = (date: Date) => date.toISOString().split('T')[0];

export const getDaysDiff = (date1: Date, date2: Date) => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
};
