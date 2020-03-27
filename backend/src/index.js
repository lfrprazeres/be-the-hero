const express = require("express");
const cors = require('cors');
const routes = require("./routes");

const app = express();

app.use(cors(
    // {
    //     origin: 'http://nomedomeudominio.com' 
    // }
));
// faz o express usar json nas requisições
app.use(express.json());
// usa o router que criamos em router.js
app.use(routes);


app.listen(3333);