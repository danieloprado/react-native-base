export abstract class BaseDatabase {
  private db: any;

  constructor(name: string, readOnly: boolean) {
    // this.db = SQLite.openDatabase({
    //   name,
    //   readOnly,
    //   createFromLocation: `~${name}.sqlite`
    // }, () => { }, (err: any) => {
    //   console.error(err);
    //   logService.breadcrumb('trying to open database ' + name);
    //   logService.handleError(err);
    // });
  }

  protected query<T>(sql: string, params: any[] = []): Promise<T> {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx: any) => {
        tx.executeSql(sql, params, (tx: any, result: any) => {
          resolve(result.rows.raw());
        }, (tx: any, error: any) => {
          reject(error);
        });
      });
    });
  }
}