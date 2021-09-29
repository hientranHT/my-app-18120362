import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// class Square extends React.Component {

//   constructor(props) {
//     super(props);
//   }

//   render() {
//     return (
//       <button
//       className="square"
//       onClick={() => this.props.onClick()}
//       >
//       {this.props.value}
//       </button>
//     );
//   } 
// }

function Square(props) {
  return (
    <button
      className={"square " + (props.isWinning ? "square--winning" : null)}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        isWinning={this.props.winningSquares.includes(i)}
        key={"square " + i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }
  
  element(i,n){
    let elements=[];
    for (let j = 0; j < n; j++) {
      elements.push(this.renderSquare(n*i+j));
    }
    return elements
  }

  render() {
    const n=this.props.numbers;
    console.log(this.props.numbers);
    let board=[];
    for (let i = 0; i < n; i++) {
        board.push(
        <div className="board-row">
          {this.element(i,n)}
        </div>)
    }
    return (
      <div>
        <div className="board-row">
          {board}
        </div>
      </div>
  );
  } 
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      isDescending: true,
      istype3x3:true,
      numbers: 3,
    };
  }
  handleClick(i) {
    const locations3x3 = [
      [1, 1],
      [2, 1],
      [3, 1],
      [1, 2],
      [2, 2],
      [3, 2],
      [1, 3],
      [2, 3],
      [3, 3]
    ];

    const locations5x5 = [
      [1, 1],
      [2, 1],
      [3, 1],
      [4, 1],
      [5, 1],
      [1, 2],
      [2, 2],
      [3, 2],
      [4, 2],
      [5, 5],
      [1, 3],
      [2, 3],
      [3, 3],
      [4, 3],
      [5, 5],
      [1, 4],
      [2, 4],
      [3, 4],
      [4, 4],
      [5, 4],
      [1, 5],
      [2, 5],
      [3, 5],
      [4, 5],
      [5, 5],
    ];

    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if(this.state.numbers===3)
    {
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
    }
    else{
      if (calculateWinner5x5(squares) || squares[i]) {
        return;
      }
    }
   
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        location: this.state.istype3x3 ? locations3x3[i] : locations5x5[i],
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  sortHistory() {
    this.setState({
      isDescending: !this.state.isDescending,
    });
  }

  changType(){
    const temp = this.state.istype3x3? 5:3;
    this.setState({
      istype3x3: !this.state.istype3x3,
      numbers: temp,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = this.state.istype3x3?calculateWinner(current.squares):calculateWinner5x5(current.squares);
    const moves = history.map((step, move) => {
      const desc = move 
      ? "Go to move Step " + move + " ---- " + history[move].location 
      : 'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            {move === this.state.stepNumber ? <b>{desc}</b> : desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner.player;
    }

    else {
      if (CheckDraw(current.squares)) {
        status = 'A Draw Game';
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
      
    }

    return (
      <div className="game">
        <div className="game-board">
          {this.state.istype3x3 ? 
          <Board
            winningSquares={winner ? winner.line : []}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            numbers={this.state.numbers}
          /> : 
          <Board
            winningSquares={winner ? winner.line : []}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            numbers={this.state.numbers}
          />}
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{this.state.isDescending ? moves : moves.reverse()}</ol>
            <button onClick={() => this.sortHistory()}>
              Sort by: {this.state.isDescending ? "Descending" : "Asending"}
            </button>
        </div>
        <button onClick={() => this.changType()}>
            Chang Type: {this.state.istype3x3 ? "5X5" : "3X3"}
        </button>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function CheckDraw(squares){
  for (let i = 0; i < squares.length; i++) {
    if(squares[i]==null)
    {
      return false;
    }
  }
  return true;
}
function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { player: squares[a], line: [a, b, c] };
      }
    }
    return null;
}

function calculateWinner5x5(squares) {
    const lines = [
      [0, 1, 2, 3, 4],
      [5, 6, 7, 8, 9],
      [10, 11, 12,13,14],
      [15, 16, 17, 18, 19],
      [20, 21, 22, 23, 24],
      [0, 5, 10, 15, 20],
      [1, 6, 11, 16, 21],
      [2, 7, 12, 17, 22],
      [3, 8, 13, 18, 23],
      [4, 9, 14, 19, 24],
      [0, 6, 12, 18, 24],
      [4, 8, 12, 16, 20],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c, d, e] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] 
        && squares[a] === squares[d] && squares[a] === squares[e]) {
        return { player: squares[a], line: [a, b, c, d, e] };
      }
    }
    return null;
}
