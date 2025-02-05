import { formatDay } from 'date-fns';

let closure = 0;
const DayCell = (props) => {
  if (closure === 0) {
    console.log('daycell props', props);
    closure++;
  }
  return <td {...props.tdProps}></td>
}

export default DayCell;