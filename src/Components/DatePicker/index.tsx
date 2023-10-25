import Calendar, { CalendarProps } from 'react-calendar';
import './styles.css';

// For shortening month name -> Helps in decreasing DatePicker's width
const monthYearFormatter = (locale: string | undefined, date: Date) =>
  date.toLocaleString(locale, { month: 'short', year: 'numeric' });

const monthFormatter = (locale: string | undefined, date: Date) =>
  date.toLocaleString(locale, { month: 'short' });

type DateInput = Date | null;

// Type for date output
export type DateValue = DateInput | [DateInput, DateInput];

export const DatePicker = (props: CalendarProps) => {
  return (
    <Calendar
      formatMonthYear={monthYearFormatter}
      formatMonth={monthFormatter}
      minDetail="decade"
      {...props}
    />
  );
};
