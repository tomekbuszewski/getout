interface IDate {
  [index: string]: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface ICompletion {
  asPercent?: boolean;
  dateHandler: (input: number) => IDate;
  dateServer: (input: string) => number;
  diffHandler: (start: string, finish: string, format?: string, endOfDay?: boolean) => number;
  finish: string;
  now?: number | string;
  start: string;
}

const getDate = (dateSource: string): number => {
  const dateArray: string[] = dateSource.split("-");
  const year: number = Number(dateArray[0]);
  const month: number = Number(dateArray[1]) - 1; // month starts from 0
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
  };
};

const difference = (start: string, finish: string, format?: string, endOfDay?: boolean): number => {
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

const getCompletion = ({
     asPercent = false,
     dateHandler,
     dateServer,
     diffHandler,
     finish,
     now = Date.now(),
     start,
   }: ICompletion): number | string => {
  const startDate: number = dateServer(start);
  const nowDate: number = typeof now === "number" ? now : dateServer(now);

  const daysPassed: number = dateHandler(nowDate - startDate).days;
  const daysInTotal: number = diffHandler(start, finish, "days", true);

  return getPercentage(daysPassed, daysInTotal, asPercent);
};

export {
  difference,
  humanDate,
  getDate,
  getCompletion,
  getPercentage,
};
