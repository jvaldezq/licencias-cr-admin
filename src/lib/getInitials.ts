export const getInitials = (name?: string): string => {
  if (!name) return '';
  const parts = name.split(' ');
  const firstName = parts[0] || '';
  const lastNameInitial = parts[1]?.charAt(0) || '';
  return `${firstName} ${lastNameInitial}`;
};
