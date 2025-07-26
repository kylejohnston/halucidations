// script.js

let quotes = [];
const finalMessage = "You've reached the end of the line, but the train was imaginary.";

let shownQuotes = [];
const quoteEl = document.getElementById("quote");
const nextBtn = document.getElementById("next");

function getRandomQuote() {
  if (shownQuotes.length === quotes.length) {
    quoteEl.textContent = finalMessage;
    nextBtn.disabled = true;
    return;
  }
  let quote;
  do {
    quote = quotes[Math.floor(Math.random() * quotes.length)];
  } while (shownQuotes.includes(quote));
  shownQuotes.push(quote);
  return quote;
}

function showQuote(quote) {
  quoteEl.style.transition = "opacity 0.6s ease";
  quoteEl.style.opacity = 0;
  setTimeout(() => {
    quoteEl.textContent = quote;
    quoteEl.style.opacity = 1;
  }, 600);
}

nextBtn.addEventListener("click", () => {
  const quote = getRandomQuote();
  if (quote) showQuote(quote);
});

// Load quotes from external JSON
fetch('quotes.json')
  .then(response => response.json())
  .then(data => {
    quotes = data;
    showQuote(getRandomQuote());
  })
  .catch(err => {
    quoteEl.textContent = "Failed to load quotes.";
    console.error("Error loading quotes.json", err);
  });

// Swipe gesture support with subtle haptic feedback
let touchStartX = 0;
let touchEndX = 0;

function handleGesture() {
  const threshold = 50; // Minimum swipe distance
  if (touchEndX < touchStartX - threshold || touchEndX > touchStartX + threshold) {
    const quote = getRandomQuote();
    if (quote) {
      showQuote(quote);
      if (navigator.vibrate) navigator.vibrate(10); // subtle haptic feedback
    }
  }
}

document.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleGesture();
});