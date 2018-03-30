export interface IBibleData {
  book: IBibleBook;
  capter: IBibleCapter;
  verses: IBibleVerse[];
}

export interface IBibleState {
  book: number;
  capter: number;
}

export interface IBibleBook {
  id: number;
  name: string;
  capters: number;
}

export interface IBibleCapter {
  id: number;
  previous?: number;
  next?: number;
}

export interface IBibleVerse {
  id: number;
  capter: number;
  reference: string;
  text: string;
}