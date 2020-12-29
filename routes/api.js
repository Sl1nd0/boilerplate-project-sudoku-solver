/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();
  

  app.route('/api/check')
    .post((req, res) => {

     const longStr = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6...';
      console.log(' LENGTH ' + longStr.length);
     //const unitTests = require('../tests/1_unit-tests.js');

    ///unitTests.suit();

       let regex = /^[0-9.]*$/;
       let regex2 = /^[A-I]*$/;
       let regex3 = /^[1-9]*$/;

       let coord1 = '*';
       let coord2 = '*';

      if (req.body.coordinate) {
       coord1 = req.body.coordinate.substring(0, 1);
       coord2 = req.body.coordinate.substring(1, 2);
      }

      var myProp1 = " ";
      var myProp2 = " ";
      var myProp3 = " ";

       let puzzle = req.body.puzzle;
       console.log(' PUZZLE ' + puzzle);
       console.log('   *   ' + coord1 + '  #   ' + coord2);
      // console.log(' YESG ' + '  ' + regex2.test(coord1) + '' + regex3.test(coord2) + ' ' + coord1 + ' ' + coord2);
      let puzzleArr = puzzle.split('');
      let originalBoard = generateBoard(puzzleArr);
      let myValue = 11;
      let rows = 11;
      let cols = 11;

      
      if (req.body.coordinate) {
          rows = myRows(coord1);
      }

      if (req.body.coordinate) {
          cols = coord2 - 1;
      }

      //console.log('  RRRROOOOWWWSS  ' + rows);      
      if (req.body.value) {
        myValue = req.body.value;
      }
      
     // console.log(originalBoard[rows][cols] + ' AS CHECK ');
     solver.validate(req.body.puzzle);

 if (puzzle.length < 81 || puzzle.length > 81) {
      return res.send({error: 'Expected puzzle to be 81 characters long'});
    } else if (regex.test(puzzle) === false) {
      return res.send({error: 'Invalid characters in puzzle'}); 
    } else if ((!req.body.hasOwnProperty('coordinate') || !req.body.hasOwnProperty('value') || !req.body.hasOwnProperty('puzzle')) ||(!req.body.coordinate || !req.body.value || !req.body.puzzle)) {
      return res.send({error: 'Required field(s) missing'});
    }  else if (regex3.test(req.body.value) === false) {
      return res.send({ error: 'Invalid value' });
    } else if (regex2.test(coord1) === false && regex3.test(coord2) === false) {
      return res.send({error: 'Invalid coordinate'});
    } else {
      
      //let solution = solveFromCell(originalBoard, 0, 0);
      // Here ......
      let placeResult = "true";
      let res1 = [];

      if (myValue != 11) {
        placeResult = canPlaceTwo(originalBoard, rows, cols, myValue);
      }
       console.log( "   RES  "  + placeResult)
       let jsonRes = {valid: true};
      if (placeResult != '') {
         //res1[0] = placeResult;
         //return res.send({valid: false, conflict: placeResult});
        jsonRes = {valid: false};
      } else {
        jsonRes = {valid: true};
     // console.log("   ***   " + placeResult + "   ***   ");
      //return res.send({valid: true});
      }

      if (jsonRes.valid) {        
        return res.send(jsonRes);
      } else {
        //jsonRes.conflict = placeResult;
        jsonRes.conflict = placeResult;
        return res.send(jsonRes);
      }
    }

      //console.log(JSON.stringify(req.body));
      //return res.send('Solution');
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      
     // console.log(req.body.puzzle.length);
      let puzzle = req.body.puzzle;
      let regex = /^[0-9.]*$/;

    if (!req.body.puzzle || !req.body.hasOwnProperty('puzzle')) {
      return res.send({error: 'Required field missing'});
    } 

     if (req.body.puzzle == '') {
      return res.send({error: 'Required field missing'});
    }   
    
    if (puzzle.length < 81 || puzzle.length > 81) {
      return res.send({error: 'Expected puzzle to be 81 characters long'});
    } else if (regex.test(puzzle) === false) {
      return res.send({error: 'Invalid characters in puzzle'}); 
    } else {
      let solution = solvePuzzle(puzzle);
      if (solution == '') {
        return res.send({ error: 'Puzzle cannot be solved' })
      } else {
      return res.send({solution: solution});
      }
    }
    });

    let myRows = (letter) => {

      let result = 11;
      let test = letter;

       switch(test.toUpperCase()) {
        case 'A':
          result = 0;
          break;
        case 'B':
          // code block
          result = 1;
          break;
          case 'C':
          // code block
          result = 2;
          break;
          case 'D':
          // code block
          result = 3;
          break;
          case 'E':
          // code block
          result=4;
          break;
          case 'F':
          // code block
          result = 5;
          break;
          case 'G':
          // code block
          result = 6;
          break;
          case 'H':
          // code block
          result = 7;
          break;
          case 'I':
          // code block
          result = 8;
          break;
        default:
          result = 11;
          // code block
      }
      return result;
    }

    function solvePuzzle(puzzle) {
      
      let solutionString = '';
       //console.log(' Solving IT ');
       let puzzleArr = puzzle.split('');
      let originalBoard = generateBoard(puzzleArr);

      let solution = solveFromCell(originalBoard, 0, 0);
      //errorMessage.innerText = '';
      if (!solution) {
        //errorMessage.innerText = "No solution";
        return solutionString
      }
      //console.log(solution);
      let i
      let j      
      for(i = 0; i < solution.length; i++){
        for(j=0; j < solution[i].length; j++){
          solutionString += solution[i][j].toString()
        }
      }
      //document.querySelector('#text-input').value = solutionString
      //textBoxChanged()
      console.log(' SOLUTION STRING ' + '\n\n' + solutionString);
      return solutionString;
    }

    let solveFromCell = (board, row, col) => {

  console.log(' Attempting to solve row ');

  if(col === 9){
		col = 0
		row ++
	}

  if (row === 9) {
    return board
  }

  /* If already filled out (not empty) then skip to next column */
	if(board[row][col] != '.'){
		return solveFromCell(board, row, col + 1)
	}

  //* Try placing in values */

	// Start with 1 and check if okay to place in cell. If so,
	// run the algorithm from the next cell (col + 1), and see if
	// false is not returned. A returned board indicates true, since
	// a solution has been found. If false was returned, then empty out
	// the cell, and try with next value
	let i
	for(i = 1; i < 10; i ++){
		let valueToPlace = i.toString()
		console.log('Trying with ' + valueToPlace)
		if(canPlace(board, row, col, valueToPlace)){
			board[row][col] = valueToPlace
			if(solveFromCell(board, row, col + 1) != false){
				return solveFromCell(board, row, col + 1)
			}else{
				board[row][col] = '.'
			}
		}
	}
	
	/* If not found a solution yet, return false */
	return false

}

    let generateBoard = (values) => {

      let board = [[], [], [], [], [], [], [], [], []];

      let boardRow  = -1;
      let i
      for (i = 0; i < values.length; i++) {
        if (i % 9 === 0) {
          boardRow++;
        }
        board[boardRow].push(values[i]);
      }

      return board;

    }

    let canPlace = (board, row, col, value) => {

  //Check col
  let i 
  for (i = 0; i < 9; i++) {
    if (board[i][col] == value) {
      return false;
    }
  }

  //Check row
  let j 
  for (j = 0; j < 9; j++) {
    if (board[row][j] == value) {
      return false;
    }
  }

  //Check box placement
  let boxTopRow = parseInt(row / 3) * 3       // Returns index of top row of box (0, 3, or 6)
	let boxLeftColumn = parseInt(col / 3) * 3   // Returns index of left column of box (0, 3 or 6)

	let k // Looks through rows
	let l // Looks through columns
	for (k = boxTopRow; k < boxTopRow + 3; k++) {
		for(l = boxLeftColumn; l < boxLeftColumn + 3; l++){
			if(board[k][l] == value){
				return false
			}
		}
	}

	return true

}

let canPlaceTwo = (board, row, col, value) => {
  
  let res = []; 
  //Check col
  let i 
  for (i = 0; i < 9; i++) {
    if (board[i][col] == value) {
      res.push("column");
    }
  }

  //Check row
  let j 
  for (j = 0; j < 9; j++) {
    if (board[row][j] == value) {
      res.push("row");
    }
  }

  //Check box placement
  let boxTopRow = parseInt(row / 3) * 3       // Returns index of top row of box (0, 3, or 6)
	let boxLeftColumn = parseInt(col / 3) * 3   // Returns index of left column of box (0, 3 or 6)

	let k // Looks through rows
	let l // Looks through columns
	for (k = boxTopRow; k < boxTopRow + 3; k++) {
		for(l = boxLeftColumn; l < boxLeftColumn + 3; l++){
			if(board[k][l] == value){
        res.push("region"); 
			}
		}
	}
	return res;

}

};
