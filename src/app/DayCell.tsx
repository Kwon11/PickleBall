import { format } from 'date-fns';

let closure = 0;
const DayCell = (props) => {
  if (closure === 0) {
    console.log('daycell props', props);
    closure++;
  }
  return <td className={'rdp-day'}>{format(props.day.date, 'd')}</td>
}

export default DayCell;