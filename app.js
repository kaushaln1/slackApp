const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Load data from the dummy file
let data = [];
fs.readFile('data.json', 'utf8', (err, fileData) => {
    if (err) {
        console.error('Error reading the data file:', err);
        return;
    }
    data = JSON.parse(fileData);
});

// Endpoint to respond with the data
app.get('/who-took-par', (req, res) => {
    res.json(data);
});

// Endpoint to handle Slack slash command
app.post('/slack/events', async (req, res) => {
    const { command, response_url } = req.body;

    if (command === '/wtp') {
        try {
            const response = await axios.get('http://localhost:3000/who-took-par');
            const parData = response.data;

            let message = "PAR Access Details:\n";
            parData.forEach(person => {
                message += `Name: ${person.name}\nEmail: ${person.email}\nAccount: ${person.account}\nTime: ${person.time}\n\n`;
            });

            await axios.post(response_url, {
                response_type: 'in_channel',
                text: message
            });

            res.status(200).send();
        } catch (error) {
            console.error('Error fetching PAR data:', error);
            res.status(500).send('Internal Server Error');
        }
    } else {
        res.status(400).send('Bad Request');
    }
});

app.listen(port, () => {
    console.log(`SlackApp listening at http://localhost:${port}`);
});
