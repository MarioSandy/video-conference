function parseTime(date) {
  const checkDate = new Date(date);
  if (checkDate instanceof Date && !isNaN(checkDate)) {
    const offset = date.getTimezoneOffset();
    const newDate = new Date(date.getTime() + offset);
    const hours =
      newDate.getHours() < 10 ? `0${newDate.getHours()}` : newDate.getHours();
    const minutes =
      newDate.getMinutes() < 10
        ? `0${newDate.getMinutes()}`
        : newDate.getMinutes();
    const time = hours + ":" + minutes;

    return time;
  }
  return null;
}

module.exports = {
  parseTime,
};
