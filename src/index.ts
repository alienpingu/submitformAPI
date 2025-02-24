import express from "express";
import dotenv from "dotenv";
import handleFormSubmit from "./func/handleFormSubmit";
import setupDatabase from "./func/setupDatabase"

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3210;
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

setupDatabase();

app.get("/", (req, res) => {
    res.send('Form Submit API');
});

app.post("/submit", handleFormSubmit);
app.get("/submit", handleFormSubmit);


app.listen(PORT, () => {
    console.log(`Server in ascolto su http://localhost:${PORT}`);
});
