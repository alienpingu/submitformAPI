import express from "express";
import dotenv from "dotenv";

const app = express();
const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => {
    res.send('Ciao dal server Express con TypeScript!');
});

app.listen(PORT, () => {
    console.log(`Server in ascolto su http://localhost:${PORT}`);
});
