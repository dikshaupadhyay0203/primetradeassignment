export const sanitizeString = (value) => {
  if (typeof value !== 'string') return '';
  return value.replace(/<[^>]*>/g, '').trim();
};

export const sanitizeEmail = (value) => {
  return sanitizeString(value).toLowerCase();
};
