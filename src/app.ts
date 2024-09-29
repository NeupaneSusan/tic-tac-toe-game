import express, { Request, Response } from 'express';
import http from 'http';
import path from 'path';
import { Server } from "socket.io";
import { Player } from './interface/player_interface';  

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.set('view engine', 'ejs');
app.set('view options', { layout: false });
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

const port = 3000;

app.get('/', (req: Request, res: Response) => {
  res.render('index');
});

// Game variables
let gameBoard: Array<'X' | 'O' | null> = Array(9).fill(null);
let currentPlayer: 'X' | 'O' | null = null;
const players: Record<string, Player> = {};  
let isComplete:boolean = false

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],  
  [0, 3, 6], [1, 4, 7], [2, 5, 8],  
  [0, 4, 8], [2, 4, 6]              
];

function checkWinner(board: Array<'X' | 'O' | null>, symbol: 'X' | 'O'): boolean {
  return winningCombinations.some(combination =>
    combination.every(index => board[index] === symbol)
  );
}

function checkDraw(board: Array<'X' | 'O' | null>): boolean {
  return board.every(cell => cell !== null);
}


io.on('connection', (socket) => {
  if (Object.keys(players).length < 2) {
    let symbol: 'X' | 'O';
    if (!Object.values(players).find(player => player.symbol === 'X')) {
      symbol = 'X'; 
    } else {
      symbol = 'O'; 
    }
    players[socket.id] = { id: socket.id, symbol }; 
    currentPlayer = 'X'; 
    socket.emit('playerAssigned', symbol);
    io.emit('boardUpdated', { board: gameBoard, currentPlayer }); 
    
   
  } else {
    socket.emit('gameFull');  
    return;
  }

  // Handle player disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id);
    if (players[socket.id]) {
      delete players[socket.id];  
      gameBoard = Array(9).fill(null);  
    }
   
  });

  socket.on('resetGame', () => {
    gameBoard = Array(9).fill(null); // Reset the game board
    currentPlayer = 'X';
    isComplete = false // Set the current player to 'X' again
    io.emit('boardUpdated', { board: gameBoard, currentPlayer });
  });

  // Handle player move
  socket.on('makeMove', (index: number) => {
    if (gameBoard[index] === null && players[socket.id] && players[socket.id].symbol === currentPlayer && !isComplete) {
      gameBoard[index] = players[socket.id].symbol;  
      if (checkWinner(gameBoard, players[socket.id].symbol)) {
        io.emit('gameOver', { winner: players[socket.id].symbol, board: gameBoard });
        isComplete = true;
        return;
      }
      if(checkDraw(gameBoard)){
        io.emit('gameOver', { winner: null, board: gameBoard });
        isComplete = true;
        return;
      }
      currentPlayer = currentPlayer == 'X' ? 'O' : 'X'; 
      io.emit('boardUpdated', { board: gameBoard, currentPlayer });
    }
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});