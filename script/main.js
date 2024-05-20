const suits = ['Spades', 'Hearts', 'Clubs', 'Diamonds'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const container = document.querySelector('.container');
const containerCardName = document.querySelector('.containerCardName');
const shuffleButton = document.querySelector('.shuffleButton'); // Select the shuffle button
const toggleButton = document.querySelector('.toggleButton'); // Select the toggle button
const toggleHandsButton = document.querySelector('.toggleHandsButton'); // Select the toggle hands button
const analyze = document.querySelector('.analyze'); 
const anchorAnalyze = document.querySelector('.anchorAnalyze'); 
const handIndicationBottom = document.querySelector('.handIndicationBottom')
const handIndicationTop = document.querySelector('.handIndicationTop')
const biddingOptions = document.querySelector('.bidding-options');
const biddingSpace = document.querySelector('.bidding-space');


let deck = {}; // Declare deck as a global variable
let hand1 = []; // Array to store drawn cards for the first row
let hand2 = []; // Array to store drawn cards for the second row
let hand3 = []; // Array to store drawn cards for the 3 player
let hand4 = []; // Array to store drawn cards for the 4 player
let showHand1 = true; // Flag to toggle visibility of hand 1
let showBothHands = false; // Flag to toggle visibility of both hands
const numCols = 13; // Number of columns


// Function to create a new shuffled deck
function createShuffledDeck() {
    deck = {}; // Reset the deck
    suits.forEach(suit => {
        values.forEach(value => {
            const cardName = `${value} of ${suit}`;
            deck[cardName] = { suit, value };
        });
    });
    // Convert object keys to an array and shuffle it
    const shuffledKeys = Object.keys(deck).sort(() => Math.random() - 0.5);
    // Create a new deck object using shuffled keys
    const shuffledDeck = {};
    shuffledKeys.forEach(key => {
        shuffledDeck[key] = deck[key];
    });
    deck = shuffledDeck; // Update the global deck variable
    // Store the deck in localStorage
    localStorage.setItem('deck', JSON.stringify(deck));
}

// Function to shuffle the deck in place
function shuffleDeck() {
    const shuffledKeys = Object.keys(deck).sort(() => Math.random() - 0.5);
    const shuffledDeck = {};
    shuffledKeys.forEach(key => {
        shuffledDeck[key] = deck[key];
    });
    deck = shuffledDeck; // Update the global deck variable
    // Store the shuffled deck in localStorage
    localStorage.setItem('deck', JSON.stringify(deck));
}

// Function to render the cards for the visible hand(s)
// Function to render the cards for the visible hand(s)
function renderVisibleHands() {
    container.innerHTML = ''; // Clear the container

    // Render hand 2 first (if it should be shown)
    if (!showHand1) {
        renderHand(hand2);
        handIndicationBottom.innerHTML='North'
        handIndicationTop.innerHTML='South'
    }
    if(showBothHands){
        if(!showHand1){
            container.innerHTML=''
            renderHand(hand2)
            renderHand(hand1)
            handIndicationTop.innerHTML='North'    
            handIndicationBottom.innerHTML='South'
        }else{
            renderHand(hand2)
            handIndicationBottom.innerHTML='South'
            handIndicationTop.innerHTML='North'
        }
    }

    // Render hand 1
    if (showHand1) {
        renderHand(hand1);
        handIndicationBottom.innerHTML='South'
        handIndicationTop.innerHTML='North'
    }
}


// Function to render a single hand
function renderHand(hand) {
    // Create and append cards to the row container
    const rowContainer = document.createElement('div');
    rowContainer.classList.add('row-container');
    container.appendChild(rowContainer);

    for (let j = 0; j < numCols; j++) {
        const index = j;
        if (index >= hand.length) break;

        const cardName = hand[index];
        const card = document.createElement('div');
        card.classList.add('card');
        card.textContent = cardName.split(' ')[0]; // Display only the value on the card
        card.style.backgroundImage = `url('img/${deck[cardName].suit.toLowerCase()}.svg')`;
        card.dataset.cardName = cardName; // Set custom data attribute to store card name
        rowContainer.appendChild(card);

        // card.addEventListener('click', (event) => {
        //     const clickedCardName = event.target.dataset.cardName; // Retrieve card name from custom data attribute
        //     containerCardName.textContent = clickedCardName; // Display the clicked card name
        //     console.log(clickedCardName);
        // });
    }
}


// Custom sorting algorithm for sorting cards based on suit color and card value
function sortHand(hand) {
    const suitsOrder = ['Spades', 'Hearts', 'Clubs', 'Diamonds'];

    // Group cards by suit
    const groupedCards = {};
    hand.forEach(card => {
        const suit = card.split(' ')[2];
        if (!groupedCards[suit]) {
            groupedCards[suit] = [];
        }
        groupedCards[suit].push(card);
    });

    // Sort the cards within each suit group based on their order in suitsOrder
    for (const suit of suitsOrder) {
        if (groupedCards[suit]) {
            groupedCards[suit].sort((a, b) => {
                const valueA = values.indexOf(a.split(' ')[0]);
                const valueB = values.indexOf(b.split(' ')[0]);
                return valueB - valueA; // Reverse the order of sorting
            });
        }
    }

    // Concatenate sorted cards from all suits
    const sortedHand = suitsOrder.reduce((acc, suit) => {
        if (groupedCards[suit]) {
            return acc.concat(groupedCards[suit]);
        }
        return acc;
    }, []);

    return sortedHand;
}
function parseHand(hand, deck) {
    const suitsOrder = ['Spades', 'Hearts', 'Diamonds', 'Clubs'];
    const suitLetters = ['S', 'H', 'D', 'C'];
    let parsedHand = '';

    // Group cards by suit
    const groupedCards = {};
    hand.forEach(card => {
        const suit = deck[card].suit;
        if (!groupedCards[suit]) {
            groupedCards[suit] = [];
        }
        groupedCards[suit].push(deck[card].value === '10' ? 'T' : deck[card].value);
    });

    // Concatenate the values of each suit in the desired format
    suitsOrder.forEach((suit, index) => {
        if (groupedCards[suit]) {
            parsedHand += suitLetters[index] + groupedCards[suit].join('') + '.';
        } else {
            parsedHand += '.';
        }
    });

    // Remove the trailing dot
    parsedHand = parsedHand.slice(0, -1);

    return parsedHand;
}



function joinHands(hand1, hand2, hand3,hand4) {
    const parsedHand1 = parseHand(hand1, deck);
    const parsedHand2 = parseHand(hand2, deck);
    const parsedHand3 = parseHand(hand3, deck);
    const parsedHand4 = parseHand(hand4, deck);    
    return `http://127.0.0.1:5501/bsol/ddummy.htm?lin=qx|1|md|3${parsedHand1},${parsedHand2},${parsedHand3},${parsedHand4}|sv|0|`;
}


// Check if deck exists in localStorage
const storedDeck = localStorage.getItem('deck');
if (storedDeck) {
    deck = JSON.parse(storedDeck); // Retrieve the deck from localStorage
} else {
    createShuffledDeck(); // If not found, create a new shuffled deck
}

// Draw hands of cards for both rows
hand1 = Object.keys(deck).slice(0, 13);
hand2 = Object.keys(deck).slice(13, 26);
hand3 = Object.keys(deck).slice(26, 39);
hand4 = Object.keys(deck).slice(39, 52);

// Sort the hands automatically after shuffling
hand1 = sortHand(hand1);
hand2 = sortHand(hand2);
hand3 = sortHand(hand3);
hand4 = sortHand(hand4);

// Render the cards initially
renderVisibleHands();

// Event listener for the shuffle button
shuffleButton.addEventListener('click', () => {
    shuffleDeck();
    // Re-draw hands after shuffling
    hand1 = Object.keys(deck).slice(0, 13);
    hand2 = Object.keys(deck).slice(13, 26);
    hand3 = Object.keys(deck).slice(26, 39);
    hand4 = Object.keys(deck).slice(39, 52);
    // Re-sort the hands after shuffling
    hand1 = sortHand(hand1);
    hand2 = sortHand(hand2);
    hand3 = sortHand(hand3);
    hand4 = sortHand(hand4);
    renderVisibleHands();
});

// Event listener for the toggle button
toggleButton.addEventListener('click', () => {
    // Toggle the showHand1 flag
    showHand1 = !showHand1;
    // Render the visible hand(s)
    renderVisibleHands();
});

// Event listener for the toggle hands button
toggleHandsButton.addEventListener('click', () => {
    // Toggle the showBothHands flag
    showBothHands = !showBothHands;
    if(showBothHands==true){
        toggleButton.disabled = true
    }else{
        toggleButton.disabled = false
    }
    // Render the visible hand(s)
    renderVisibleHands();
});
analyze.addEventListener('click', ()=>{
    window.open(joinHands(hand1,hand3,hand2,hand4))
})




const bidOptions = document.querySelectorAll('.bid-option');
let lastClickedOption = null; // Variable to store the last clicked option

bidOptions.forEach(option => {
  option.addEventListener('click', () => {
    // Check if the clicked option is the same as the last clicked option
    if (lastClickedOption === option) {
      // Toggle red background and hide bidding options if clicked twice in a row
      option.classList.toggle('selected');
      biddingOptions.classList.toggle('hidden');
    } else {
      // Remove red background from all bid options and hide all bidding options
      bidOptions.forEach(opt => {
        opt.classList.remove('selected');
      });
      biddingOptions.classList.add('hidden');

      // Add red background to the clicked bid option and show bidding options
      option.classList.add('selected');
      biddingOptions.classList.remove('hidden');

      // Add bidding options for colors and no trump
      const bidNumber = option.textContent;
      biddingOptions.innerHTML = ''; // Clear previous options

      const colors = ['club', 'diamond', 'heart', 'spade', 'no-trump'];
      colors.forEach(color => {
        const biddingOptionContainer = document.createElement('div');
        biddingOptionContainer.classList.add('bidding-option-container');

        const biddingOptionSpan = document.createElement('span');
        const biddingOptionImg = document.createElement('img');

        biddingOptionSpan.textContent = `${bidNumber}`;
        biddingOptionImg.src = `../img/${color}.svg`;
        biddingOptionImg.alt = color;
        biddingOptionSpan.classList.add('bidding-option-span');
        biddingOptionImg.classList.add('bidding-option-img')

        // Append span and img to the container
        biddingOptionContainer.appendChild(biddingOptionSpan);
        biddingOptionContainer.appendChild(biddingOptionImg);

        // Append container to the biddingOptions
        biddingOptions.appendChild(biddingOptionContainer);

        // Add click event listener to the container
        biddingOptionContainer.addEventListener('click', () => {
            
        });
      });
    }

    // Update the last clicked option
    lastClickedOption = option;
  });
});




