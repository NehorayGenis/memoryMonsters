// Those are global variables, they stay alive and reflect the state of the game
var elPreviousCard = null;
var flippedCouplesCount = 0;
var elBtn = document.querySelector('.toggle');
var elDivs = document.querySelectorAll('div');
var isProcessing =false;
var elName=document.querySelector('.playerName');
var elTimer=document.querySelector('.countdown');
var elRecord=document.querySelector('.oldRecord');
var startTime=0;
var endTime=0
var counting =1;
var elStopwatch=document.querySelector('.stopwatch');
var timerInterval;

elRecord.innerText=localStorage.getItem('record');


// This is a constant that we dont change during the game (we mark those with CAPITAL letters)
var TOTAL_COUPLES_COUNT = 3;

// Load an audio file
var audioWin = new Audio('sound/win.mp3');
var audioWrong = new Audio('sound/wrong.mp3');
var audioRight = new Audio('sound/right.mp3');
// determine the user's name
localStorage.setItem('userName','');
var userName = localStorage.getItem('userName');
if(userName ==''){
    userName= prompt('please enter your name:','guest');
    localStorage.setItem('userName',userName);
    elName.innerText=userName;
}

// This function is called whenever the user click a card
function cardClicked(elCard) {
   
    // If the user clicked an already flipped card - do nothing and return from the function
    if (elCard.classList.contains('flipped') || isProcessing) {
        return;
    }
    if(elPreviousCard === null && counting){
        counting--;
        startTime= Date.now();
        startTimer();
        
    }
    // Flip it
    elCard.classList.add('flipped');
    
    // This is a first card, only keep it in the global variable
    if (elPreviousCard === null) {
        elPreviousCard = elCard;
    } else {
        // get the data-card attribute's value from both cards
        var card1 = elPreviousCard.getAttribute('data-card');
        var card2 = elCard.getAttribute('data-card');
        
        // No match, schedule to flip them back in 1 second
        if (card1 !== card2){
            isProcessing =true;
            setTimeout(function () {
                elCard.classList.remove('flipped');
                elPreviousCard.classList.remove('flipped');
                elPreviousCard = null;
                audioWrong.play();
                isProcessing =false;
            }, 1000)
            
        } else {
            // Yes! a match!
            isProcessing =true;
            flippedCouplesCount++;
            elPreviousCard = null;
            audioRight.play();
            isProcessing =false;
            
            // All cards flipped!
            if (TOTAL_COUPLES_COUNT === flippedCouplesCount) {
                audioWin.play();
                toggle_visibility (elBtn);
                endTime=Date.now();
                update_timer(startTime,endTime);
                clearInterval(timerInterval);
            }
            
        }
        
    }
    
}


// visibility of the reset button
function toggle_visibility (btn){
    if(btn.style.display == 'block')
        btn.style.display = 'none';
       else
         btn.style.display = 'block';
}

// reseting the game
function resetScore(){
    flippedCouplesCount = 0;
    elPreviousCard = null;
    for(var i=1 ;i < elDivs.length; i++){
        elDivs[i].classList.remove('flipped');
    }
    toggle_visibility (elBtn);
    startTime=0;
    endTime=0;
    counting=1;
    elTimer.innerText = '0.0 seconds';
    shuffle();
}

// changing the user's name
function changeUser(){
    userName= prompt('please enter your name:','guest');
    localStorage.setItem('userName',userName);
    elName.innerText=userName;
}

// updating the timer
function update_timer(starting,finished){
    var totalSecond=finished - starting;
    var totalMili=finished - starting;
    totalMili = totalMili % 1000;
    var oldRecord=localStorage.getItem('record');
    var newTime =finished - starting;
    totalSecond=Math.floor(totalSecond / 1000);
    elTimer.innerText = totalSecond + '.' + totalMili +' seconds';
    if(newTime < oldRecord || !oldRecord){
        localStorage.setItem('record',newTime);
        elRecord.innerText=totalSecond + '.' + totalMili +' seconds';
        console.log(oldRecord);
    }else(localStorage.setItem('record',oldRecord))
    console.log(localStorage.getItem('record'));
}

function shuffle() {
    const board = document.querySelector('.board');
    for (let i = board.children.length; i >= 0; i--) {
      board.appendChild(board.children[(Math.random() * i) | 0]);
    }
  }

function startTimer() {
    clearInterval(timerInterval);
    let ms = 0;
    timerInterval = setInterval(function () {
      ms += 15;
      elStopwatch.innerText = ms;
    }, 15);
 }
