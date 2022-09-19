var currentGameState = 'beginningGameMode'
var restartGame = 'beginningGameMode'
var gameCardsDrawn = 'cardsDrawn'
var showGameResults = 'showGameResults'
var hitOrStandMode = 'hitOrStand'
var playerHand = [];
var dealerHand = [];

var makeDeck = function () {
  var cardDeck = [];
  var suits = ['hearts', 'diamonds', 'clubs', 'spades'];

  var suitIndex = 0;
  while (suitIndex < suits.length) {
    var currentCardSuit = suits[suitIndex];

    var rankCounter = 1;
    while (rankCounter <= 13) {

      var cardName = rankCounter;

      if (cardName == 1) {
        cardName = 'ace';
      } else if (cardName == 11) {
        cardName = 'jack';
      } else if (cardName == 12) {
        cardName = 'queen';
      } else if (cardName == 13) {
        cardName = 'king';
      }

      var card = {
        name: cardName,
        suit: currentCardSuit,
        rank: rankCounter,
      };
      cardDeck.push(card);

      rankCounter += 1;
    }
    suitIndex += 1;
  }
  return cardDeck;
};

var getRandomIndex = function (max) {
  return Math.floor(Math.random() * max)}

var shuffleCards = function (cardDeck) {
  var currentCardIndex = 0;
  while (currentCardIndex < cardDeck.length) {
    var randomIndex = getRandomIndex(cardDeck.length);
    var randomCard = cardDeck[randomIndex];
    var currentCardCard = cardDeck[currentCardIndex];
    cardDeck[currentCardIndex] = randomCard;
    cardDeck[randomIndex] = currentCardCard;
    currentCardIndex = currentCardIndex + 1;
  }
  return cardDeck;
};

var createNewDeck = function (){
  var newDeck = makeDeck();
  var shuffledDeck = shuffleCards(newDeck)
  return shuffledDeck
}

var checkForBlackJack = function (handArray) {
  var playerCardOne = handArray[0];
  var playerCardTwo = handArray[1];
  var isBlackJack = false;
    if (  
      (playerCardOne.name == 'ace' && playerCardTwo.rank >= 10) ||
      (playerCardTwo.name == 'ace' && playerCardOne.rank >= 10)
    ) {
    isBlackJack = true;
  }
  return isBlackJack;
};

var calculateTotalHandValue = function (handArray) {
  var totalHandValue = 0;
  var aceCounter = 0;

  var index = 0;
   while (index < handArray.length) {
    var currentCard = handArray[index];
    if (currentCard.name == 'king' || currentCard.name == 'queen' || currentCard.name == 'jack') {
      totalHandValue = totalHandValue + 10;
    }
    else if (currentCard.name == 'ace') {
      totalHandValue = totalHandValue + 11;
      aceCounter = aceCounter + 1;
    } else {
      totalHandValue = totalHandValue + currentCard.rank;
    }
    index = index + 1;
  }
  index = 0;
   while (index < aceCounter) {
    if (totalHandValue > 21) {
      totalHandValue = totalHandValue - 10;
    }
    index = index + 1;
  }

  return totalHandValue;
};

var displayHands = function (playerHandArray, dealerHandArray) {
  var playerMessage = 'Player hand:<br>';
  var index = 0;
    while (index < playerHandArray.length) {
    playerMessage = playerMessage + '- ' + playerHandArray[index].name + ' of ' + playerHandArray[index].suit + '<br>';
    index = index + 1;
  }

  index = 0;
  var dealerMessage = 'Dealer hand:<br>';
    while (index < dealerHandArray.length) {
    dealerMessage = dealerMessage + '- ' + dealerHandArray[index].name + ' of ' + dealerHandArray[index].suit + '<br>';
    index = index + 1;
  }

  return playerMessage + '<br>' + dealerMessage;
};

var displayHandTotalValues = function (playerHandValue, dealerHandValue) {
  var totalHandValueMessage = '<br>Player total hand value: ' + playerHandValue + '<br>Dealer total hand value: ' + dealerHandValue;
  return totalHandValueMessage;
};

var resetGame = function (){
  currentGameState = restartGame;
  playerHand = [];
  dealerHand = [];
}

var main = function (input) {
  var outputMessage = '';

  if (currentGameState == 'beginningGameMode') {
    gameDeck = createNewDeck();

    playerHand.push(gameDeck.pop());
    playerHand.push(gameDeck.pop());
    dealerHand.push(gameDeck.pop());
    dealerHand.push(gameDeck.pop());
    currentGameState = gameCardsDrawn;
    outputMessage = 'Everyone has been dealt a card. Click button to calculate cards!';
    return outputMessage;
  }


  if (currentGameState == gameCardsDrawn) {
    var playerHasBlackJack = checkForBlackJack(playerHand);
    var dealerHasBlackJack = checkForBlackJack(dealerHand);

    if (playerHasBlackJack == true || dealerHasBlackJack == true) {
      if (playerHasBlackJack == true && dealerHasBlackJack == true) {
        outputMessage = displayHands(playerHand, dealerHand) + '<br>Its a Black Jack Tie!'; 
      } 
      else if (playerHasBlackJack == true && dealerHasBlackJack == false) {
        outputMessage = displayHands(playerHand, dealerHand) + '<br>Player wins by Black Jack!';
      } 
      else {
        outputMessage = displayHands(playerHand, dealerHand) + '<br>Dealer wins by Black Jack!'; c
      }
    }
    else {
      outputMessage = displayHands(playerHand, dealerHand) + '<br> There are no Black Jacks. <br>Please input "hit" or "stand".'
      
      currentGameState = hitOrStandMode;
    }

    return outputMessage;
  }


  if (currentGameState == hitOrStandMode) {
    if (input == 'hit') {
      playerHand.push(gameDeck.pop());
      outputMessage = displayHands(playerHand, dealerHand) + '<br> You drew another card. <br>Please input "hit" or "stand".'
    }
    
    else if (input == 'stand') {
      var playerHandTotalValue = calculateTotalHandValue(playerHand);
      var dealerHandTotalValue = calculateTotalHandValue(dealerHand);

      while (dealerHandTotalValue < 17) {
        dealerHand.push(gameDeck.pop());
        dealerHandTotalValue = calculateTotalHandValue(dealerHand);
      }

      if ((playerHandTotalValue == dealerHandTotalValue) ||
          (playerHandTotalValue > 21 && dealerHandTotalValue > 21)) {
        outputMessage = displayHands(playerHand, dealerHand) + "<br>Its a Tie!" + displayHandTotalValues(playerHandTotalValue, dealerHandTotalValue); 
      } 
      
      else if ((playerHandTotalValue > dealerHandTotalValue && playerHandTotalValue <= 21) ||
                (playerHandTotalValue <= 21 && dealerHandTotalValue > 21)) { 
        outputMessage = displayHands(playerHand, dealerHand) + "<br>Player wins!" + displayHandTotalValues(playerHandTotalValue, dealerHandTotalValue); 
      } 

      else {
        outputMessage = displayHands(playerHand, dealerHand) + "<br>Dealer wins!" + displayHandTotalValues(playerHandTotalValue, dealerHandTotalValue); 
      }

      currentGameState =showGameResults;
    }
    else {
      outputMessage = 'Invalid input. Please type either "hit" or "stand".<br><br>' + displayHands(playerHand, dealerHand);
    }

    return outputMessage;
  }
  if(currentGameState == showGameResults){
      var playAgain = resetGame()
      var outputMessage = 'Lets play again!'; playAgain;
    return outputMessage}
};
