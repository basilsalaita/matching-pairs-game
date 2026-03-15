
let cardsArray = [];
let hasShuffled = false;
let clickCount = 0;
let pairCount = 0;
let gameStarted = false;
let firstIndex = null;
let secondIndex = null;
let lockBoard = false;
const suits = ["club", "diamond", "heart", "spade"];


const radioButtons = document.querySelectorAll('input[name="size"]');
const controls = document.getElementById("controls");
const board = document.getElementById("board");
const gameModal = document.getElementById("gameModal");
const modalMessage = document.getElementById("modalMessage");
const playAgain  = document.getElementById("playAgain");
const modalEmojis = document.getElementById("modalEmojis");

const shuffleBtn = document.getElementById("Shuffle");
const startBtn = document.getElementById("Start");

const clicksSpan = document.getElementById("clicks");
const pairsSpan = document.getElementById("pairs");
const stats = document.getElementById("stats");

radioButtons.forEach(radio => {
  radio.addEventListener("change", function () {

    const rows = parseInt(this.value);

    controls.style.display = "block";

    createOrderedBoard(rows);
  });
});

function createOrderedBoard(rows) {

 
  hasShuffled = false;
  gameStarted = false;
  clickCount = 0;
  pairCount = 0;
  gameModal.style.display = "none";
  clicksSpan.textContent = 0;
  pairsSpan.textContent = 0;
  
  shuffleBtn.disabled = false;
  startBtn.disabled = false;
  radioButtons.forEach(r => r.disabled = false);

  
  stats.style.display = "none";

  
  board.innerHTML = "";
  board.style.gridTemplateColumns = "repeat(4, 85px)";

  cardsArray = [];

  
  for (let rank = 1; rank <= rows; rank++) {
    for (let suitIndex = 0; suitIndex < 4; suitIndex++) {

      cardsArray.push({
        suit: suits[suitIndex],
        rank: rank,
        image: `images/images/${suits[suitIndex]}_${rank}.png`,
        faceUp: false,
        matched: false
        });

    }
  }

  renderBoard();
}


function renderBoard() {
  board.innerHTML = "";

  cardsArray.forEach((card, index) => {
    const img = document.createElement("img");
    img.classList.add("card");
    img.dataset.index = index;

    
    if (!gameStarted) {
      img.src = card.image; 
    } else {
      img.src = (card.faceUp || card.matched) ? card.image : "images/images/back.jpg";
    }

    
    if (card.matched) {
      img.classList.add("matched");
    }

   
    img.addEventListener("click", onCardClick);

    board.appendChild(img);
  });
}
function onCardClick(e) {
  if (!gameStarted) return;          
  if (lockBoard) return;             
  const index = parseInt(e.target.dataset.index);

  const card = cardsArray[index];

  if (card.matched) return;          
  if (card.faceUp) return;          

 
  card.faceUp = true;
  e.target.src = card.image;

  
  clickCount++;
  clicksSpan.textContent = clickCount;
  checkGameOver();


  
  if (firstIndex === null) {
    firstIndex = index;
    return;
  }

  
  secondIndex = index;
  lockBoard = true;

  checkPair();
}

function checkPair() {
  const firstCard = cardsArray[firstIndex];
  const secondCard = cardsArray[secondIndex];

  
  const isPair = firstCard.rank === secondCard.rank;

  if (isPair) {
    
    firstCard.matched = true;
    secondCard.matched = true;

    pairCount++;
    pairsSpan.textContent = pairCount;

    
    resetSelection();
    renderBoard();
    checkGameOver();
  } else {
    
    setTimeout(() => {
      firstCard.faceUp = false;
      secondCard.faceUp = false;

      resetSelection();
      renderBoard();
      checkGameOver();
    }, 800);
  }
}


function checkGameOver() {
  if (gameModal.style.display === "flex") return;

  const totalPairs = cardsArray.length / 2;

  if (pairCount === totalPairs) {
    showModal("Congratulations!", "🥳🎉😊");
    return;
  }

  if (clickCount > cardsArray.length * 2) {
    showModal("Game over! Try again!", "😢💔☹️");
  }
}

function showModal(message, emojis) {
  lockBoard = true;
  modalMessage.textContent = message;
  modalEmojis.textContent = emojis;
  gameModal.style.display = "flex";
}



shuffleBtn.addEventListener("click", function () {

  shuffleCards();
  hasShuffled = true;

  renderBoard();
});

function shuffleCards() {

  for (let i = cardsArray.length - 1; i > 0; i--) {

    const randomIndex = Math.floor(Math.random() * (i + 1));

    
    [cardsArray[i], cardsArray[randomIndex]] =
    [cardsArray[randomIndex], cardsArray[i]];
  }
}



startBtn.addEventListener("click", function () {

  
  if (!hasShuffled) {
    alert("Please shuffle the cards before starting the game.");
    return;
  }

  
  gameStarted = true;
  cardsArray.forEach(card => {
    card.faceUp = false;
    card.matched = false;
    });

  firstIndex = null;
  secondIndex = null;
  lockBoard = false;

  clickCount = 0;
  pairCount = 0;

  
  stats.style.display = "flex";
  clicksSpan.textContent = clickCount;
  pairsSpan.textContent = pairCount;

  renderBoard();

  shuffleBtn.disabled = true;
  startBtn.disabled = true;
  radioButtons.forEach(r => r.disabled = true);
});

function resetSelection() {  
  firstIndex = null;  
  secondIndex = null;  
  lockBoard = false;  
}

playAgain.addEventListener("click", function () {
  location.reload();
});