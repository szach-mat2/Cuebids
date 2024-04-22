const suits = ['Spades', 'Hearts', 'Clubs', 'Diamonds'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const container = document.querySelector('.container');
const containerCardName = document.querySelector('.containerCardName');
const shuffleButton = document.querySelector('.shuffleButton'); // Select the shuffle button
const toggleButton = document.querySelector('.toggleButton'); // Select the toggle button
const toggleHandsButton = document.querySelector('.toggleHandsButton'); // Select the toggle hands button
const handIndicationBottom = document.querySelector('.handIndicationBottom')
const handIndicationTop = document.querySelector('.handIndicationTop')

let deck = {}; // Declare deck as a global variable
let hand1 = []; // Array to store drawn cards for the first row
let hand2 = []; // Array to store drawn cards for the second row
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
        renderHand(hand2)
        handIndicationBottom.innerHTML='South'
        handIndicationTop.innerHTML='North'
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

// Sort the hands automatically after shuffling
hand1 = sortHand(hand1);
hand2 = sortHand(hand2);

// Render the cards initially
renderVisibleHands();

// Event listener for the shuffle button
shuffleButton.addEventListener('click', () => {
    shuffleDeck();
    // Re-draw hands after shuffling
    hand1 = Object.keys(deck).slice(0, 13);
    hand2 = Object.keys(deck).slice(13, 26);
    // Re-sort the hands after shuffling
    hand1 = sortHand(hand1);
    hand2 = sortHand(hand2);
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
