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
    const { command, response_url, text, user_name, user_email } = req.body;
    console.log(`Body :${JSON.stringify(req.body)}`)

    if (command.startsWith('/wtp_record')) {
        let accountType = 'aws'; // default account type

        // Extract accountType from the command if provided
        const commandParts = text.split(' ');
        console.log(`Command parts : ${commandParts}`)
        if (commandParts.length > 2) {
            res.status(400).send('Bad Request: Too many parameters');
            return;
        } else if (commandParts.length === 2) {
            accountType = commandParts[1];
        }

        // Use user_name from Slack payload
        const name = user_name;
        const email = user_email; // Example email
        const time = new Date().toISOString(); // Current timestamp

        // Construct new record
        const newRecord = {
            name,
            email,
            account: accountType,
            time
        };

        // Append new record to data array
        data.push(newRecord);

        // Update data.json file with new data
        fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
            if (err) {
                console.error('Error writing data to file:', err);
                res.status(500).send('Internal Server Error');
                return;
            }
            console.log('Data written to data.json');
        });

        // Respond with user's name
        res.status(200).send(`Record added successfully for ${name}`);
    } else if (command === '/wtp') {
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
