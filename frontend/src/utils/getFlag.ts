import dayjs from "dayjs";

interface Flag {
  flag: boolean;
  message: string;
  color: string;
}
 
function getFlag(dueDate: string, status: string, priority: string): Flag {
  const dayToday = dayjs();
  const dueAt = dayjs(dueDate);
  const hoursDifference = dueAt.diff(dayToday, 'hour');

    if ((status !== 'Completed' && status !== 'Cancelled') && hoursDifference <= 0) {
    return { flag: true, message: 'Overdue: Flagged if due date has exceeded.', color: "#CA0061" };
  }
 
  if (priority === 'Critical' && (status !== 'Completed' && status !== 'Cancelled') && hoursDifference <= 48) {
    return { flag: true, message: 'Critical priority: Flagged 48 hours before due date.', color: "#EB0000" };
  }
 
  if ((status !== 'Completed' && status !== 'Cancelled') && hoursDifference <= 24) {
    return { flag: true, message: 'Not completed: Flagged 24 hours before due date.', color: "#009292" };
  }
 
  return { flag: false, message: 'No flag.', color: "#272D32" };
}
 
export default getFlag;