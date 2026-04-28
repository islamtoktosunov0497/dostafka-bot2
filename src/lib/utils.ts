export const formatPrice = (price: number): string => {
  return price.toLocaleString() + " so'm";
};

export const cn = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ');
};
