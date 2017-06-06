import dateFormatter from './date';
import lodash from 'lodash';

export default function eventListFormatter(events) {
  if (!events.length) return [];
  return addDivider(lodash.orderBy(reduceByDate(events), ['beginDate', 'event.title']));
}

function reduceByDate(events) {
  return events.reduce((acc, event) => {
    Array.prototype.push.apply(acc, event.dates.map(d => {
      d.event = event;
      return d;
    }));
    return acc;
  }, []);
}

function addDivider(eventDates) {
  let lastMonth = null,
    lastDate = null;

  return eventDates.reduce((acc, eventDate) => {
    if (!lastDate || !isSameDate(lastDate, eventDate.beginDate)) {
      lastDate = eventDate.beginDate;
      eventDate.firstOfDate = true;
    }

    if (!lastMonth || !isSameMonth(lastMonth, eventDate.beginDate)) {
      acc.push({ date: eventDate.beginDate, divider: true });
      lastMonth = eventDate.beginDate;
    }

    acc.push(eventDate);
    return acc;
  }, []);

}

function isSameMonth(date1, date2) {
  return comparer(date1, date2, 'YYYY-MM');
}

function isSameDate(date1, date2) {
  return comparer(date1, date2, 'YYYY-MM-DD');
}

function comparer(date1, date2, format) {
  const date1Formatted = dateFormatter.format(date1, format);
  const date2Formatted = dateFormatter.format(date2, format);

  return date1Formatted === date2Formatted;
}