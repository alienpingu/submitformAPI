import sqlite3 from "sqlite3";

export default async function setupDatabase() {
  const db = new sqlite3.Database("database.sqlite", (err) => {
    if (err) {
      console.error("Errore durante la connessione al database:", err.message);
    } else {
      console.log("Connessione al database riuscita.");
    }
  });

  db.serialize(() => {
    // Creazione della tabella se non esiste
    db.run(
      `
      CREATE TABLE IF NOT EXISTS submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        timestamp TEXT NOT NULL
      );
      `,
      (err) => {
        if (err) {
          console.error("Errore durante la creazione della tabella:", err.message);
        } else {
          console.log("Tabella 'submissions' configurata correttamente.");
        }
      }
    );
  });

  // Chiudiamo la connessione al database
  db.close((err) => {
    if (err) {
      console.error("Errore durante la chiusura della connessione al database:", err.message);
    } else {
      console.log("Connessione al database chiusa.");
    }
  });
}
