export enum TimeUnits {
  Millisecond = 1,
  Second = 1000 * 1,
  Minute = 1000 * 60,
  Hour = 1000 * 60 * 60,
  Day = 1000 * 60 * 60 * 24,
  Year = 1000 * 60 * 60 * 24 * 365,
}

export const Milliseconds = TimeUnits.Millisecond;
export const Seconds = TimeUnits.Second;
export const Minutes = TimeUnits.Minute;
export const Hours = TimeUnits.Hour;
export const Days = TimeUnits.Day;
export const Years = TimeUnits.Year;
