import { Observable, ReplaySubject } from 'rxjs';

import { IBibleBook } from '../interfaces/bible/book';
import { IBibleCapter } from '../interfaces/bible/capter';
import { IBibleData } from '../interfaces/bible/data';
import { IBibleDatabaseBook, IBibleDatabaseCapter, IBibleDatabaseVerse } from '../interfaces/bible/database';
import { IBibleState } from '../interfaces/bible/state';
import { IBibleVerse } from '../interfaces/bible/verse';
import storageService from '../services/storage';
import { defaultBible } from '../settings';
import { BaseDatabase } from './base';

export class BibleDatabase extends BaseDatabase {
  private state$: ReplaySubject<IBibleState>;

  constructor() {
    super('bible', true);
    this.state$ = new ReplaySubject(1);

    storageService.get<IBibleState>('bible-state')
      .map(state => state || defaultBible)
      .logError()
      .subscribe(state => this.state$.next(state));

    this.state$
      .distinctUntilChanged()
      .switchMap(state => storageService.set('bible-state', state))
      .logError()
      .subscribe();
  }

  public getBook(id: number): Observable<IBibleBook> {
    return Observable.of(true)
      .switchMap(() => this.query(`SELECT * FROM livros WHERE id = ${id}`))
      .map(data => data[0])
      .map(this.mapBook);
  }

  public listBooks(): Observable<IBibleBook[]> {
    return Observable.of(true)
      .switchMap(() => this.query('SELECT * FROM livros'))
      .map(data => data.map(this.mapBook));
  }

  public getCapter(id: number): Observable<IBibleCapter> {
    return Observable.of(true)
      .switchMap(() => this.query(`SELECT * FROM capitulos WHERE id = ${id}`))
      .map(data => data[0])
      .map(this.mapCapter);
  }

  public listCapters(book: number): Observable<IBibleCapter[]> {
    return Observable.of(true)
      .switchMap(() => this.query(`SELECT * FROM capitulos WHERE book = ${book}`))
      .map(data => data.map(this.mapCapter));
  }

  public listVerses(capter: number): Observable<IBibleVerse[]> {
    return Observable.of(true)
      .switchMap(() => this.query(`SELECT * FROM versiculo WHERE capitulo = ${capter}`))
      .map(data => data.map(this.mapVerse));
  }

  public current(): Observable<IBibleData> {
    return this.state$
      .switchMap(state => Observable.combineLatest(
        this.getBook(state.book),
        this.getCapter(state.capter),
        this.listVerses(state.capter)
      ))
      .map(([book, capter, verses]) => {
        return { book, capter, verses };
      });
  }

  public change(book: number, capter: number): void {
    this.state$.next({ book, capter });
  }

  private mapBook(livro: IBibleDatabaseBook): IBibleBook {
    return {
      id: livro.id,
      name: livro.livro,
      capters: livro.capitulos
    };
  }

  private mapCapter(capitulo: IBibleDatabaseCapter): IBibleCapter {
    return {
      id: capitulo.id,
      reference: capitulo.referencia,
      previous: capitulo.anterior,
      next: capitulo.proximo
    };
  }

  private mapVerse(versiculo: IBibleDatabaseVerse): IBibleVerse {
    return {
      id: versiculo.id,
      reference: versiculo.referencia,
      capter: versiculo.capitulo,
      text: versiculo.texto
    };
  }
}

const bibleDatabase = new BibleDatabase();
export default bibleDatabase;