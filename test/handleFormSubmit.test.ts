import request from "supertest";
import express, { Express } from "express";
import handleFormSubmit, { database } from "../src/func/handleFormSubmit";

const app: Express = express();
app.use(express.json()); // Middleware per gestire JSON nel corpo delle richieste
app.post("/submit", handleFormSubmit);
app.get("/submit", handleFormSubmit);

describe("handleFormSubmit", () => {
    beforeAll((done) => {
        // Creazione della tabella di test
        database.run(
            `
      CREATE TABLE IF NOT EXISTS submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        timestamp TEXT NOT NULL
      )
    `,
            (err) => {
                if (err) {
                    console.error("Errore durante la configurazione del database:", err);
                }
                done();
            }
        );
    });

    afterAll((done) => {
        // Pulizia del database dopo i test
        database.run("DROP TABLE submissions", (err) => {
            if (err) {
                console.error("Errore durante la pulizia del database:", err);
            }
            database.close(); // Chiudiamo il database
            done();
        });
    });

    it("dovrebbe rispondere con 200 per una richiesta valida", async () => {
        const response = await request(app)
            .post("/submit")
            .send({
                name: "Mario Rossi",
                email: "mario.rossi@example.com",
                message: "Questo è un messaggio di test.",
            });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: "Form inviato con successo.",
        });
    });

    it("dovrebbe rispondere con 400 se i campi sono mancanti", async () => {
        const response = await request(app).post("/submit").send({
            name: "Mario Rossi",
            email: "mario.rossi@example.com",
            // Il campo message è mancante
        });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            error: "Tutti i campi (name, email, message) sono obbligatori.",
        });
    });

    it("dovrebbe rispondere con 400 per un'email non valida", async () => {
        const response = await request(app).post("/submit").send({
            name: "Mario Rossi",
            email: "mario.rossi", // Email non valida
            message: "Questo è un messaggio di test.",
        });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            error: "Email non valida.",
        });
    });

    it("dovrebbe rispondere con 405 se il metodo non è POST", async () => {
        const response = await request(app).get("/submit"); // GET invece di POST

        expect(response.status).toBe(405);
        expect(response.body).toEqual({
            error: "Metodo non consentito, usa POST.",
        });
    });

    it("dovrebbe rispondere con 500 in caso di errore del database", async () => {
        // Simulazione di errore del database
        jest.spyOn(database, "run").mockImplementationOnce((_, __, callback) => callback(new Error("Errore simulato")));

        const response = await request(app).post("/submit").send({
            name: "Mario Rossi",
            email: "mario.rossi@example.com",
            message: "Questo è un messaggio di test.",
        });

        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            error: "Errore del server.",
        });

        // Ripristina il comportamento originale di database.run
        jest.restoreAllMocks();
    });
});
