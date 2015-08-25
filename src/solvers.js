/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other

window.findNRooksSolution = function(n) {
  var solution;
  var colsOccupied = [];
  var board = [];

  for (var i = 0; i < n; i++) {
    colsOccupied.push(false);
  }
  for (var y = 0; y < n; y++) {
    board.push([]);
    for (var x = 0; x < n; x++) {
      board[y].push(0);
      console.log("FOUND IT");
    }
  }
  console.log("BOARD BELOW");
  console.log(board);

  function solutionFinder(rowIndex) {
    if (solution !== undefined) {
      return;
    }
    if (rowIndex === n) {
      solution = window.deepCopy(board);
      return;
    }
    for(var x = 0; x < n; x++){
      if (colsOccupied[x]) {
        continue;
      }
      colsOccupied[x] = true;
      board[rowIndex][x] = 1;
      solutionFinder(rowIndex + 1);
      colsOccupied[x] = false;
      board[rowIndex][x] = 0;
    }
  }
  solutionFinder(0);

  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};

window.deepCopy = function(array) {
  var copy = array.map(function(arr) {
      return arr.slice();
  });
  return copy;
};



// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var solution=1; //fixme
  
  for(var i = 1; i <= n; i ++){
    solution *= i;  
  }
  return solution;
};



// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  if( n === 0 ){
    return [];
  }
  var solution;
  var colsOccupied = [];
  var majorsOcc = [];
  var minorsOcc = [];
  var board = [];

  //populate with false 
  for (var i = 0; i < n; i++) {
    colsOccupied.push(false);
  }
  //populate diagonals with false
  for (var i = 0; i < 2*n-1; i++) {
    majorsOcc.push(false);
    minorsOcc.push(false);
  }

  //create empty board
  for (var y = 0; y < n; y++) {
    board.push([]);
    for (var x = 0; x < n; x++) {
      board[y].push(0);
    }
  }


  function solutionFinder(rowIndex) {
    if (solution !== undefined) {
      return;
    }
    //reaching the end of the board
    if (rowIndex === n) {
      solution = window.deepCopy(board);
      return;
    }
    for(var col = 0; col < n; col++){
      var major = toMajor(rowIndex, col, n);
      var minor = toMinor(rowIndex, col);
      //checking to see if there is a conflict at the current location
      if (colsOccupied[col] || majorsOcc[major] || minorsOcc[minor]) {
        continue;
      }
      //occupy the space and turn on the death rays
      colsOccupied[col] = true;
      majorsOcc[major] = true;
      minorsOcc[minor] = true;
      board[rowIndex][col] = 1;
      //call a recursion with an incremented row
      solutionFinder(rowIndex + 1);
      //turn off the death rays
      colsOccupied[col] = false;
      majorsOcc[major] = false;
      minorsOcc[minor] = false;
      board[rowIndex][col] = 0;
    }
  }
  solutionFinder(0);
  if (solution === undefined){
    return {n:n};
  }
  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};


// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var start = performance.now();
  if (n === 0) {
    return 0;
  }
  var solutions = 0;
  var colsOcc = 0;
  var row = 0;

  function solutionFinder(majorsOcc, minorsOcc) {
    //reaching the end of the board
    for(var col = 0; col < n; col++){
      var majorFlag = 1 << col;
      var minorFlag = 1 << col;
      var colFlag   = 1 << col;//set the column flag for whatever column we're in 
      //checking to see if there is a conflict at the current location
      if ( (majorsOcc & majorFlag) || (minorsOcc & minorFlag) || (colsOcc & colFlag) ) {
        continue;
      }
      //occupy the space and turn on the death rays
      row++;
      if (row === n) {
        solutions++;
        row--;
        continue;
      }
      else {
        //set invalid
        colsOcc = colsOcc | colFlag;
        //recursion
        solutionFinder((majorsOcc | majorFlag) << 1, (minorsOcc | minorFlag) >> 1);
        //set valid
        colsOcc = colsOcc ^ colFlag;
      }
      row--;
      // colsOcc[col] = true;
      //call a recursion with an incremented row
      //turn off the death rays
      // colsOcc[col] = false;
    }
  }
  solutionFinder(0, 0);
  console.log('Number of solutions for ' + n + ' queens:', solutions);
  console.log(performance.now()-start);
  return solutions;

};

//find major diagonal numbers with row and column
window.toMajor = function(row,col,n){
  return col-row+n-1;
};

//find minor diagonal numbers with row and column
window.toMinor = function(row,col){
  return col+row;
};
