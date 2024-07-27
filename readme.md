---

# SlackApp - PAR Access Query

## Overview

SlackApp is a Node.js application integrated with Slack, designed to respond to the query "who took par?" by retrieving and displaying the name, email, and time of PAR access from the PAR granting server.

## Features

- **Slack Integration:** Seamlessly integrates with Slack to provide real-time responses.
- **PAR Access Query:** Retrieves and displays information about the person who took PAR access.
- **Node.js Powered:** Built with Node.js for efficient and scalable performance.

## Prerequisites

- **Node.js:** Ensure you have Node.js installed on your system. You can download it from [here](https://nodejs.org/).
- **Slack App:** Create a Slack App and obtain the necessary credentials.
- **PAR Granting Server:** Ensure you have access to the PAR granting server and the necessary API endpoints.

## Installation

1. **Clone the Repository:**
    ```bash
    git clone https://github.com/yourusername/slackapp-par-query.git
    cd slackapp-par-query
    ```

2. **Install Dependencies:**
    ```bash
    npm install
    ```

3. **Set Up Environment Variables:**
    Create a `.env` file in the root directory and add the following variables:
    ```env
    SLACK_BOT_TOKEN=xxxx
    PORT=3000
    ```

## Usage

1. **Start the Application:**
    ```bash
    npm start
    ```

2. **Add the Bot to Your Slack Workspace:**
    Invite the bot to the desired Slack channel or direct message.

3. **Query PAR Access:**
    In the Slack channel or direct message where the bot is present, type:
    ```plaintext
    who took par?
    ```
4. **Configure the Slack Command:**
    - Go to the [Slack API: Apps](https://api.slack.com/apps) page and select your app.
    - In your app settings, go to "Slash Commands."
    - Click "Create New Command."
      - Command: `/wtp`
      - Request URL: `http://yourdomain.com/slack/events` (replace with your actual endpoint URL)
      - Short Description: "Get PAR access details"
      - Save the command.

5. **Install the App to Your Workspace:**
    - Go to "Install App" in the Slack app settings.
    - Click "Install App to Workspace" and authorize the app.

6. **Query PAR Access:**
    In the Slack channel or direct message where the bot is present, type:
    ```plaintext
    /wtp
    ```

7. **Response:**
    The bot will respond with the name, email, account, and time of the person who took PAR access.

## Contributing

We welcome contributions! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b my-feature-branch`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-feature-branch`
5. Submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
