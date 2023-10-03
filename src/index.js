const express = require("express");
const app = express();
app.use(express.json());
const rotas = require("./rotas");
app.use(rotas);
const porta = 8081;

app.listen(porta, () => console.log(`Rodando em http://localhost:${porta}`));
