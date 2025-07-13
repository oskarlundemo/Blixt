import moment from 'moment-timezone';
import 'moment/locale/sv';


/**
 * This component is used for separating message by date,
 * creating a more UI friendly chat experience
 *
 * @param date object that will be parsed
 * @returns {JSX.Element}
 * @constructor
 */


export const MessageSplitter = ({ date }) => {

    const inputDate = moment.tz(date, 'dddd D MMMM YYYY', 'Europe/Stockholm').startOf('day');
    const today = moment().tz("Europe/Stockholm").startOf('day');
    const yesterday = moment().tz("Europe/Stockholm").subtract(1, 'day').startOf('day');

    let displayDate;

    // If the date is the same as today, show yesterday
    if (inputDate.isSame(yesterday)) {
        displayDate = "Yesterday";
    } else {
        displayDate = inputDate.locale('sv').format('D MMMM YYYY');
    }

    return (
        <div className="message-splitter">
            <h4>{displayDate}</h4>
        </div>
    );
};