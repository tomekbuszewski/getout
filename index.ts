interface IDate {
  [index: string]: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface ICompletion {
  start: string;
  finish: string;
  handler: (input: string) => number;
  dateHandler: (input: number) => IDate;
  asPercent?: boolean;
  now?: number | string;
}

const getDate = (humanDate: string): number => {
  const dateArray: string[] = humanDate.split("-");
  const year: number = Number(dateArray[0]);
  const month: number = Number(dateArray[1]) -1; // month starts from 0
  const day: number = Number(dateArray[2]);

  return new Date(year, month, day).getTime();
};

const humanDate = (input: number): IDate => {
  const secondsInitial: number = Math.floor(input / 1000);
  const minutesInitial: number = Math.floor(secondsInitial / 60);
  const hoursInitial: number = Math.floor(minutesInitial / 60);

  return {
    days: Math.floor(hoursInitial / 24),
    hours: hoursInitial % 24,
    minutes: minutesInitial % 60,
    seconds: secondsInitial % 60,
  }
};

const difference = (start: string, finish: string, format?: string, endOfDay?: boolean) => {
  const startDate: number = getDate(start);
  const endDate: number = endOfDay ? getDate(finish) + 86400000 : getDate(finish);
  const differenceInMs: number = endDate - startDate;

  if (format) {
    const formattedDate: IDate = humanDate(differenceInMs);
    return formattedDate[format];
  }

  return differenceInMs;
};

const getPercentage = (partial: number, total: number, asPercent?: boolean): string | number => {
  const result: number = Math.round((partial / total) * 100);

  if (asPercent) {
    return `${result}%`;
  }

  return result;
};

const getCompletion = ({ start, finish, handler, dateHandler, now = Date.now(), asPercent = false }: ICompletion): number | string => {
  const startDate: number = handler(start);
  const nowDate: number = typeof now === "number" ? now : handler(now);

  const daysPassed: number = dateHandler(nowDate - startDate).days;
  const daysInTotal: number = difference(start, finish, "days", true);

  return getPercentage(daysPassed, daysInTotal, asPercent);
};

export {
  difference,
  humanDate,
  getDate,
  getCompletion,
  getPercentage,
}
