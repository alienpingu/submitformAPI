import request from "supertest";
import express from "express";

const app = express();
app.get("/", (req, res) => {
    res.send("Ciao dal server Express con TypeScript!");
});

describe("GET /", () => {
    it("risponde con un messaggio di saluto", async () => {
        const response = await request(app).get("/");
        expect(response.text).toBe("Ciao dal server Express con TypeScript!");
        expect(response.status).toBe(200);
    });
});
