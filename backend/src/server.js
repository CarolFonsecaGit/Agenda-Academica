const express = require('express');
const cors = require('cors');
const app = express();

const eventRoutes = require('./routes/eventRoutes');

app.use(cors());
app.use(express.json());

app.use('/api/events', eventRoutes);
app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});