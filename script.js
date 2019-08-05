/*HTML properties*/
//input accept only 1-9 and if length equal to 1 replace value to pressed 1-9 

function fillInputOnkey(inputVal, event, ID) {
    let clickedvalue = String.fromCharCode(event.charCode);
    console.log(clickedvalue);

    if (inputVal.value.length == 1 && event.charCode >= 49 && event.charCode <= 57) {
        document.getElementById(ID).value = clickedvalue;
        return false;

    } else if (event.charCode == 48) {
        return false;
    } else if (event.charCode >= 42 && event.charCode <= 47) {
        return false;
    }
}

/***********************************************SUDOKU TABLE FILLING  *******************************************************/
//********* Sudoku table filling backtracking
//Empty array 81 values
//Gives row index of the specific cell in the sudokuArray
function rowIndex(cellNumber) {
    return Math.floor(cellNumber / 9);
}

//Gives col index of the specific cell in the sudokuArray
function colIndex(cellNumber) {
    return Math.floor(cellNumber % 9);
}

//Gives box index of specific cell in the sudokuArray
function blockIndex(cellNumber) {
    return Math.floor(rowIndex(cellNumber) / 3) * 3 + Math.floor(colIndex(cellNumber) / 3);
}

//Checks if specific number can be placed inside a row
function checkRow(number, rowIndex, sudokuArray) {
    for (let i = 0; i < 9; i++) {
        if (sudokuArray[rowIndex * 9 + i] == number) {
            return false;
        }
    }
    return true;
}

//Checks if specific number can be pleaced inside a column
function checkColumn(number, colIndex, sudokuArray) {
    for (let i = 0; i < 9; i++) {
        if (sudokuArray[colIndex + i * 9] == number) {
            return false;
        }
    }
    return true;
}

//Checks if specific number can be pleaced inside a block
function checkBlock(number, blockIndex, sudokuArray) {
    for (let i = 0; i < 9; i++) {
        if (sudokuArray[Math.floor(blockIndex / 3) * 27 + (i % 3) + 9 * Math.floor(i / 3) + 3 * (blockIndex % 3)] == number) {
            return false;
        }
    }
    return true;
}

//Checks if specific number can be placed inside a specific cell
function possibleNumber(number, sudokuArray, rowI, colI, blockI) {
    return checkColumn(number, colI, sudokuArray) && checkBlock(number, blockI, sudokuArray);
}

//Deletes row when iteration count is more then 
function deleteRow(colI, cellIndex, sudokuArray) {

    for (let i = colI, j = 1; i > 0; i--, j++) {
        sudokuArray[cellIndex - j] = 0;
    }
    return sudokuArray;
}
//Deletes 3 rows when row is over 3 
function delete3Rows(colI, cellIndex, sudokuArray) {
    for (let i = colI + 18, j = 1; i >= 0; i--, j++) {
        sudokuArray[cellIndex - j] = 0;

    }
    return sudokuArray;
}

//Reset numbersToChooseFrom
function resetNumbersToChooseFrom() {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9];
}

//Generates array between 0-80
function generateCellsToChooseFrom() {
    var array = [];
    for (let i = 0; i <= 80; i++) {
        array.push(i);
    }
    return array;
}

function getRandomNumber(max) {
    return Math.floor((Math.random() * max));
}

//Generates empty sudoku with zeros.
function generateEmptySudokuArray() {
    var array = [];
    for (let i = 0; i < 81; i++) {
        array.push(0);
    }
    return array;
}

//placing the number and disable
function placeTheNumber(rowI, colI, generatedNumber) {
    document.getElementById('i' + rowI + colI).setAttribute('value', generatedNumber); //Writes on HTML
    document.getElementById('i' + rowI + colI).style.background = '';
    document.getElementById('i' + rowI + colI).disabled = true;
    document.getElementById('i' + rowI + colI).setAttribute('type', 'number');
}

let difficultyHide = 20;

//Removes random cells by difficulty (20,40,60) (activated after sudoku filled)
function removeCells() {
    let cellsToChooseFrom = generateCellsToChooseFrom();

    for (let i = difficultyHide; i > 0; i--) {
        let randomCellIndex = getRandomNumber(cellsToChooseFrom.length);
        let generatedCell = cellsToChooseFrom[randomCellIndex];
        cellsToChooseFrom.splice(randomCellIndex, 1);
        let rowI = rowIndex(generatedCell);
        let colI = colIndex(generatedCell);
        const cellId = 'i' + rowI + colI;
        document.getElementById(cellId).setAttribute('value', ''); //Writes on HTML
        document.getElementById(cellId).style.background = '#fff';
        document.getElementById(cellId).disabled = false;
        document.getElementById(cellId).addEventListener('onkeypress', function(event) {
            return fillInputOnkey(this,event,this.id);
        })
        document.getElementById(cellId).addEventListener('onfocus', function(event) {
            focusGuideLines(this.id);
            focusOnCell(this.id);
        })
        document.getElementById(cellId).addEventListener('onblur', function(event) {
            resetGuideLines();
            clearNotDisabled();
        })
    }
}
//Generate a valid sudoku table
function generateSudokuArray() {
    document.getElementById('correctSpan').innerHTML = '';
    let sudokuArray = generateEmptySudokuArray(); //Create empty sudoku array of 81 numbers equal to 0
    let numbersToChooseFrom;
    let cellFilled;
    let generatedNumber;
    let iterationsCount;
    let rowI;
    let colI;
    let blockI;
    let randomIndex;
    for (let cellIndex = 0; cellIndex < 81; cellIndex++) { //runs from 0 to 80 (81 numbers)
        cellFilled = 0; //Set flag to 0
        iterationsCount = 0; //Reset iterations that failed to 0 after placing a number.
        rowI = rowIndex(cellIndex); //Check the row index given a cellIndex
        colI = colIndex(cellIndex); //Check the column index given a cellIndex
        blockI = blockIndex(cellIndex); //Check the block index given a cellIndex(3*3)
        if (colI == 0) { //If moved to a new row or cellIndex is at 0.
            numbersToChooseFrom = resetNumbersToChooseFrom(); //Resets the numbers to choose from to 1-9
        }
        while (cellFilled == 0) { //As long as cell did not fill.
            randomIndex = getRandomNumber(numbersToChooseFrom.length); //Generate random index out of the remaining numbers to choose from.
            generatedNumber = numbersToChooseFrom[randomIndex]; //Gets the number with the random index.
            /*debugger*/
            if (rowI == 0) { //If at row 0 dont make any validations.
                sudokuArray[cellIndex] = generatedNumber; //Place the generated number
                cellFilled = 1; //Flag to 1 in order to get out of the while loop.
                numbersToChooseFrom.splice(randomIndex, 1); //Removes the placed number from the numbers to choose from.
                placeTheNumber(rowI, colI, generatedNumber); //placing the number and disable
            } else if (possibleNumber(generatedNumber, sudokuArray, rowI, colI, blockI)) { //checks if number can be placed in column and block 
                sudokuArray[cellIndex] = generatedNumber; //Place the generated number
                cellFilled = 1; //Flag to 1 in order to get out of the while loop.
                numbersToChooseFrom.splice(randomIndex, 1); //Removes the placed number from the numbers to choose from.
                placeTheNumber(rowI, colI, generatedNumber); //placing the number and disable
            } else if (iterationsCount > 50) { //If tried to place a number in cell more then 50 times
                if (rowI > 0 && rowI <= 3) { //Delete 1 row if row is between 1 to 3 (row 0 dont need to be deleted).
                    sudokuArray = deleteRow(colI, cellIndex, sudokuArray); //Deletes the row values
                    if (rowI == 3) {
                        cellIndex = 26; //Moves to the beggining of the row -1 (-1 because we go back to the for loop and cell index will be increased by 1)
                    } else if (rowI == 2) {
                        cellIndex = 17;
                    } else {
                        cellIndex = 8;
                    }
                    cellFilled = 1; //Sending out of the loop to reset the data
                } else { //Delete 3 rows
                    sudokuArray = delete3Rows(colI, cellIndex, sudokuArray); //Deletes 3 rows
                    cellIndex -= (colI + 19); //Moves to the beggining of the 3 rows deleted -1 (-1 because we reset loop again)
                    cellFilled = 1; //Sending out of the loop to reset the data
                }
            } else {
                iterationsCount++; //Adds 1 to the iterations that failed
            }
        }
    }
    removeCells()
}
generateSudokuArray();

/***************************************************SUDOKU UX**************************************************************/
//Choose difficulty (update values and bgc)
function updateDifficulty(numberToHide) {
    difficultyHide = numberToHide;
    if (numberToHide == 20) {
        document.getElementById('mediumDiffBtn').style.backgroundColor = '';
        document.getElementById('hardDiffBtn').style.backgroundColor = '';
        document.getElementById('easyDiffBtn').style.backgroundColor = 'blue';
    } else if (numberToHide == 40) {
        document.getElementById('easyDiffBtn').style.backgroundColor = '';
        document.getElementById('hardDiffBtn').style.backgroundColor = '';
        document.getElementById('mediumDiffBtn').style.backgroundColor = 'blue';
    } else {
        document.getElementById('easyDiffBtn').style.backgroundColor = '';
        document.getElementById('mediumDiffBtn').style.backgroundColor = '';
        document.getElementById('hardDiffBtn').style.backgroundColor = 'blue';
    }
}
//Toggle between hint state
let hintsState = true;

function toggleHints() {
    if (hintsState == true) {
        document.getElementById('hintSpan').innerHTML = ' Hints are : Off'
        hintsState = false;
        document.getElementById('hintsRadioInput').checked = false;

    } else {
        document.getElementById('hintSpan').innerHTML = ' Hints are : On'
        document.getElementById('hintsRadioInput').checked = true;
        hintsState = true;

    }
}
//Moves all over not disabled inputs and clear (used for focusOnCell + when cell is out of focus)
function clearNotDisabled() {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            disabledValue = document.getElementById('i' + row + col).getAttribute("disabled");
            if (disabledValue != '') {
                document.getElementById('i' + row + col).style.background = '#fff';
            }
        }
    }
}

//Focus on specific cell (change color of specific color and change alll undisabled cells bgc to white)
function focusOnCell(ID) {
    clearNotDisabled();
    document.getElementById(ID).style.background = '#ADD8E6';
}


//Given cellIndex, rowI, colI returns the blockIndex
function blockIndexDraw(cellNumber, rowI, colI) {
    return Math.floor(rowI / 3) * 3 + Math.floor(colI / 3);
}

//Reset GuideLines
function resetGuideLines() {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            document.getElementById('c' + row + col).style.background = '#fff';
        }
    }
}

//Focus on block,row and column (changes TD bgc)
function focusGuideLines(ID) {
    if (hintsState == true) {
        let rowI = parseInt(ID.slice(1, 2));
        let colI = parseInt(ID.slice(2, 3))
        let cellIndex = rowI * 9 + colI;
        let blockI = blockIndexDraw(cellIndex, rowI, colI);
        resetGuideLines();
        console.log(blockI);
        drawRowCells(rowI);
        drawColCells(colI);
        drawBlockCells(blockI);
    }
}

//Focus on row 
function drawRowCells(rowIndex) {
    for (let i = 0; i < 9; i++) {
        document.getElementById('c' + rowIndex + i).style.background = '#c6de41';
    }
}

//Focus on column
function drawColCells(colIndex) {
    for (let i = 0; i < 9; i++) {
        document.getElementById('c' + i + colIndex).style.background = '#c6de41';
    }

}

//Focus on block
function drawBlockCells(blockIndex) {
    for (let i = 0; i < 9; i++) {
        let cellIndex = Math.floor(blockIndex / 3) * 27 + (i % 3) + 9 * Math.floor(i / 3) + 3 * (blockIndex % 3);
        let rowI = rowIndex(cellIndex);
        let colI = colIndex(cellIndex);
        document.getElementById('c' + rowI + colI).style.background = '#c6de41';
    }
}
//////**********************************************SUDOKU VALIDATION****************************************************/
//Function that takes values in sudoku table and push it into 0-80 array.
function putSudokuInArray() {
    let checkedSudoku = [];
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (document.getElementById('i' + row + col).value != "") {
                checkedSudoku.push(document.getElementById('i' + row + col).value);
            }

        }
    }
    console.log(checkedSudoku);

    return checkedSudoku;
}


//Checks if specific row is completed and contain 1-9
function correctRow(row, sudokuArray) {
    let validArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let tempArray = [];
    for (let i = 0; i < 9; i++) {
        tempArray[i] = sudokuArray[row * 9 + i];
    }
    tempArray.sort();
    return validArray.join() == tempArray.join();
}

//Checks if specific col is completed and contain 1-9
function correctCol(col, sudokuArray) {
    let validArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let tempArray = [];
    for (let i = 0; i < 9; i++) {
        tempArray[i] = sudokuArray[col + i * 9];
    }
    tempArray.sort();
    return tempArray.join() == validArray.join()
}

//Checks if specific block is completed and contain 1-9
function correctBlock(block, sudokuArray) {
    let validArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let tempArray = [];
    for (let i = 0; i < 9; i++) {
        tempArray[i] = sudokuArray[Math.floor(block / 3) * 27 + i % 3 + 9 * Math.floor(i / 3) + 3 * (block % 3)];
    }
    tempArray.sort();
    return tempArray.join() == validArray.join();
}

//Checks if whole sudoku is solved
function solvedSudokuCheck() {
    let checkedSudoku = putSudokuInArray();
    if (checkedSudoku.length == 81) {
        for (let i = 0; i < 9; i++) {
            if (!correctRow(i, checkedSudoku) || !correctCol(i, checkedSudoku) || !correctBlock(i, checkedSudoku)) {
                document.getElementById('correctSpan').innerHTML = 'Sudoku is incorrect'
            } else {
                document.getElementById('correctSpan').innerHTML = 'Good Job! sudoku is correct'
            }
        }
    } else {
        document.getElementById('correctSpan').innerHTML = 'There are missing cells'
    }


}