export interface IInformative {
  id: number;
  title: string;
  date: Date;
  message: string;
  url: string;
  creatorId?: number;
  churchId?: number;
  typeId: number;

  icon?: string;
}
