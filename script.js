const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const loader = document.getElementById('loader');

// show loading
function loading() {
  loader.hidden = false;
  quoteContainer.hidden = true;
}
// Hide loading
function complete() {
  // if loader hidden is false
  if (!loader.hidden) {
    // show quote container
    quoteContainer.hidden = false;
    // hide the loader
    loader.hidden = true;
  }
}
// Get quote from API
// asynchronous api call
// fetch uses a CORS policy if you are calling an api from a different origin it will be blocked. Local host is trying to call the url below
// when using free api's this happens - because it might not be properly configured to send CORS headers - which would allow this to work
// calling a proxy api first - then call quote api after to get around the CORS error
async function getQuote() {
  loading();
  // this has been set up for anyone to use. You can create your own - more reliable to have your own version of a proxyURL
  const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  const apiUrl =
    'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';
  try {
    // response await for fetch to complete from the URL
    // response will not be set until it finishes returning the response
    const response = await fetch(proxyUrl + apiUrl);
    // data await for response and come back in json format
    // data will not be set until the response has been set
    const data = await response.json();
    // dynamically add quote text and author text - if no author then add unknown.
    if (data.quoteAuthor === '') {
      authorText.innerText = 'Unknown';
    } else {
      authorText.innerText = data.quoteAuthor;
    }
    // If the text is too long apply the long-quote class - otherwise remove the long quote class.
    if (data.quoteText.length > 150) {
      quoteText.classList.add('long-quote');
    } else {
      quoteText.classList.remove('long-quote');
    }
    quoteText.innerText = data.quoteText;
    console.log(data);
    // stop loader, show quote
    complete();
  } catch (error) {
    // if there is an error get a new quote
    getQuote();
    // console.log('whoops, no quote', error);
  }
}
// twitter function
function tweetQuote() {
  const quote = quoteText.innerText;
  const author = authorText.innerText;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;
  // open a new tab - pass in twitter url from above
  window.open(twitterUrl, '_blank');
}

// event listeners
newQuoteBtn.addEventListener('click', getQuote);
twitterBtn.addEventListener('click', tweetQuote);

// Run on page load
getQuote();
