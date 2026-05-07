export type MailEvent = {
  title: string;
  month: string;
  day: string;
  cadence: string;
  time: string;
  location: string;
  note: string;
  days: { label: string; date: string; active?: boolean }[];
};
