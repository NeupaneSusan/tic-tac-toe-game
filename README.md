# Real-Time Tic-Tac-Toe Game

A real-time, multiplayer Tic-Tac-Toe game built using **Node.js**, **Socket.io**, and **Express.js**. This project allows two players to join a game session and play against each other, with live updates and automatic game management.

## Table of Contents
- [Features](#features)
- [Setup](#setup)
- [Socket.io Events](#socketio-events)
- [Project Structure](#project-structure)
- [License](#license)

## Features
- Real-time multiplayer game.
- Players are assigned either `X` or `O` automatically.
- Dynamic reassignment of `X` or `O` if a player disconnects.
- Game resets after a win or a draw.
- Simple and intuitive user interface.
- Scalable using Socket.io for WebSocket communication.

## Setup

1. **Clone the repository:**

    ```bash
    git clone https://github.com/NeupaneSusan/tic-tac-toe-game.git
    cd tic-tac-toe-game
    ```

2. **Install dependencies:**

    Make sure you have Node.js installed. Then run:

    ```bash
    npm install
    ```

3. **Start the server:**

    Run the following command to start the server:

    ```bash
    npm run start
    ```

4. **Access the game:**

    Open a browser and navigate to:

    ```
    http://localhost:3000
    ```

## Socket.io Events

- **`connection`**: When a player connects to the game.
- **`playerAssigned`**: Sent to the player to inform them of their assigned symbol (`X` or `O`).
- **`boardUpdated`**: Sent to all players to update the game board after each move.
- **`makeMove`**: Emitted by a player to make a move.
- **`gameOver`**: Sent to all players when the game is over (either a win or a draw).
- **`disconnect`**: When a player disconnects from the game.
- **`resetGame`**: Resets the game board after a game over.

## Project Structure

```bash
├── public/              # Static files (CSS, client-side JS)
├── src/
│   ├── server.ts        # Main server file
│   └── index.ejs        # HTML template for the game UI
├── package.json         # Project dependencies and scripts
└── README.md            # This file
