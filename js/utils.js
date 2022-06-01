function downloadObjectAsJson(exportObj, exportName){
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
  var downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", exportName + ".json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

// const myEvent = new Event("myCustomEvent");
// document.addEventListener("click", e => { 
//   if (dice_roll.muted) {
//     console.log('audio is muted');
//   }
  
// });
var oof = new Audio('/audio/oof.mp3');
var dice_roll = new Audio('/audio/dice_roll.mp3');
function setInitialAudio() {
  let muteStatus = localValueGetter('mute');
  if (muteStatus != null) {
    if (muteStatus == 'yes') {
      muteAudio();
      $(".speaker").ready(function() {
        $(".speaker").addClass("mute");
      })
    } else {
      unmuteAudio();
    }
  }
}

/**
 * plays dice audio without throwing error when user hasn't interacted with document
 */
 function playDiceAudio() {
  if (dice_roll.muted != true) {
      let playPromise = dice_roll.play();
      if (playPromise !== undefined) {
          playPromise.then(_ => {
      })
      .catch(error => {});
      }
  }
}

function muteAudio() {
  dice_roll.muted = true;
  oof.muted = true;
}

function unmuteAudio() {
  dice_roll.muted = false;
  oof.muted = false;
}

function localValueSaver(key, value) {
  localStorage.setItem(key,value);
}
function localValueGetter(key) {
  return localStorage.getItem(key);
}

function setGameOverStats() {
  let player = localValueGetter('human');
  player = JSON.parse(player);
  
  if (player.team === 2) {
    $("#winner").html("YOU WON AGAINST THE AI OPPONENT ON "+player.difficulty+" DIFFICULTY!"); 
  } else {
    $("#winner").html("YOU LOST AGAINST THE AI OPPONENT ON "+player.difficulty+" DIFFICULTY!");
  }
  $("#numMoves").html("YOU COMPLETED "+player.moves+" MOVES DURING THE GAME.");
  $("#piecesRemoved").html("YOU REMOVED "+player.opponentsRemoved+" ENEMY PIECES DURING THE GAME.");
}

document.addEventListener('DOMContentLoaded', event => {
  let lastPage = '/'+event.target.referrer.split('/')[3];
  let pathName = event.target.location.pathname;
  if (pathName === '/gameOver.html') {
    setGameOverStats();
  } else if (pathName === '/index.html' || pathName === '/chooseDifficulty.html' && lastPage === '/gameOver.html') {
    localStorage.removeItem('human');
  } else if (pathName === '/board.html') {
    setInitialAudio();
  }
});

if (window.location.pathname === '/board.html') {
  let speaker = document.querySelector('#speakerClick');
  document.addEventListener("keydown", e => {
    e.preventDefault();
    if (e.code === 'Space') {
      if (hasRolled && turn === 2) {
        roll();
      } 
    }
  })
  speaker.addEventListener("click", e => { 
    e.preventDefault();
    if ($('.speaker').hasClass("mute")) { //already muted, switch back to unmuted
      $('.speaker').removeClass("mute");
      unmuteAudio();
      localValueSaver('mute', 'no');
    } else {
      $('.speaker').addClass("mute");
      muteAudio();
      localValueSaver('mute', 'yes');
    }
  })
}

if (window.location.pathname === '/chooseDifficulty.html') {
    $(document).on("click",".difficulty_buttons", function() {
        if ($(this).attr('id') == 'beginnerButton') {
          localValueSaver('difficulty','nets/lessAggressiveAI.json');
        } else {
          localValueSaver('difficulty','nets/neural.json');
        }
    });    
}

/**
 * Used to pause execution and wait until the provided amount of ms passes.
 * @param {*} ms The amount of time in ms to pause for.
 * @returns execution awaits for ms
 */
 function sleep(ms) {
  return new Promise(
    resolve => setTimeout(resolve, ms)
  );
}