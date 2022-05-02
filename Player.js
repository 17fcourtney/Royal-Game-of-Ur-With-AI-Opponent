class Player {
    constructor(team) {
        this.team = team;
    }
    moves = 0;

    addMove() {
        this.moves += 1;
    }
}