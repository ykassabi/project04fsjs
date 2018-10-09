"use strict";
/* Over View; from HTML: 3 sections<head> : start - game - finish
class to to hold proprieties of the playes, creation of two players.
Declatation variables, all for the DOM.
¬ declaration of functions (fn)
..¬fn toggleOnOff function , show and hide. 
..¬event link to start button from the start screen.
..¬fn main function is called "playTheGame" ……inside the main function : 
...¬turn fn /  //  creating an array and verify it by call the winningCombinationChecker
...¬turn / it 's where HOVER EVENT and Click Event will be nested. //ROLE: let USER PICK and alternate between users//role of click : creating an array and verify it by call the winningCombinationChecker
...¬winningCombinationChecker // will be called from inside of turn fn. // ROLE:VERIFICATION and will call endOfTheGameScreen is it s draw of winner.
...¬endOfTheGameScreen // Associated with finish Screen // ROLE:DISPLAY WINNER 
...¬resetTheGame // will be embeded inside the endOfTheGameScreen // ROLE:Start New Game
*/

class Players {
    constructor(name, XO, num, isItMyTurn = false ) {
        this.name = name; //generic for now. player One, player Two.
        this.signedWith = `url(img/${XO}.svg)`; //sign for UI
        this.num = num;
        this.score = 0; //to keep track of the wins
        this.arr = []; // to store the grid values
        this.won = false; //use for verification
        this.isItMyTurn = isItMyTurn;
    }
}
let player1 = new Players("Player TWO", "o",0, true);
let player2 = new Players("Player ONE", "x",1);

const players = document.querySelectorAll(".players"); // used for the toggle to know wich player turn is
const grid = document.querySelectorAll(".boxes li") // to associate numbers tide each box
const boxes = document.querySelector(".boxes") // 
const theBoard = document.querySelector("#board") //it is the game section
const welcomeScreen = document.querySelector("#start") //it a start screen section
const btnwelcomeScreen = document.querySelector("#start .button") //related to start the first game
const endGameScreen = document.querySelector("#finish") // the end of the game
const btnEndGameScreen = document.querySelector("#finish .button") //related to the end of the game to start new game.
const msgEndGameScreen = document.querySelector("#finish .message") //related to end of the game section

function toggleOnOff(el, verb) { //a show and hide propreties. verb Must be "On" to show.
    el.style.display = verb === "On" ? 'block' : 'none';
    return el;
}
//////////////////THE START////////////////////
// ///////////////////////////////////////////
// to control the display of the 3 screen //
toggleOnOff(welcomeScreen, "On"); //only the welcome screen shows
toggleOnOff(theBoard, "Off");
toggleOnOff(endGameScreen, "Off");
btnwelcomeScreen.addEventListener('click', function () { //button action.
    toggleOnOff(welcomeScreen, "Off"); // hiding the welcome scteen 
    toggleOnOff(theBoard, "On"); // the Game is ON
});
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////
//////////////////THE GAME AND THE FINISH////////////////////
function playTheGame() {

    let numTurnByPlayer = 1; //to stop the moves in case 
    
    let currentPlayer; 
    function turn() {
         currentPlayer = player2.isItMyTurn ? player2 : player1;//
        players[currentPlayer.num].classList.add("active"); // the active player hilighted, 
        players[`${currentPlayer.num == 1 ? 0:1}`].classList.remove("active") // remove the highlight from the other player.

        // //////////// CHOOSING // HOVER EVENT// ////////////
        boxes.addEventListener("mouseover", function (el) {
            if (el.target.className === "box") {
                el.target.style.backgroundImage = currentPlayer.signedWith;

            }
        }, false)
        boxes.addEventListener("mouseout", function (el) {
            if (el.target.className === "box") {
                el.target.style.backgroundImage = "";
            }
        }, false)

        // //////////// PICKING // CLICKING EVENT/////////////
        if (numTurnByPlayer === 1) { //only if player did not play one (time)
            for (let i = 0; i < grid.length; i += 1) {
                grid[i].addEventListener("click", function (el) { //every li will have an event attach to it.
                    if (el.target.className === "box") {
                        numTurnByPlayer = 0; // out of moves
                        currentPlayer.arr.push(i); // collecting the pick on arry of the current player, player1.arr
                        el.target.className = (`box box-filled-${currentPlayer.num}`); // for UI computed value is 0 or 1 depemding of the player.
                        winningCombinationChecker(currentPlayer.arr, currentPlayer) // compairing the arr with winning arr see the function bellow.
                        ///////////////////////////////////////////////////////////////
                        // playerNum = playerNum == 0 ? 1 : 0 // to swith the Player and call the next turn function
                                player2.isItMyTurn = !player2.isItMyTurn;
                                player1.isItMyTurn = !player2.isItMyTurn;
                        return turn();
                    } else {
                        return;
                    }
                }, false)
            }
        }
    }


    function winningCombinationChecker(arrToBeEvaluated, player) {
        //array that holds the winning combos;  //1,2,3//4,5,6 //7,8,9 horizontally //1,4,7//2,5,8 //3,6,9 vertically  //1,5,9//3,5,7         diagonally
        let winningArray = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        //every values in player.arr will be turned to true is it has a much.
        arrToBeEvaluated.map(function (i) {
            winningArray.map(function (winArr) {
                for (let y = 0; y < 3; y++) {
                    if (winArr[y] === i) {
                        winArr[y] = true;
                    } //[1,true,3]
                }
                // making new array just with the first 9 values and filtring the boolean true, where there is a matchit will be marked with true in the player array.
                // arr.player1.arr => [true,true,true,true]//countArray will be 4 or 5 at the end of the game.con t be more. 9 boxes for 2 players.
                let countArray = winningArray.slice(0, 3).reduce((a, b) => a.concat(b)).filter(i => i === true); //one array [0,1,2,3,4,5,6,7,8]
                let arrWithAllTrue = (winArr.every(i => i === true)); //checking is there is an arr,from winningArray, that has all true.
                if (countArray.length < 3) { //we must have 3 true at least to have a line on the grid.
                    numTurnByPlayer = 1; //so the game can be played one more turn
                } else if (countArray.length <= 5 && arrWithAllTrue) { // true in 3,4,5 length arr.
                    player.score += 1; //to keep score.
                    let winnerScreen = `screen-win-${player.name === "Player TWO" ? "one" : "two" }`;
                    let message = `🎊 ${player.name}🎊, won 🎉 <hr> <em>${player2.name} : ${player2.score} - ${player1.name}: ${player1.score} </em>`;
                    player.won = true; // will block the draw condition from being executed. because countArray.length == 5 is true here and in the next condition;
                    return endOfTheGameScreen(winnerScreen, message);
                } else if (countArray.length === 5 && !player.won) {
                    let winnerScreen = `screen-win-tie`;
                    let message = ` It's a Tie !🐼`; // panda could not find a tie.😆😂
                    return endOfTheGameScreen(winnerScreen, message);
                } else {
                    numTurnByPlayer = 1; //// one more turn
                    return;
                }
            });
        })
    }

    function endOfTheGameScreen(winnerClass, message) { // Associated with finish Screen, invoked from winningCombinationChecker
        toggleOnOff(theBoard, "off")
        toggleOnOff(endGameScreen, "On") //endGameScreen shows
        endGameScreen.classList.add(winnerClass); // values of winnerClass will passed in
        msgEndGameScreen.innerHTML = message; // values of winnerClass will passed in
        // //new game button and start a new game.
        btnEndGameScreen.addEventListener("click", function () {
            resetTheGame();
        });
    }

    function resetTheGame() { // will be called in endOfTheGameScreen >> Fresh NEW GAME STARTS.
        toggleOnOff(theBoard, "On"); // the Board is On.
        toggleOnOff(endGameScreen, "off");
        player1.arr = [];
        player2.arr = [];
        player1.won = false;
        player2.won = false;
        endGameScreen.className = "screen  screen-win";
        msgEndGameScreen.innerHTML = "";

        boxes.removeEventListener("mouseout", function (el) {
            el.style = ""; //removing the hover effect
        }, false)
        grid.forEach(function (el) { //cleaning the x and o
            el.className = "box";
            el.style = "";
            return el;
        })
        playTheGame();// a fresh party game.
    }
        turn();//calling function for the first execution
}

playTheGame();// 
// argument could be  1 =>x/player1 OR 0 => o/player2.