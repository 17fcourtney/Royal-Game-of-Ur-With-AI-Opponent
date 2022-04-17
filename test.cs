 private static Node minMaxOfProbability(Board currentBoard, bool isAiTurn, int curDepth, int maxDepth, PlayerColor color, int roll) {
        Node minOrMaxNode = new Node(null, 0);
        float probability = rollProbability[roll];
        Position[] possiblePositionOfPiecesToMove = currentBoard.getValidMovesForPlayer(color, roll);
        for (var i = 0; i < possiblePositionOfPiecesToMove.Length; i++) {
            Position start = possiblePositionOfPiecesToMove[i];
            Position end = currentBoard.getLandingPositionFrom(start, roll, color);
            Board newBoard = new Board(currentBoard);
            newBoard.aiMove(start, end, color);

            float boardValue = value(newBoard, !isAiTurn, curDepth, maxDepth, Board.otherColor(color), -1).value * probability;

            //set min max node
            if (minOrMaxNode.move == null) {
                minOrMaxNode = new Node(start, boardValue);
            } else {
                if (!isAiTurn) {
                    if (boardValue < minOrMaxNode.value) {
                        minOrMaxNode = new Node(start, boardValue);
                    }
                }else {
                    if (boardValue > minOrMaxNode.value) {
                        minOrMaxNode = new Node(start, boardValue);
                    }
                }

            }
        }
        return minOrMaxNode;
    }

}

private static Node value(Board currentBoard, bool aiTurn, int curDepth, int maxDepth, PlayerColor color, int existingRoll) {
        curDepth++;

        if (curDepth == maxDepth) {
            return new Node(null, evalutateBoard(currentBoard, color) );
        }

        if(existingRoll != -1) {
            return minMaxOfProbability(currentBoard, aiTurn, curDepth, maxDepth, color, existingRoll);
        }

        return minMax(currentBoard, aiTurn, curDepth, maxDepth, color);
    }


     private static Node minMax(Board currentBoard, bool isAiTurn, int curDepth, int maxDepth, PlayerColor color) {
        Node minOrMaxNode = new Node(null, 0);
        for (int roll = 1; roll < rollProbability.Length; roll++){
            Node currentBestNode = minMaxOfProbability(currentBoard, isAiTurn, curDepth, maxDepth, color, roll);

            if (minOrMaxNode.move == null) {
                minOrMaxNode = currentBestNode;
            } else {
                if (!isAiTurn) {
                    if (currentBestNode.value < minOrMaxNode.value) {
                        minOrMaxNode = currentBestNode;
                    }
                } else {
                    if (currentBestNode.value > minOrMaxNode.value) {
                        minOrMaxNode = currentBestNode;
                    }
                }
            }

        }

        return minOrMaxNode;
    }