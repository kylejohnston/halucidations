// script.js

let quotes = [];
const finalMessage = "You've reached the end of the line, but the train was imaginary.";

let currentQuoteIndex = 0;
const quoteEl = document.getElementById("quote");
const nextBtn = document.getElementById("next");

// Fisher-Yates shuffle function
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function getNextQuote() {
  if (currentQuoteIndex >= quotes.length - 1) {
    // No change needed for the text content here, as the final message is handled in showNextQuote
    nextBtn.disabled = true;
    return finalMessage;
  }
  currentQuoteIndex++;
  return quotes[currentQuoteIndex];
}

function showQuote(quote) {
  quoteEl.style.transition = "opacity 0.6s ease";
  quoteEl.style.opacity = 0;
  setTimeout(() => {
    quoteEl.textContent = quote;
    quoteEl.style.opacity = 1;
  }, 600);
}

function showNextQuote() {
    const quote = getNextQuote();
    if (quote) {
        showQuote(quote);
    }
}

nextBtn.addEventListener("click", showNextQuote);

// Load quotes from external JSON
fetch('quotes.json')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    quotes = data;
    shuffleArray(quotes); // Shuffle the quotes once
    showQuote(quotes[currentQuoteIndex]); // Show the first quote
  })
  .catch(err => {
    quoteEl.textContent = "Failed to load quotes.";
    console.error("Error loading quotes.json", err);
  });

let touchStartX = 0;
let touchEndX = 0;

function handleGesture() {
  const threshold = 50; // Minimum swipe distance
  if (touchEndX < touchStartX - threshold || touchEndX > touchStartX + threshold) {
    showNextQuote();
  }
}

document.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleGesture();
});