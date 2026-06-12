const { createClient } = require('@libsql/client');
const path = require('path');

const db = createClient({
  url: `file:${path.resolve(__dirname, 'banco.db')}`,
});

try {
    db.execute(
        `CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            date TEXT NOT NULL,
            time TEXT NOT NULL,
            place TEXT NOT NULL,
            category TEXT NOT NULL,
            seats INTEGER NOT NULL,
            description TEXT NOT NULL
        )`
    )
    console.log("Banco inicializado com sucesso");
} catch (err) {
    console.error("Erro ao inicializar o banco de dados:", err.message);
}

module.exports = db;