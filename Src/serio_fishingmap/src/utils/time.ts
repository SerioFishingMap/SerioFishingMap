export const timeStringToDate = (time: string, baseDate = new Date()) => {
  const [hh, mm, ss] = time.split(":").map(Number);
  const d = new Date(baseDate);
  d.setHours(hh || 0, mm || 0, ss || 0, 0);
  return d;
};

export const isValidTimeString = (time: string, withSeconds = false) => {
  const re = withSeconds
    ? /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/
    : /^([01]\d|2[0-3]):([0-5]\d)$/;
  return re.test(time);
};
