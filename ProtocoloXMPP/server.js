const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/send-message', (req, res) => {
    const { message, username } = req.body;
    axios.post('http://localhost:5280/websocket', {
        to: 'room@conference.localhost',
        body: message,
        from: username
    }).then(response => {
        res.sendStatus(200);
    }).catch(error => {
        res.status(500).send('Error sending message');
    });
});

app.get('/get-messages', (req, res) => {
    res.json({ messages: [] });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
