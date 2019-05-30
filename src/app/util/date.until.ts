import { isDate, isValid, isFuture, differenceInYears, parse } from 'date-fns';

export const isVaildDate = (val: string): boolean => {
  const date = parse(val)
  return isDate(date)
    && isValid(date)
    && !isFuture(date)
    && differenceInYears(Date.now(), date) < 150;
}