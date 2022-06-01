class Space {
    constructor(occupied,spot,rosette,occupiedByPiece,id,team) {
        this.occupied = occupied;
        this.spot = spot;
        this.rosette = rosette;
        this.occupiedByPiece = occupiedByPiece;
        this.id = id;
        this.team = team;
    } 
    
    moveToSpace(piece){
        if(this.occupied){
            moveOffBoard(this.occupiedByPiece);
        }
        this.occupied = true;
        this.occupiedByPiece = piece;
        piece.location = this.id;
        piece.onBoard = true;
    }
    removePiece(){
        this.occupied = false;
        this.occupiedByPiece = undefined;
    }
}

class Piece {
    constructor(location,team,id,onBoard) {
        this.location = location;
        this.team = team;
        this.id = id;
        this.onBoard = onBoard;
    }
}

/**
 * Used to update board array with new state of occupied spaces
 * @param {*} board global board
 * @param {*} pieces all pieces (totalPieces) to update entire board
 * @returns updated game state (board) with occupied and occupiedByPiece properties updated
 */
function updateOccupied(board, pieces) {
    let retVal = board;
    for (let x = 0; x < pieces.length; x++) {
        for (let i = 0; i < retVal.length;i++) {
            if (pieces[x].location == retVal[i].spot) { 
                retVal[i].occupied = true;
                retVal[i].occupiedByPiece = pieces[x];
            } else if (retVal[i].occupied == undefined) {
                retVal[i].occupied = false;
            }
        }
    }
    return retVal;
}

/**
 * Function grabs all HTML ids, filters out ids that are not board spaces and
 * sets default values 
 * @returns board array set to state when game begins 
 */
function setInitialState() {
    ids = document.querySelectorAll('[id]');
    let arr = [];
    
    for (let i = 0; i < ids.length; i++) {
        let temp = ids[i];
        let tempTeam;
        if (temp.className.includes("team1")){
            tempTeam = 1
        }
        else if (temp.className.includes("team2")){
            tempTeam = 2
        }
        else {
            tempTeam = 3
        }
        if (temp.classList.contains("rosettePiece") && temp.className.includes("item")) {
            temp = new Space(temp.occupied,temp,true,undefined, parseInt(temp.id), tempTeam);
            arr.push(temp);
        } else if (temp.className.includes("item")) {
            temp = new Space(temp.occupied,temp,false,undefined, parseInt(temp.id), tempTeam);
            arr.push(temp);
        } 
    }
    temp = new Space(false,undefined,false,undefined, 14, 1);
    arr.push(temp);
    return arr;
}

function getButtons() {
    ids = document.querySelectorAll("button");
    let arr = [];
    
    for (let i = 0; i < ids.length; i++) {
        let temp = ids[i];
        if (temp.classList.contains("black")) {
            temp = new Piece(-1,2,i, false);       //piece(location, team, id, onBoard)
            arr.push(temp);
        } else if (temp.classList.contains("white")) {
            temp = new Piece(-1,1,i, false);       //piece(location, team, id, onBoard)
            arr.push(temp);
        }
    }
    return arr;
}

/**
 * Determine whether or not an enemy piece is able to be removed **-AI PLAY**
 * @param {*} position The current position of the piece that is to be removed is at
 * @param {*} team The team that is attempting to remove a piece (only applicable to AI)
 * @returns true/false
 */
function canRemoveEnemy(position, team) {
    let retVal = false;
    if (ROLL == 0) {
        return retVal;
    }
    let space = getSpace(position, team);
    //debug info *start
    if (space.occupied == true && space.rosette == false) {
        let removalPiece = space.occupiedByPiece; // enemy piece that is on space and attempting to be removed.
        if (removalPiece.team != 1) {
            console.log('possible removal piece ID, Location, Team:');
            console.log('               '+removalPiece.id+' - '+removalPiece.location+' - '+removalPiece.team);
        }
    }
    //debug info *end
    if (position <= 3 || position >= 12 || position == 7) {
        return retVal;
    } else {
        if (space.rosette == true && position == 7) {
            retVal = false;
        }
    } if (space.occupied == true && space.occupiedByPiece.team != 1 && space.team == 3) {
        retVal = true;
    } 
    return retVal;
}

/**
 * Not currently implemented.
 * Evaluation to give a move a score based on the current state of the piece
 * @param {*} position piece location 
 * @param {*} roll ROLL
 * @param {*} team AI team (1)
 * @returns score/100.0 of this move
 */
function evaluateBoard(position,roll,team) {
    let score = 0;
    
    let newSpace = roll + position;
    team = getTeamByPosition(newSpace,team);
    let checkSpace = getSpace(newSpace,team);
    if (roll == 0) {
        if (checkSpace.rosette == false) {
            return 0;
        } else if (checkSpace.rosette == true) {
            score += 50;
        }
        return score;
    }
    if (Human.removeEnemy(newSpace) == true) {
        score += 40;
    }
    if (roll != 0 && newSpace == 14) { //piece can score
        return 1;
    } 
    if (roll > 0) {
        if (checkSpace.rosette == true) {
            score += 40;
        } 
        if (position <= 2) {
            if (checkSpace.id > 3) {
                score += 30;
            } else {
                score += 20;
            }
        } else if (position >= 3 && checkSpace.id <= 7) { 
            score += 35;
        } else if (position >= 7) {
                if (checkSpace.id >= 12) {
                    score += 55;
                } else {
                    score += 40;
                }
            }
    }
    
    if (score > 100) {
        score = 100;
    }
    return score/100.0;
}

/**
 * Used to get the board space (object) using location and team
 * @param {*} location  
 * @param {*} team 
 * @returns board space object matching parameters
 */
function getSpace(location,team) { 
    for (let x = 0; x < board.length; x++) {
        let temp = board[x]; 
        if (temp.id == location && temp.team == team) { 
            return temp;
        }
    }
}

/**
 * disables opposing teams pieces during the turn so they are not clickable
 * @param {*} isRoll default false
 */
function disablesPieces(isRoll = false){
    $(document).ready(function() {
        if(isRoll){
            if(turn==1){
                if(ROLL==0){
                    turn = 2;
                    for(let x=0; x<5;x++){
                        $("#p" + x).prop("disabled",true);
                        $("#p" + (x+5)).prop("disabled",true);   
                    }
                }
                else{
                    for(let x = 0;x<5;x++){
                        $("#p" + x).prop("disabled",false);
                    }
                }
                
            updateOccupied(board,p1Pieces);
            }
            else{
                if(ROLL==0){
                    turn = 1;
                    for(let x=0; x<5;x++){
                        $("#p" + x).prop("disabled",true);
                        $("#p" + (x+5)).prop("disabled",true);   
                    }
                } else {
                    for(let x=0; x<5;x++){
                        $("#p" + (x+5)).prop("disabled",false);
                }
                }
            updateOccupied(board,p2Pieces);
            }
        }
        else {
            for(let x=0; x<5;x++){
                $("#p" + x).prop("disabled",true);
                $("#p" + (x+5)).prop("disabled",true);   
            }
        }
    });
}
/**
 * gets the team by board space
 * @param {*} position the position of the board space i.e. piece position + roll 
 * @param {*} currentTeam the current team; 1 = AI -- 2 = player
 * @returns 1/2 if space belongs to a team and 3 if space is in the danger zone
 */
function getTeamByPosition(position, currentTeam) {
    let retVal = currentTeam;
    if (position > 3 && position < 12) 
        retVal = 3;
    return retVal;
}

/**
 * This function runs each possible AI move through the Neural Network to get its predicted value.
 * @param {*} team Can always be called with 1
 * @returns {*} maxMove{} The best move currently possible
 */
function aiPlay(team) {
    let max = -1, maxMove, temp=null;
    let t = -1;
    if (turn === 1) { 
        let m = getMoves(ROLL);
        if (m == null || m == undefined || m == [] || m.length == 0) {
            turn = 2;
            roll();
            return;
        }
        console.log(m);
        for (let i = 0; i < m.length; i++) {
            let move = {
                position:m[i].input.position, roll:m[i].input.roll, rosette:m[i].input.rosette, removeEnemyPiece:m[i].input.removeEnemyPiece
            }
            //console.log(move); 
            let thisRun = run(move); //runs this move against the neural net, gets back score / 1 
            //console.log(thisRun);
            if (thisRun.result > max) {
                t = m[i].input.pieceID;
                max = thisRun.result;
                maxMove = move;
                temp = p1Pieces[t];
            }
        }    
    maxMove.piece = temp;
    maxMove.team = getTeamByPosition(maxMove.position+maxMove.roll,1);
    
    return maxMove;
    }
}

 /**
 * adjusts the turn boxes to use a different CSS class when it is that players turn
 */
function changeTurn(){
    $(document).ready(function() {
        if(turn == 1){
            $(".turnDisplay1").attr("id", "player1Out");
            $(".turnDisplay2").attr("id", "player2Out");
        }
        else {
            $(".turnDisplay1").attr("id", "player1In");
            $(".turnDisplay2").attr("id", "player2Out");
        }
    });
}

/**
 * Main game function; on player side, runs when a piece is clicked. AI plays when it is it's turn
 * @param {*} team not necessarily needed, but team value
 * @param {*} n current piece that is being worked with
 */
function gameRun(team, n){
 /* console.log('---BOARD STATE---');
    console.log(board);
    console.log('-----------------'); */
    changeTurn();
    $(document).ready(async function() {
        if (turn == 1 && ROLL != 0){ 
            team = 1;
            await sleep(333);
            
            let location = p1Pieces[n].location + ROLL;
            team = getTeamByPosition(location,1);
            
            if (checkHoverLocation(location,team)){ 
                movePiece(team,p1Pieces[n],location); 
                
                if (location === 14 || (!getSpace(location, team).rosette)){ //this will run if the piece does not land on a rosette
                    disablesPieces();
                    turn = 2;
                    changeTurn();
                }
                else {
                    disablesPieces();
                    $(".turnDisplay").html("Player 1, roll again");
                    updateOccupied(board,totalPieces);
                    await sleep(333); //wait for a little time to show AI player actually moving pieces twice.
                    roll();
                    if (ROLL === 0) {
                        return;
                    }
                    let b = aiPlay(1);
                    gameRun(b.team,b.piece.id);
                }
            }
            else
                console.log("cant move here");
        }
        
        else {
            turn = 2;
            team = 2;
            await sleep(200);
            let location = p2Pieces[n].location + ROLL;
            team = getTeamByPosition(location,2);
            
            if(checkHoverLocation(location,2)){
                movePiece(team,p2Pieces[n],location);
                
                if(location === 14 || (!getSpace(location, team).rosette)){         //this will run if the piece does not land on a rosette
                    disablesPieces();
                    $(".turnDisplay1").html("Player 1's turn"); 
                    turn = 1;
                    changeTurn();
                    roll();
                    if (ROLL === 0) {
                        return;
                    }
                    let b = aiPlay(1);
                    gameRun(b.team,b.piece.id);
                }
                else {
                    disablesPieces();
                    $(".turnDisplay2").html("Player 2, roll again");
                }
            }
            else
                console.log("cant move here");
        }
    });
    checkIfWon();
    updateOccupied(board,totalPieces);
}

//checks if mouse is hovering on a piece n, bool variable is set to false when the mouse is no longer hovering.
/**
 * gets the mouses hovering location, runs checkHoverLocation to determine whether background should be red or green
 * @param {*} n current piece ID to be checked
 * @param {*} bool if mouse is hovering, true
 */ 
function mouseHover(n, bool){
    //let button = document.getElementById("p"+n);
    let index = n;
    let hoverLocation = -1;
    let teamClass;
    
    $(document).ready(function() {
        if(n < 5)
            hoverLocation = ROLL + p1Pieces[index].location;
        if(n > 4){        //this will only run for pieces on the black team
            index = n-5;
            hoverLocation = ROLL + p2Pieces[index].location;
        }
        teamClass = getTeamByPosition(hoverLocation,turn);
        
        if(bool){
            if(checkHoverLocation(hoverLocation, teamClass)) {
                if (hoverLocation === 14 && turn === 2) { //if the human player is hovering a piece that will score, show them a message
                    $("#player2CanScore").html("Scoring Move!");
                }
                $("#" + hoverLocation + ".team" + teamClass).css("background-color", "green");
            }
            else {
                $("#" + hoverLocation + ".team" + teamClass).css("background-color", "red");
            }
        }  
        else {
            $("#" + hoverLocation + ".team" + teamClass).css("background-color", "rgb(153, 134, 81)");
            $("#player2CanScore").html("");
        }
           
    })
}

/**
 * checks to see if the location being hovered can be moved to or not
 * @param {*} hoverLocation space trying to be moved to i.e. piece position + roll
 * @param {*} team 
 * @returns true if hoverLocation can be moved to
 */
function checkHoverLocation(hoverLocation, team){
    let retVal = false;
    let spacesTeam = getTeamByPosition(hoverLocation,team);
    let space = getSpace(hoverLocation,spacesTeam);
    if(hoverLocation > 14)
        retVal = false;
    else if(hoverLocation == 14)
        retVal = true;
    else {
        if(space.occupied){
            if(space.occupiedByPiece.team == turn) {
                retVal = false;
            }
            else if(space.rosette)
                retVal= false;
            else 
                retVal = true;
        }
        else 
            retVal=true;
    }
   return retVal;
}

/**
 * This function only moves the HTML element to its new place on the board.
 * @param {*} piece The piece object to be moved off board
 */
function moveOffBoard(piece){
    $(document).ready(function() {
        //let player; not used right now
        let yLevel;     //this will change the "top" or "bottom" of the piece depending on the team
        let left;
        if(piece.team==1){
            player= p1Pieces; 
            yLevel="top";
            left= (piece.id+1)*50;
        }
        else{
            player= p2Pieces;
            yLevel="bottom";
            left = (piece.id-4)*50;
        }
        
        $("#p"+piece.id).css("left", left +"px");
        $("#p"+piece.id).css("top", "");
        $("#p"+piece.id).css(yLevel, "25px");
        $("#p"+piece.id).detach().appendTo(".grid-container");
        piece.location = -1;
        piece.onBoard = false;
    });
    oof.play();
}
/**
* This function is used to move a piece from its current location to a new space on the board. 
* @param team The team attribute of the piece to be moved, can be 1,2,3 depending on piece's team and current location.
* @param piece The piece object that is to be moved.
* @param location The location that the piece is being moved to (-1 - 14).
*/
function movePiece(team,piece,location) {
    let oldSpace, test;   
    let newSpace = getSpace(location, team);
    if (turn == 2) {
        Human.addMove();
        Human.recordMove(piece, ROLL, location);
    }
    if (location != -1 && location != 14) {
        
        //moves the button on the gui
        $(document).ready(function() {
            $("#p"+piece.id).appendTo("#"+location + ".team" + team);
            $("#p"+piece.id).css("left", "54px");
            $("#p"+piece.id).css("top", "29px");
            $("#"+location + ".team" + team).css("background-color", "rgb(153, 134, 81)");
        });
        //if pieces current location is start position, then let team be passed as their respective team
        if(piece.location != -1){
            test = getTeamByPosition(piece.location,piece.team);
            oldSpace = getSpace(piece.location, test); 
            oldSpace.removePiece();
        }
        //updates new space and changes location of piece
        newSpace.moveToSpace(piece);
        piece.onBoard = true;
        
    } else if (location == -1) {
        $(document).ready(function() {
            $("#p"+piece.id).appendTo(document.getElementsByTagName("div")[0]); //move back to starting position
        });
    } else if (location == 14) {
        $("#player2CanScore").html("");
        test = getTeamByPosition(piece.location,turn);
        oldSpace = getSpace(piece.location, test);
        playerScored(piece.team,piece);
        oldSpace.removePiece();
    }
    updateOccupied(board,totalPieces);
    
}

function displayButton(){
    for(let x=0; x<5; x++){       
        let left = x*50
        let button = document.createElement("button");
        button.setAttribute("class", "white");
        button.setAttribute("onclick", "gameRun(1," + x + ")");
        button.setAttribute("id", "p" + x);
        button.style.left = 50 + left + "px";
        button.style.top = "25px";
        button.setAttribute("onmouseover", "mouseHover("+x+", true)");
        button.setAttribute("onmouseout", "mouseHover("+x+", false)");
        button.disabled= true;
        document.getElementsByTagName("div")[0].appendChild(button);    
    }
    for(let x=0; x<5; x++){      
        let left = x*50;
        let button = document.createElement("button");
        button.setAttribute("class", "black");
        button.setAttribute("onclick", "gameRun(2," + x + ")");
        button.setAttribute("id", "p"+(x+5));
        button.style.left = 50 + left + "px";
        button.style.bottom = "25px";
        button.setAttribute("onmouseover", "mouseHover("+(x+5)+", true)");
        button.setAttribute("onmouseout", "mouseHover("+(x+5)+", false)");
        button.disabled= true;
        document.getElementsByTagName("div")[0].appendChild(button);
    }
}

/**
 * Only applies to AI Player 
 * Given the roll, gathers all possible moves given the AI player's pieces positions.
 * @param {*} roll 
 * @returns array of moves that are possible for the AI player
 */
function getMoves(roll) {
    console.log("get moves");
    let retVal = [];
    if (roll == 0) {
        return null;
    }
    for (let x = 0; x < p1Pieces.length; x++) {
        let newSpace = roll+p1Pieces[x].location;
        let team;
        if (newSpace > 14) 
            continue;
        team = getTeamByPosition(newSpace, 1);
        
        let temp = getSpace(newSpace,team);
        let canRemove = canRemoveEnemy(newSpace,team); 
        if (temp.occupied == false || (p1Pieces[x].location == -1 && temp.occupied == false) || (newSpace > 3 && newSpace < 12 && canRemove == true)) {
            retVal.push(
                { input: {
                    pieceID: p1Pieces[x].id,
                    position: p1Pieces[x].location,
                    roll: roll,
                    rosette: temp.rosette,
                    removeEnemyPiece: canRemove
                }   
            },
            );
        }
    }
    return retVal;
}
displayButton();
var hasRolled=true;

/**
 * animates dice to match the output from the roll().
 * uses global ROLL
 */
function animateDice(){
    let diceShown = [];
    let w,x,y,z;
    switch(ROLL){
        case 0:
            w=Math.floor(Math.random() * 3) + 3;
            x=Math.floor(Math.random() * 3) + 3;
            y=Math.floor(Math.random() * 3) + 3;
            z=Math.floor(Math.random() * 3) + 3;
            break;
        case 1:
            w=Math.floor(Math.random() * 3);
            x=Math.floor(Math.random() * 3) + 3;
            y=Math.floor(Math.random() * 3) + 3;
            z=Math.floor(Math.random() * 3) + 3;
            break;
        case 2:
            w=Math.floor(Math.random() * 3);
            y=Math.floor(Math.random() * 3);
            x=Math.floor(Math.random() * 3) + 3;
            z=Math.floor(Math.random() * 3) + 3;
            break;
        case 3:
            w=Math.floor(Math.random() * 3);
            x=Math.floor(Math.random() * 3);
            y=Math.floor(Math.random() * 3);
            z=Math.floor(Math.random() * 3) + 3;
            break;
        case 4:
            w=Math.floor(Math.random() * 3);
            x=Math.floor(Math.random() * 3);
            y=Math.floor(Math.random() * 3);
            z=Math.floor(Math.random() * 3);
            break;
    } 
    $(document).ready(function() {
        // Usage!
        sleep(100).then(() => {
            // Do something after the sleep!
            $("#die" + 0).delay(100).css("background-image", "url('/images/die" + (Math.floor(Math.random() * 6) + 1) + ".png')");
            $("#die" + 1).delay(100).css("background-image", "url('/images/die" + (Math.floor(Math.random() * 6) + 1) + ".png')");  
            $("#die" + 2).delay(100).css("background-image", "url('/images/die" + (Math.floor(Math.random() * 6) + 1) + ".png')");  
            $("#die" + 3).delay(100).css("background-image", "url('/images/die" + (Math.floor(Math.random() * 6) + 1) + ".png')");
            sleep(100).then(() => {
                // Do something after the sleep!
                $("#die" + 0).delay(100).css("background-image", "url('/images/die" + (Math.floor(Math.random() * 6) + 1) + ".png')");
                $("#die" + 1).delay(100).css("background-image", "url('/images/die" + (Math.floor(Math.random() * 6) + 1) + ".png')");  
                $("#die" + 2).delay(100).css("background-image", "url('/images/die" + (Math.floor(Math.random() * 6) + 1) + ".png')");  
                $("#die" + 3).delay(100).css("background-image", "url('/images/die" + (Math.floor(Math.random() * 6) + 1) + ".png')");
                sleep(100).then(() => {
                    // Do something after the sleep!
                    $("#die" + 0).delay(100).css("background-image", "url('/images/die" + (Math.floor(Math.random() * 6) + 1) + ".png')");
                    $("#die" + 1).delay(100).css("background-image", "url('/images/die" + (Math.floor(Math.random() * 6) + 1) + ".png')");  
                    $("#die" + 2).delay(100).css("background-image", "url('/images/die" + (Math.floor(Math.random() * 6) + 1) + ".png')");  
                    $("#die" + 3).delay(100).css("background-image", "url('/images/die" + (Math.floor(Math.random() * 6) + 1) + ".png')");
                    sleep(100).then(() => {
                        // Do something after the sleep!
                        $("#die" + 0).delay(100).css("background-image", "url('/images/die" + (Math.floor(Math.random() * 6) + 1) + ".png')");
                        $("#die" + 1).delay(100).css("background-image", "url('/images/die" + (Math.floor(Math.random() * 6) + 1) + ".png')");  
                        $("#die" + 2).delay(100).css("background-image", "url('/images/die" + (Math.floor(Math.random() * 6) + 1) + ".png')");  
                        $("#die" + 3).delay(100).css("background-image", "url('/images/die" + (Math.floor(Math.random() * 6) + 1) + ".png')");
                        let temp = [w+1,x+1,y+1,z+1];
                        for(n=0; n<4; n++){
                            let indexToBeRemoved = Math.floor(Math.random() * (4-n));
                            diceShown[n]=temp[indexToBeRemoved];
                            temp.splice(indexToBeRemoved, 1);
                            $("#die" + n).css("background-image", "url('/images/die" + diceShown[n] + ".png')");  
                        }
                    });
                });
            });
        });
    });
}

// /**
//  * plays dice audio without throwing error when user hasn't interacted with document
//  */
// function playDiceAudio() {
//     if (dice_roll.muted != true) {
//         let playPromise = dice_roll.play();
//         if (playPromise !== undefined) {
//             playPromise.then(_ => {
//         })
//         .catch(error => {});
//         }
//     }
// }

/**
 * sets global ROLL variable
 * @returns randomly chosen number between 0 and 4 to represent the random dice roll
 */
function roll(){
    sum = 0;
    dieList = [0,0,1,1];
    for(let x = 0; x < 4; x++){
        die = dieList[Math.floor(Math.random()*4)]      //picks a random number between 0-3 to get randomized dice
        sum += die
    }
    ROLL = sum;
    animateDice();
    hasRolled = true;
    console.log("roll: " + ROLL);
    $(document).ready(function() {
        if(turn === 1) {
            $(".turnDisplay1").html("Player " + turn + " rolled a: " + ROLL);
        } else {
            $(".turnDisplay2").html("Player " + turn + " rolled a: " + ROLL);
        }
    });
    playDiceAudio();
    
    if (turn === 2 && ROLL === 0) {
        $(".turnDisplay2").html("Player " + turn + " rolled a: " + ROLL);
        console.log(turn);
        turn = 1;
        console.log(turn);
        roll();
        if (ROLL === 0) {
            return ROLL;
        }
        let b = aiPlay(1);
        gameRun(b.team,b.piece.id);
    }
    //calls to enable the pieces of the players whose turn it is
    let isRoll = true;
    disablesPieces(isRoll);
    
    return ROLL;
}
/**
 * adjusts players score and sets piece location to 14
 * @param {*} team - the team that is scoring (1 or 2)
 * @param {*} piece  - the player's piece that has scored 
 */
function playerScored(team,piece) {
    if (team == 1) {
        p1Score += 1;
    } else {
        p2Score += 1;
        Human.addScore();
    }
    $(document).ready(function() {
        //let player;
        let yLevel;     //this will change the "top" or "bottom" of the piece depending on the team
        let left;
        if (piece.team==1){
            //player= p1Pieces; 
            yLevel="top";
            left= (piece.id+1)*50;
        }
        else {
            //player= p2Pieces;
            yLevel="bottom";
            left = (piece.id-4)*50;
        }
        $("#p"+piece.id).css("right", left +"px");
        $("#p"+piece.id).css("left", "");
        $("#p"+piece.id).css("top", "");
        $("#p"+piece.id).css(yLevel, "25px");
        $("#p"+piece.id).detach().appendTo(".grid-container");
        piece.location = 14;
        piece.onBoard = false;
    });
}
/**
 * @returns false if no one has won yet, true if a player has scored 5 pieces.
 */
function checkIfWon() { 
    let gameOver = false;
    if (p1Score === 5) {
        gameOver = true;
        winner = AI;
    } else if (p2Score === 5) {
        gameOver = true;
        winner = Human;
    }
    if (gameOver) {
        player = JSON.stringify(Human);
        localValueSaver('human', player);
        transitionToPage('gameOver.html');
    }
    return gameOver;
}

function startGame() {
    ROLL = roll();
}
//START
//** onclick buttons start gameRun() */

var turn = 2;

var ROLL; //= roll();
var board = [];
var p1Score = 0; p2Score = 0;
board = setInitialState();

var totalPieces = getButtons();
var p1Pieces = totalPieces.splice(0,5);
var p2Pieces = totalPieces;
var AI = new Player(1, p1Pieces);
var Human = new Player(2, p2Pieces);
var winner = undefined;

totalPieces = p1Pieces.concat(p2Pieces);
board = updateOccupied(board,totalPieces);
console.log(board);
//console.log(Human);

window.requestAnimationFrame(function() {
    startGame();
})

// let out = net.train(trainData,config);
// var jsonData = net.toJSON();
// jsonData = JSON.stringify(jsonData);

// function download(content, fileName, contentType) {
// let a = document.createElement("a");
// let file = new Blob([content], {type: contentType});
// a.href = URL.createObjectURL(file);
// a.download = fileName;
// a.click();
// }
// download(jsonData, 'newNeural2.json', 'application/json');
