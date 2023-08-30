import Calendar, { CalendarProps } from 'react-calendar';
import './styles.css';

// For shortening month name -> Helps in decreasing DatePicker's width
const monthFormatter = (locale: string | undefined, date: Date) =>
  date.toLocaleString(locale, { month: 'short', year: 'numeric' });

export const DatePicker = (props: CalendarProps) => {
  return <Calendar formatMonthYear={monthFormatter} {...props} />;
};
