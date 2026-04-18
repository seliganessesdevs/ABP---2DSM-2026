export const formatDateTime = (iso: string): string => {
  const date = new Date(iso);
  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  }).format(date);
  const formattedTime = new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit', minute: '2-digit'
  }).format(date);
  return `${formattedDate} às ${formattedTime}`;
}

export const formatDate = (iso: string): string => {
  const date = new Date(iso);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  }).format(date);
}

export const durationInMinutes = (start: string, end: string): number => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return Math.round((endDate.getTime() - startDate.getTime()) / 60000);
}
