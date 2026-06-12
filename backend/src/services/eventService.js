const db = require("../db")

const eventService = {
    async getEvents(req, res) {
        db.execute(
            `SELECT * FROM events`,
            [],

            (err, rows) => {
                if (err) {
                    res.status(500).json(err);
                } else {
                    res.json(rows);
                }
            }
        )
    },

    async createEvent(req, res) {
        const { title, date, time, place, category, seats, description } = req.body;

        db.execute(
            `INSERT INTO events(title, date, time, place, category, seats, description)
            VALUES(?, ?, ?, ?, ?, ?, ?)`
            [title, date, time, place, category, seats, description],

            function(err) {
                if (err) {
                    res.status(500).json(err);
                } else {
                    res.status(201).json({
                        id: this.lastID,

                        title,
                        date,
                        time,
                        place,
                        category,
                        seats,
                        description
                    });
                }
            }
        )
    },

    async updateEvent(req, res) {
        const { id, title, date, time, place, category, seats, description } = req.body;

        db.execute(
            `UPDATE events SET title = ?, date = ?, time = ?, place = ?, category = ?, seats = ?, description = ?
            WHERE id = ?`,

            [title, date, time, place, category, seats, description, id],

            function(err) {
                if (err) {
                    res.status(500).json(err);
                } else {
                    res.json({
                        message: "Evento atualizado",
                    });
                }
            }
        )
    },

    async deleteEvent(req, res) {
        const id = req.body.id;

        db.execute(
            `DELETE FROM events WHERE id = ?`,
            
            [id],

            function(err) {
                if (err) {
                    res.status(500).json(err);
                } else {
                    res.json({
                        message: "Evento removido",
                    });
                }
            }
        )
    }
};

module.exports = eventService;