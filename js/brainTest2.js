
const config = {
  errorThresh: 0.0005,
  activation: 'sigmoid', 
  hiddenLayers: [32,32,32,32], 
  log: true,
  logPeriod: 500,
  iterations: 700000,
};

const net = new brain.NeuralNetworkGPU();

difficulty = localStorage.getItem('difficulty');
if (localStorage.getItem('difficulty') != null) {
  difficulty = localStorage.getItem('difficulty');
} else {
  difficulty = 'nets/neural.json';
}

fetch('nets/smallNet.json')
.then(response => response.json())
.then(data => {
  net.fromJSON(data);
});
  
var trainData = [];
/* 
trainData (input) structure prototype
- pieceLocation
- roll
- isSpaceRosette - space to move to
- removeEnemyPiece - remove enemy piece from space to move to? 
*/

trainData = [
	{
        "input": {
            "position": -1,
            "roll": 3,
            "rosette": false,
            "removeEnemyPiece": false
        },
        "output": {
            "result":  0.7164351940155029
        }
    }, {
        "input": {
            "position": 2,
            "roll": 3,
            "rosette": false,
            "removeEnemyPiece": false
        },
        "output": {
            "result":  0.9237062335014343
        }
    }, {
        "input": {
            "position": -1,
            "roll": 1,
            "rosette": false,
            "removeEnemyPiece": false
        },
        "output": {
            "result":  0.6997132897377014
        }
    }, {
        "input": {
            "position": 5,
            "roll": 1,
            "rosette": false,
            "removeEnemyPiece": true
        },
        "output": {
            "result":  0.9439668655395508
        }
    }, {
        "input": {
            "position": -1,
            "roll": 4,
            "rosette": true,
            "removeEnemyPiece": false
        },
        "output": {
            "result":  0.9013631343841553
        }
    }, {
        "input": {
            "position": 3,
            "roll": 2,
            "rosette": false,
            "removeEnemyPiece": false
        },
        "output": {
            "result":  0.8519319891929626
        }
    }, {
        "input": {
            "position": 6,
            "roll": 1,
            "rosette": true,
            "removeEnemyPiece": false
        },
        "output": {
            "result":  0.9447070956230164
        }
    }, {
        "input": {
            "position": 0,
            "roll": 2,
            "rosette": false,
            "removeEnemyPiece": false
        },
        "output": {
            "result":  0.6541269421577454
        }
    }, {
        "input": {
            "position": 2,
            "roll": 2,
            "rosette": false,
            "removeEnemyPiece": false
        },
        "output": {
            "result":  0.8751048445701599
        }
    }, {
        "input": {
            "position": 4,
            "roll": 1,
            "rosette": false,
            "removeEnemyPiece": true
        },
        "output": {
            "result":  0.9040418863296509
        }
    }, {
        "input": {
            "position": -1,
            "roll": 3,
            "rosette": false,
            "removeEnemyPiece": false
        },
        "output": {
            "result":  0.7164351940155029
        }
    }, {
        "input": {
            "position": 2,
            "roll": 2,
            "rosette": false,
            "removeEnemyPiece": false
        },
        "output": {
            "result":  0.8751048445701599
        }
    }, {
        "input": {
            "position": -1,
            "roll": 3,
            "rosette": false,
            "removeEnemyPiece": false
        },
        "output": {
            "result":  0.7164351940155029
        }
    }, {
        "input": {
            "position": 2,
            "roll": 2,
            "rosette": false,
            "removeEnemyPiece": false
        },
        "output": {
            "result":  0.8751048445701599
        }
    }, {
        "input": {
            "position": 4,
            "roll": 2,
            "rosette": false,
            "removeEnemyPiece": true
        },
        "output": {
            "result":  0.7417169809341431
        }
    }, {
        "input": {
            "position": -1,
            "roll": 3,
            "rosette": false,
            "removeEnemyPiece": false
        },
        "output": {
            "result":  0.7164351940155029
        }
    }, {
        "input": {
            "position": 2,
            "roll": 2,
            "rosette": false,
            "removeEnemyPiece": false
        },
        "output": {
            "result":  0.8751048445701599
        }
    }, {
        "input": {
            "position": -1,
            "roll": 3,
            "rosette": false,
            "removeEnemyPiece": false
        },
        "output": {
            "result":  0.7164351940155029
        }
    }, {
        "input": {
            "position": 4,
            "roll": 2,
            "rosette": false,
            "removeEnemyPiece": true
        },
        "output": {
            "result":  0.7417169809341431
        }
    }, {
        "input": {
            "position": 2,
            "roll": 1,
            "rosette": true,
            "removeEnemyPiece": false
        },
        "output": {
            "result":  0.9015526175498962
        }
    }, {
        "input": {
            "position": 3,
            "roll": 1,
            "rosette": false,
            "removeEnemyPiece": false
        },
        "output": {
            "result":  0.37034475803375244
        }
    }, {
        "input": {
            "position": -1,
            "roll": 4,
            "rosette": true,
            "removeEnemyPiece": false
        },
        "output": {
            "result":  0.9013631343841553
        }
    }, {
        "input": {
            "position": 3,
            "roll": 2,
            "rosette": false,
            "removeEnemyPiece": true
        },
        "output": {
            "result":  0.7500901818275452
        }
    }, {
        "input": {
            "position": 5,
            "roll": 3,
            "rosette": false,
            "removeEnemyPiece": false
        },
        "output": {
            "result":  0.8920873403549194
        }
    }, {
        "input": {
            "position": -1,
            "roll": 3,
            "rosette": false,
            "removeEnemyPiece": false
        },
        "output": {
            "result":  0.7164351940155029
        }
    }
];

// let out = net.train(trainData,config);
// console.log(out);
//  var jsonData = net.toJSON();
//  downloadObjectAsJson(jsonData, 'smallNet');
 
function run(input) {
  return (net.run(input));
}