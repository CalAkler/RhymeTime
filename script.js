// GOAL:
// Create an app that generates a random word and lets the user submit rhymes of that word for points
  // when user clicks start button:
    // get a random word from wordlist array -- if time, get random word from a second API word generator
      // pass randomWord into Datamuse API request to get list of possible rhymes
    // start a 60 second timer and display it
    // display score and scoreMultiplier
  // check rhymes submitted by user against rhymes from API
    // if user rhyme === datamuse rhyme increase score by 10 
      // display correct rhymes on page 
      // if user submits same rhyme more than once, do not score points again
    // increase scoreMultiplier by 1 for every 5 correct rhymes
  // when timer ends, end game and display finalScore
    

// namespace object
const app = {}

// score variables
let score = 0
let scoreMultiplier = 1

// audio variable
app.audio = new Audio('./assets/ding.wav')

// cache jQuery selectors
$button = $('.button')
$startButton = $('.startButton')
$counter = $('.counter span')
$h2 = $('h2')
$score = $('.score')
$scoreX = $('.scoreX')
$form = $('form')
$userInput = $('#user-input')
$message = $('.message')
$foundWords = $('.foundWords')
$game = $('.game')

// array of words to be randomly selected by API request -- replace with 2nd API if there's time
const wordlist = [
  {
    phrase: "big"
  },
  {
    phrase: "small"
  },
  {
    phrase: "far"
  },
  {
    phrase: "close"
  },
  {
    phrase: "cat"
  },
  {
    phrase: "sad"
  },
  {
    phrase: "good"
  },
  {
    phrase: "cap"
  },
  {
    phrase: "right"
  },
  {
    phrase: "wrong"
  },
  { phrase: "hot"

  },
  {
    phrase: "cool"
  }
]

const randomWord = wordlist[Math.floor(Math.random() * wordlist.length)].phrase

// empty array to be filled by correct user answers
app.userAnswers = []


// function to start a countdown timer
app.countdown = () => {
  let time = 60 
  timer = setInterval(() => {
    $counter.html(`${time--}`).addClass("clockColour")
    if(time === -1) {
      clearInterval(timer) 
      app.gameEnd()
    }
  }, 1000)
};

// function to increase scoreMultiplier
app.multiplier = () => {
  if(score % 50 === 0) {
    scoreMultiplier++
  }
};

// function to handle API request
app.getRhymes = () => {
  $.ajax({
    url: 'https://api.datamuse.com/words', 
    method: 'GET', 
    dataType: 'json',
    data: {
      rel_rhy: randomWord
    }
  }).then(result => {
    rhymeList = result
  })
};

// function to check user input against list of words from API request
app.rhymeChecker = (possibleRhyme) => {
  rhymeList.forEach(rhyme => {
    const dataRhyme = rhyme.word
    const userRhyme = possibleRhyme
    // if user submits a correct rhyme and hasn't submitted it before
    if (dataRhyme === userRhyme && !app.userAnswers.includes(userRhyme)) {
      // push answer to answers array
      app.userAnswers.push(userRhyme)
      // play sound
      app.audio.play()
      // increase score
      score = score + 10
      $score.text(`${score}`)
      // score multiplier
      app.multiplier()
      $scoreX.text(`x${scoreMultiplier}`)
      // add rhyme to html list
      $foundWords.append(`<li>${userRhyme}</li>`)
    }
  })
};

app.getUserInput = () => {
  // listen for user submission of form
  $form.on("submit", (e) => { 
    e.preventDefault()
    // take user input value  
    const possibleRhyme = $userInput.val()
    // pass input value as argument to app.rhymeChecker 
    app.rhymeChecker(possibleRhyme)     
    // clear user input
    $userInput.val("")  
  })
};

// function to start game and generate a random word
app.startGame = () => {
  // event listener on start button
  $startButton.on("click", () => {
    app.getRhymes(randomWord)
    app.getUserInput()
    // remove startButton from html
    $button.html(``)
    // display word in html
    $h2.text(randomWord).addClass("rhymeColour")
    // start timer countdown
    app.countdown()
    // display score and scoreMultiplier
    $score.text(`${score}`).addClass("rhymeColour")
    $scoreX.text(`x${scoreMultiplier}`).addClass("rhymeColour") 
  })
};

// function to end game once timer reaches zero
app.gameEnd = () => {
  // display finalScore
  finalScore = score * scoreMultiplier
  $game.html(`<h2>You got <span>${finalScore}</span> points!</h2>`).addClass("rhymeColour")
};

// initialize app
app.init = () => {
  app.startGame()  
};

// document ready
$(() => {
  app.init()
});