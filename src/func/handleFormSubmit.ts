import { Request, Response } from "express";
import sqlite3 from "sqlite3";

// Initialize SQLite database
export const database = new sqlite3.Database("database.sqlite", (err) => {
  if (err) {
    console.error("Errore durante l'inizializzazione del database:", err.message);
  } else {
    console.log("Database connesso correttamente.");
  }
});

// Form submission handler
async function handleFormSubmit(req: Request, res: Response): Promise<void> {
  try {
    if (req.method !== "POST") {
      res.status(405).send({ error: "Metodo non consentito, usa POST." });
      return;
    }

    const { name, email, message } = req.body;

    // Input validation
    if (!name || !email || !message) {
      res.status(400).send({
        error: "Tutti i campi (name, email, message) sono obbligatori.",
      });
      return;
    }

    if (!validateEmail(email)) {
      res.status(400).send({ error: "Email non valida." });
      return;
    }

    const timestamp = new Date().toISOString();

    // Insert into the database
    const insertQuery =
      "INSERT INTO submissions (name, email, message, timestamp) VALUES (?, ?, ?, ?)";

    database.run(insertQuery, [name, email, message, timestamp], function (err) {
      if (err) {
        console.error("Errore durante l'inserimento nel database:", err.message);
        res.status(500).send({ error: "Errore del server." });
        return;
      }

      console.log(`Nuovo record aggiunto con ID: ${this.lastID}`);
      res.status(200).send({ message: "Form inviato con successo." });
    });
  } catch (error) {
    console.error("Errore durante il salvataggio del form:", error);
    res.status(500).send({ error: "Errore del server." });
  }
}

// Utility function to validate email format
function validateEmail(email: string): boolean {
  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export default handleFormSubmit;
