import SQLite from 'react-native-sqlite-storage';
import { Observable, ReplaySubject, Subject } from 'rxjs';

import logService from '../services/log';
import { theme } from '../theme';

export abstract class BaseDatabase {
  private db$: ReplaySubject<any>;

  constructor(name: string, readOnly: boolean) {
    this.db$ = new ReplaySubject(1);

    const db = SQLite.openDatabase({
      name: `${name}.sqlite`,
      readOnly,
      createFromLocation: theme.platform === 'ios' ? 1 : `~${name}.sqlite`
    }, () => {
      this.db$.next(db);
    }, (err: any) => {
      console.error(err);
      logService.breadcrumb('trying to open database ' + name);
      logService.handleError(err);
    });

  }

  protected query<T = any[]>(sql: string, params: any[] = []): Observable<T> {

    return this.db$.switchMap(db => {
      const subject$ = new Subject<T>();

      db.executeSql(sql, params, (result: any) => {
        subject$.next(result.rows.raw());
        subject$.complete();
      }, (error: any) => {
        subject$.error(error);
      });

      return subject$.asObservable();
    });
  }
}