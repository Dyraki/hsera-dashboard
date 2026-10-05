export const formatIndonesianDate = (date: Date | string): string => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'long'
  }).format(d);
};
