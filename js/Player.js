class Player {
    constructor(team, pieces) {
        this.team = team;
        this.pieces = pieces;
    }
    moves = 0; score = 0;
    recordedMoves = [];
    difficulty = this.findDifficulty();
    findDifficulty() {
        if (localStorage.getItem('difficulty') != null) {
            if (localStorage.getItem('difficulty') == 'nets/lessAggressiveAI.json') {
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
        for(let x=0; x<this.pieces.length; x++){
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
count = 0;
    recordMove(piece, roll, spaceMovedTo) {
        this.count += 1;
        let input;
        this.recordedMoves.push(
            { input: {
                //piece: piece,
                position: piece.location,
                roll: roll,
                rosette: spaceMovedTo.rosette,
                removeEnemyPiece: this.removeEnemy(spaceMovedTo.id)
                }
            }
        ); 
        console.log(this.recordedMoves);
        if (this.count == 20) {
            downloadObjectAsJson(this.recordedMoves,'test');
        } 
        
    }

}