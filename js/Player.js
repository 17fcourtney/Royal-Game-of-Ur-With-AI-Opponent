class Player {
    constructor(team, pieces) {
        this.team = team;
        this.pieces = pieces;
    }
    moves = 0; score = 0; opponentsRemoved = 0;
    recordedMoves = [];
    difficulty = this.findDifficulty();
    findDifficulty() {
        let currVal = localValueGetter('difficulty');
        if (currVal != null) {
            if (currVal == 'nets/lessAggressiveAI.json') {
                return "Beginner";
            } else {
                return "Normal";
            }
        }
    }
    
    addMove() {
        this.moves += 1;
    }
    addScore() {
        this.score += 1;
    }
    getPiecesOnBoard() {
        let retVal = [];
        for(let x=0; x<this.pieces.length; x++) {
            if(this.pieces[x].onBoard == true)
                retVal.push(this.pieces[x]);
            }
        return retVal;
    }

    removeEnemy(position) {
        let retVal = false;
        let team = getTeamByPosition(position,2);
        let space = getSpace(position, team);
        
        if (position <= 3 || position >= 12 || position == 7) {
            return retVal;
        } else {
            if (space.rosette == true && position == 7) {
                retVal = false;
            }
        } if (space.occupied == true && space.occupiedByPiece.team != 2 && space.team == 3) {
            retVal = true;
        } 
        return retVal;
    }

    recordMove(piece, roll, spaceMovedToLocation) {
        let rosette; let removeOpponent;
        let team = getTeamByPosition(spaceMovedToLocation,2);
        if (spaceMovedToLocation == 14) {
            rosette = false;
            removeOpponent = false;
        } else {
            let spaceMovedTo = getSpace(spaceMovedToLocation,team);
            rosette = spaceMovedTo.rosette;
            removeOpponent = this.removeEnemy(spaceMovedTo.id);
        }
        if (removeOpponent === true) {
            this.opponentsRemoved += 1;
        }
        let input = {
            //piece: piece,
            position: piece.location,
            roll: roll,
            rosette: rosette,
            removeEnemyPiece: removeOpponent
            }; 
        this.recordedMoves.push(
            { input: input,
                output: {
                    result: run(input)//evaluateBoard(piece.location,roll,2)
                }
            }
        );
        console.log(this.recordedMoves); 
        if (this.recordedMoves.length === 25) {
            downloadObjectAsJson(this.recordedMoves,this.moves+'MoveLog');
            this.recordedMoves = []; //reset array of recorded moves to get new data after 25 moves
        }    
    }
}