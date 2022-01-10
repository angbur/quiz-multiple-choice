import { showQuizEndWindow } from './end.js';

  document.querySelector('#app').innerHTML = `  
  <div class=".quiz-container">       
    <div id="quiz-bar" class="hide">
      <div id="hud">
        <div class="hud-item">
          <p id="progressText" class="hud-prefix">
            Pytanie
          </p>
          <div id="progressBar">
            <div id="progressBarFull"></div>
          </div>
        </div>
        <div class="hud-item">
          <p class="hud-prefix">
            Wynik
          </p>
          <h1 class="hud-main-text" id="score">
            0
          </h1>
        </div>
      </div>
    </div>
    <div id="question-container">
      <div id="question"></div>
      <div class="question-frame hide">
        <div id="question-image"></div>
        <div id="answer-buttons">
          <button class="btn btn-answer">Answer 1</button>
          <button class="btn btn-answer">Answer 2</button>
          <button class="btn btn-answer">Answer 3</button>
          <button class="btn btn-answer">Answer 4</button>
        </div>
      </div>
      <div id="quiz-info-container">
        <h1>Quiz wiedzy</h1>

        <p class="intro">Przed Tobą 30 pytań z Reacta.
          Pytania są wielokrotnego wyboru.<br>Jesteś gotowy?</p>
      </div>
      <div class="controls">
        <button id="start-btn" class="start-btn btn"><i class="fas fa-play"></i> Start</button>
        <button id="submit-btn" class="submit-btn btn hide" type="submit">Zatwierdź</button>
        <button id="next-btn" class="next-btn btn hide">Następne pytanie</button>
      </div>
    </div>
  </div>`
  
  const quizInfoContainerElement = document.getElementById('quiz-info-container');
  const quizBarElement = document.getElementById('quiz-bar');
  const startButton = document.getElementById('start-btn');
  const nextButton = document.getElementById('next-btn');
  const submitButton = document.querySelector('#submit-btn');
  const controlsFrame = document.querySelector('.controls');
  const questionContainerElement = document.getElementById('question-container');
  const questionElement = document.getElementById('question');
  const questionImage = document.getElementById('question-image')
  const questionFrameElement = document.querySelector('.question-frame');
  const answerButtonsElement = document.getElementById('answer-buttons');
  const progressText = document.querySelector('#progressText');
  const scoreText = document.querySelector('#score');
  const progressBarFull = document.querySelector('#progressBarFull');

  let shuffledQuestions, currentQuestionIndex, currentQuestion;
  let score =0;
  let questionCounter =0;
  let SCORE_POINTS = 1;
  let MAX_QUESTIONS = 30;

  startButton.addEventListener('click', startGame);
  nextButton.addEventListener('click', () => {
      currentQuestionIndex++;
      setNextQuestion();
    });
  submitButton.addEventListener('click',  checkAnswers);

  let questions = [];
  let correctAnswers = [];
  let correctUserAnswers = 0;

  fetch('src/test.json')
      .then((res) => {
          return res.json();
      })
      .then((loadedQuestions) => {
          questions = loadedQuestions;
      })
      .catch((err) => {
          console.error(err);
      });

  function startGame(){

      nextButton.disabled=true;
      questionCounter = 0;
      score = 0;
      scoreText.innerText = 0;
      
      controlsFrame.style.justifyContent = "space-between";
      startButton.classList.add('hide');
      quizInfoContainerElement.classList.add('hide');
      questionFrameElement.classList.remove('hide');
      quizBarElement.classList.remove('hide');
      submitButton.classList.remove('hide');
      nextButton.classList.remove('hide');

      shuffledQuestions = questions.sort(() => Math.random() - .5);
      shuffledQuestions = shuffledQuestions.slice(0,20);
      currentQuestionIndex = 0;

      questionContainerElement.classList.remove('hide');
      
      if(questionCounter<30){
        setNextQuestion();
      }
    
  };

  function setNextQuestion(){

      questionCounter++;
      progressText.innerText = `Pytanie ${questionCounter}/${MAX_QUESTIONS}`;
      progressBarFull.style.width = `${(questionCounter/MAX_QUESTIONS)*100}%`;
      resetState();
      currentQuestion = shuffledQuestions[currentQuestionIndex];
      
      if (shuffledQuestions.length > currentQuestionIndex + 1) {
        showQuestion(currentQuestion);

      } else {
          localStorage.setItem('mostRecentScore', score);
          const myScore= setTimeout(showQuizEndWindow(),800);
          return  myScore;
      }
  };

  function checkAnswers(e) {
  
    Array.from(answerButtonsElement.children).forEach(button => {

      if(button.classList.contains('selected-btn')&&button.dataset.correct){
          button.classList.add('correctAnswer');
          correctUserAnswers++;

      } else if (button.classList.contains('selected-btn')&&!button.dataset.correct){
        button.classList.add('wrongAnswer');
      }

      setStatusClass(button, button.dataset.correct);
      button.disabled = true;

    });

    if (correctAnswers===correctUserAnswers){
      score +=SCORE_POINTS;
      scoreText.innerText = score;
  }

    
    nextButton.disabled=false;
  }

  function selectAnswer(e) {

      const selectedButton = e.target; 
      let isSelected = selectedButton.classList.contains('selected-btn');

      if(isSelected){
        removeSelectedStatus(selectedButton);
      }  else {
        setSelectedStatus(selectedButton);
      }
      
      
  }

  function setStatusClass(element, correct) {
      clearStatusClass(element);
      if (correct) {
        element.classList.add('correct');
      } else {
        element.classList.add('wrong');
      }
  };
    
  function clearStatusClass(element) {
      element.classList.remove('correct');
      element.classList.remove('wrong');
  };

  function setSelectedStatus(element) {
      element.classList.add('selected-btn');
  };

  function removeSelectedStatus(element) {
      element.classList.remove('selected-btn');
  };
    
  function showQuestion(question){
      questionElement.innerText = question.question;
      questionImage.innerHTML = `<img src="./assets/img/${question.image}" alt="">`;

      question.answers.forEach(answer => {
          const button = document.createElement('button');
          button.innerText = answer.text;
          button.classList.add('btn');
         
          if (answer.correct) {
            button.dataset.correct = answer.correct;
            correctAnswers++;
          }
          button.addEventListener('click', selectAnswer);
          
          answerButtonsElement.appendChild(button);
        });
       
  };

  function resetState(){
      correctAnswers = 0;
      correctUserAnswers = 0;
      while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
      };
    };

    
 

