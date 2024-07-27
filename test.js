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
    const { command, response_url, text } = req.body;

    if (command === '/wtp') {
        const parts = text.split(' ');
        const action = parts[1];

        if (action === 'record') {
            // Assuming command format: /wtp record <account>
            const account = parts[2] || 'default'; // default if not provided

            // Extract user details from Slack request (for demonstration purpose)
            const { user_id, user_name, user_email } = req.body;

            // Confirm with the user (you may implement more sophisticated confirmation logic)
            const confirmationMessage = `Are you sure you want to record your access with account ${account}?`;

            // Example of asking for confirmation via Slack
            await axios.post(response_url, {
                response_type: 'ephemeral', // only visible to the user
                text: confirmationMessage,
                attachments: [{
                    text: 'Yes or No?',
                    fallback: 'You are unable to confirm.',
                    callback_id: 'confirm_record',
                    actions: [
                        { name: 'confirm', text: 'Yes', type: 'button', value: 'yes' },
                        { name: 'confirm', text: 'No',  type: 'button', value: 'no' }
                    ]
                }]
            });

            res.status(200).send();
        } else {
            res.status(400).send('Bad Request');
        }
    } else if (command === '/confirm_record') {
        // Handle confirmation from user (assuming it's a button interaction)
        const { actions, user } = req.body;
        const { value } = actions[0];

        if (value === 'yes') {
            // Assuming user_id, user_name, user_email are extracted from Slack payload
            const newRecord = {
                name: user_name,
                email: user_email,
                account: parts[2] || 'default', // default if not provided
                time: new Date().toISOString() // current timestamp
            };

            // Add new record to data array
            data.push(newRecord);

            // Update data.json file
            fs.writeFile('data.json', JSON.stringify(data, null, 2), err => {
                if (err) {
                    console.error('Error writing to data.json:', err);
                    res.status(500).send('Internal Server Error');
                    return;
                }
                console.log('Data updated successfully.');
                res.status(200).send('Recorded successfully!');
            });
        } else {
            res.status(200).send('Record canceled.');
        }
    } else {
        res.status(400).send('Bad Request');
    }
});

app.listen(port, () => {
    console.log(`SlackApp listening at http://localhost:${port}`);
});
