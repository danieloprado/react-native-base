import { BaseDatabase } from './base';
import { Observable } from 'rxjs';
import { IBibleBook } from '../interfaces/bible/book';

interface ILivro {
  id: number;
  livro: string;
  capitulos: number;
}

export class BibleDatabase extends BaseDatabase {
  constructor() {
    super('bible', true);
  }

  public listBooks(): Observable<IBibleBook[]> {
    return Observable.of(true)
      .switchMap(() => {
        const promise = this.query<ILivro[]>('SELECT * FROM livros');
        return Observable.fromPromise(promise);
      }).map(livros => {
        return livros.map(livro => {
          return {
            id: livro.id,
            name: livro.livro,
            capters: livro.capitulos
          };
        });
      });
  }
}

const bibleDatabase = new BibleDatabase();
export default bibleDatabase;