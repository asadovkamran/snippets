import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    let className = 'square ' + props.class;
    return (
            <button className={className} onClick={props.onClick}>
                {props.value}
            </button>
    )
}
class Board extends React.Component {
    renderSquare(i) {
        let isWinnerSquare = this.props.winnerLine.indexOf(i) !== -1 ? true : false;
        return <Square class={isWinnerSquare ? 'highlight' : ''}  value={this.props.squares[i]} onClick={()=>this.props.onClick(i)} />;
  }

  render() {
      const grid = [
          [0,1,2],
          [3,4,5],
          [6,7,8]
      ];

      const map = grid.map((line) => <div class="board-row">{line.map((item) => this.renderSquare(item) )}</div>);

      return (
      <div>
          {map}
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
            xIsNext: true,
            stepNumber: 0,
            coordinates: [[null, null]],
            isMoveListOrderAsc: true,
        };
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    sortMoveList() {
        this.setState({
            isMoveListOrderAsc: !this.state.isMoveListOrderAsc
        });
    }


    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const coordinates = this.state.coordinates.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
            coordinates: coordinates.concat([calculateCoordinates(i)]),
        });
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);
      const coordinates = this.state.coordinates;
      const moves = history.map((step, move) => {
          const desc = move ?
                'Go to move #' + move :
                'Go to game start';
          return (
                  <li key={move} class={this.state.stepNumber === move ? 'current-step' : ''}>
                  <button onClick={()=>this.jumpTo(move)}>{desc}</button>
                    <span>row: {coordinates[move][0] + 1}; column: {coordinates[move][1] + 1}</span>
                  </li>
          );
      });

      let status;
      if (winner) {
          status = 'Winner: ' + winner.player;
      }else if (current.squares.indexOf(null) === -1) {
          status = 'Draw.';
      } else {
          status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }

    return (
      <div className="game">
        <div className="game-board">
            <Board
        winnerLine={winner ? winner.line : []}
        squares={current.squares}
        onClick={(i) => this.handleClick(i)}
            />
        </div>
        <div className="game-info">
            <div>{ status }</div>
            <button onClick={()=>this.sortMoveList()}>Toggle move list order</button>
            <ol>{this.state.isMoveListOrderAsc ? moves : moves.reverse()}</ol>
        </div>
      </div>
    );
  }
}

function calculateCoordinates(index) {
    const grid = [
        [0,1,2],
        [3,4,5],
        [6,7,8]
    ];

    for (let i = 0; i < grid.length; i++) {
        if (grid[i].indexOf(index) !== -1) {
            return [i, grid[i].indexOf(index)];
        }
    }
}

function calculateWinner(squares) {
    const lines = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a,b,c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {
                line: lines[i],
                player: squares[a]
            };
        }
            }
    return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
