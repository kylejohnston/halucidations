// script.js

let quotes = [];
const finalMessage = "You've reached the end of the line, but the train was imaginary.";

let currentQuoteIndex = 0;
const quoteEl = document.getElementById("quote");
const nextBtn = document.getElementById("next");
let isAnimating = false; // Flag to prevent animation overlap

// Fisher-Yates shuffle function
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function getNextQuote() {
  if (currentQuoteIndex >= quotes.length - 1) {
    nextBtn.disabled = true;
    return finalMessage;
  }
  currentQuoteIndex++;
  return quotes[currentQuoteIndex];
}

function showQuote(quote) {
  // 1. Check if an animation is already running
  if (isAnimating) return;
  isAnimating = true;

  // 2. Add the class to start the fade-out animation
  quoteEl.classList.add('fade-out');

  // 3. Set a timer that matches the CSS transition duration
  setTimeout(() => {
    // 4. Update the text when the element is fully faded out
    quoteEl.textContent = quote;

    // 5. Remove the class to trigger the fade-in animation
    quoteEl.classList.remove('fade-out');

    // 6. Allow new animations to start again
    isAnimating = false;
  }, 400); // This duration should match the transition time in style.css
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
    // Set the first quote directly without an animation
    quoteEl.textContent = quotes[currentQuoteIndex];
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