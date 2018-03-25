import { IBibleBook } from './book';
import { IBibleCapter } from './capter';
import { IBibleVerse } from './verse';

export interface IBibleData {
  book: IBibleBook;
  capter: IBibleCapter;
  verses: IBibleVerse[];
}