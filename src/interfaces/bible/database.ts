
export interface IBibleDatabaseBook {
  id: number;
  livro: string;
  capitulos: number;
}

export interface IBibleDatabaseCapter {
  id: number;
  livro: number;
  referencia: number;
  anterior: number;
  proximo: number;
}

export interface IBibleDatabaseVerse {
  id: number;
  capitulo: number;
  referencia: string;
  texto: string;
}