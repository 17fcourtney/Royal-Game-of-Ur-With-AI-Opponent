
const config = {
  errorThresh: 0.0005, 
  hiddenLayers: [32,32,32,32], 
  log: true,
  iterations: 300000,
};

const net = new brain.NeuralNetworkGPU();

fetch('./neural.json')
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
  input: {
    position: 3,
    roll: 2,
    rosette: false,
    removeEnemyPiece: true
  },
  output: {
    result: .75
  } 
},
{
  input: {
    position: 5,
    roll: 3,
    rosette: false,
    removeEnemyPiece: true
  },
  output: {
    result: .80
  } 
},
{
  input: {
    position: 9,
    roll: 4,
    rosette: true,
    removeEnemyPiece: false
  },
  output: {
    result: .8
  }
},
{
  input: {
    position: -1,
    roll: 2,
    rosette: false,
    removeEnemyPiece: false
  },
  output: {
    result: .7
  }
},
{
  input: {
    position: -1,
    roll: 1,
    rosette: false,
    removeEnemyPiece: false
  },
  output: {
    result: .7
  }
},
{
  input: {
    position: 0,
    roll: 3,
    rosette: true,
    removeEnemyPiece: false
  },
  output: {
    result: .85
  }
},
{
  input: {
    position: 13,
    roll: 1,
    rosette: true,
    removeEnemyPiece: false
  },
  output: {
    result: 1.0
  }
},
{
  input: {
    position: 4, //move to danger zone rosette
    roll: 3,
    rosette: true,
    removeEnemyPiece: false
  },
  output: {
    result: .90
  }
},
{
  input: {
    position: 7,
    roll: 3,
    rosette: false,
    removeEnemyPiece: true
  },
  output: {
    result: .7
  }  
},
{
  input: {
    position: 7,
    roll: 3,
    rosette: false,
    removeEnemyPiece: false
  },
  output: {
    result: .60
  }
},
{
  input: {
    position: 2,
    roll: 1,
    rosette: true,
    removeEnemyPiece: false
  },
  output: {
    result: .9
  }
},
{
  input: {
    position: 7,
    roll: 1,
    rosette: false,
    removeEnemyPiece: false
  },
  output: {
    result: .2
  }
},
{
  input: {
    position: 7,
    roll: 2,
    rosette: false,
    removeEnemyPiece: false
  },
  output: {
    result: .2
  }
},
{
  input: {
    position: 5,
    roll: 2,
    rosette: true,
    removeEnemyPiece: false
  },
  output: {
    result: .75
  }
},
{
  input: {
    position: -1,
    roll: 4,
    rosette: true,
    removeEnemyPiece: false
  },
  output: {
    result: .90
  }
},
{
  input: {
    position: -1,
    roll: 0,
    rosette: false,
    removeEnemyPiece: false
  },
  output: {
    result: 0
  }
},
{
  input: {
    position: 0,
    roll: 1,
    rosette: false,
    removeEnemyPiece: false
  },
  output: {
    result: 0
  }
},
{
  input: {
    position: 2,
    roll: 0,
    rosette: false,
    removeEnemyPiece: false
  },
  output: {
    result: 0
  }
},
{
  input: {
    position: 3,
    roll: 0,
    rosette: false,
    removeEnemyPiece: false
  },
  output: {
    result: 0
  }
},
{
  input: {
    position: 4,
    roll: 0,
    rosette: false,
    removeEnemyPiece: false
  },
  output: {
    result: 0
  }
},
{
  input: {
    position: 5,
    roll: 0,
    rosette: false,
    removeEnemyPiece: false
  },
  output: {
    result: 0
  }
},
{
  input: {
    position: 6,
    roll: 0,
    rosette: false,
    removeEnemyPiece: false
  },
  output: {
    result: 0
  }
},
{
  input: {
    position: 7,
    roll: 0,
    rosette: false,
    removeEnemyPiece: false
  },
  output: {
    result: 0
  }
},
{
  input: {
    position: -1,
    roll: 3,
    rosette: false,
    removeEnemyPiece: false
  },
  output: {
    result: .7
  }
},
{
  input: {
    position: 0,
    roll: 1,
    rosette: false,
    removeEnemyPiece: false
  },
  output: {
    result: .6
  }
},
{
  input: {
    position: 0,
    roll: 2,
    rosette: false,
    removeEnemyPiece: false
  },
  output: {
    result: .65
  }
},
{
  input: {
    position: 1,
    roll: 1,
    rosette: false,
    removeEnemyPiece: false
  },
  output: {
    result: .5
  }
},
{
  input: {
    position: 7,
    roll: 2,
    rosette: false,
    removeEnemyPiece: true
  },
  output: {
    result: .8
  }
},
{
  input: {
    position: 7,
    roll: 3,
    rosette: false,
    removeEnemyPiece: true
  },
  output: {
    result: .8
  }
},
{
  input: {
    position: 12,
    roll: 2,
    rosette: false,
    removeEnemyPiece: false
  },
  output: {
    result: .99
  }
},
];

// let out = net.train(trainData,config);
// console.log(out);

function run(input) {
  return (net.run(input));
}

// let out = net.train(trainData,config);
// var jsonData = net.toJSON();
// jsonData = JSON.stringify(jsonData);

// function download(content, fileName, contentType) {

// var a = document.createElement("a");
// var file = new Blob([content], {type: contentType});
// a.href = URL.createObjectURL(file);
// a.download = fileName;
// a.click();
// }
// download(jsonData, 'neural.json', 'application/json');