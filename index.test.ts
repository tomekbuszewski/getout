import {
  difference,
  getCompletion,
  getDate,
  getPercentage,
  humanDate,
} from "./index";

describe("GetOut tests", () => {
  it ("should return proper difference between dates", () => {
    expect(difference("2019-01-01", "2019-01-31")).toBe(2592000000);
    expect(difference("2019-01-01", "2019-01-31", "days")).toBe(30);
    expect(difference("2019-01-01", "2019-01-31", "days", true)).toBe(31);
  });

  it ("should return proper days count", () => {
    expect(humanDate(2592000000)).toMatchObject({ days: 30, hours: 0, minutes: 0, seconds: 0 });
  });

  it ("should return date in milliseconds", () => {
    expect(getDate("2019-01-01")).toBe(1546297200000);
  });

  it ("should count percentage", () => {
    expect(getPercentage(2, 4)).toBe(50);
    expect(getPercentage(2, 4, true)).toBe("50%");
  });

  it ("should return proper completion in percents", () => {
    expect(getCompletion({
      asPercent: false,
      dateHandler: humanDate,
      dateServer: getDate,
      diffHandler: difference,
      finish: "2019-02-28",
      now: "2019-02-14",
      start: "2019-02-01",
    })).toBe(46);

    expect(getCompletion({
      asPercent: true,
      dateHandler: humanDate,
      dateServer: getDate,
      diffHandler: difference,
      finish: "2019-02-28",
      now: "2019-02-14",
      start: "2019-02-01",
    })).toBe("46%");

    expect(getCompletion({
      dateHandler: humanDate,
      dateServer: getDate,
      diffHandler: difference,
      finish: "2019-02-28",
      start: "2019-02-01",
    })).toBeLessThanOrEqual(100);
  });
});
