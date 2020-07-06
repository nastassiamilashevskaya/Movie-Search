import './style.scss';
import './keyboardStyle.css';
import '../node_modules/swiper/swiper.scss';
import '../node_modules/swiper/css/swiper.min.css';
import Swiper from 'swiper';
import MovieCard from './MovieCard';
import Keyboard from './Keyboard';

const wrapper = document.getElementById('swiper-wrapper');
const searchField = document.getElementById('search-field');
const resetButton = document.getElementById('reset-button');
const searchButton = document.getElementById('magnifer');
const preloader = document.getElementById('preloader');
const errorsContainer = document.getElementById('errors-container');
const keyboardImage = document.getElementById('keyboard-img');
const speechButton = document.getElementById('speaker');

let currentTitle;
let pageNumber = 1;

const swiper = new Swiper('.swiper-container', {
  slidesPerView: 1,
  scrollbar: {
    el: '.swiper-scrollbar',
    hide: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  breakpoints: {
    640: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 40,
    },
    1024: {
      slidesPerView: 4,
      spaceBetween: 50,
    },
  },
  centerInsufficientSlides: true,
});

const isCyrillic = (text) => (/[а-я]/i.test(text));
const searchingValue = () => (document.getElementById('search-field').value).trim().replace(' ', '+');

const createCards = (cards) => {
  cards.forEach((el) => {
    const card = new MovieCard(el.Title, el.Year, el.imdbID, el.Poster);
    wrapper.append(card.init());
    swiper.update();
  });
};

async function getData(title, page, removeSlides = false) {
  try {
    const currentPage = String(page);
    let curTitle = title;

    if (isCyrillic(title)) {
      const translateResponse = await fetch(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20200506T195217Z.e4f4e8eefb816ded.e4bef0a6426c3e22e73b3cd59b6b558bbea55909&text=${title}&lang=ru-en`);
      if (!translateResponse.ok) {
        preloader.classList.add('loaded');
        preloader.classList.remove('loaded_hiding');
        errorsContainer.innerText = 'Sorry, some problems on the server.';
        throw new Error('Ответ сети был не ok.');
      }
      const translateData = await translateResponse.json();
      if (translateData.Response === 'False') {
        errorsContainer.innerText = 'Sorry, some problems on the server.';
        throw new Error(translateData.Error);
      }
      curTitle = (String(translateData.text));
      errorsContainer.innerText = `Showing results for "${curTitle}".`;
    }

    const response = await fetch(`https://www.omdbapi.com/?s=${curTitle}&page=${currentPage}&apikey=bf3f41fe`);
    if (!response.ok) {
      preloader.classList.add('loaded');
      preloader.classList.remove('loaded_hiding');
      errorsContainer.innerText = 'Sorry, some problems on the server.';
      throw new Error('Ответ сети был не ok.');
    }
    const data = await response.json();
    if (data.Response === 'False') {
      throw new Error(data.Error);
    }
    if (removeSlides) {
      swiper.removeAllSlides();
    }
    createCards(data.Search);
  } catch (error) {
    preloader.classList.add('loaded');
    preloader.classList.remove('loaded_hiding');
    if (String(error) === 'Error: Movie not found!') {
      errorsContainer.innerText = `No results for "${title}". Please, try again :)`;
    } else if (String(error) === 'Error: Too many results.') {
      errorsContainer.innerText = `Too many results for "${title}". Please, add some letters :)`;
    } else {
      errorsContainer.innerText = error;
    }
  }
}

const searchListener = (removeSlides) => {
  errorsContainer.innerText = '';
  preloader.classList.add('loaded_hiding');
  preloader.classList.remove('loaded');
  // swiper.removeAllSlides();
  pageNumber = 1;
  currentTitle = searchingValue();
  getData(currentTitle, pageNumber, removeSlides);
};

searchField.addEventListener('keydown', (event) => {
  if (event.code === 'Enter' && searchingValue() !== '') {
    searchListener(true);
  }
});

searchButton.addEventListener('click', () => {
  if (searchingValue() !== '') {
    searchListener(true);
  }
});

searchField.addEventListener('input', () => {
  resetButton.style.opacity = 1;
});

swiper.on('slideChange', () => {
  if (swiper.realIndex % 4 === 0 && swiper.realIndex !== 0) {
    pageNumber += 1;
    getData(currentTitle, pageNumber, false);
  }
});

window.onload = () => {
  getData('dream', pageNumber, true);
  currentTitle = 'dream';
  const newKeyboard = new Keyboard();
  newKeyboard.init();
  document.getElementById('search-field').focus();
  preloader.classList.add('loaded_hiding');
  window.setTimeout(() => {
    preloader.classList.add('loaded');
    preloader.classList.remove('loaded_hiding');
  }, 500);

  keyboardImage.addEventListener('click', () => {
    searchField.focus();
    document.querySelectorAll('.keyboard')[0].classList.toggle('keyboard--hidden');
    newKeyboard.updateKeyboard();
  });

  resetButton.addEventListener('click', () => {
    document.getElementById('search-field').value = '';
    errorsContainer.innerText = '';
    newKeyboard.updateKeyboard();
    resetButton.style.opacity = 0;
  });

  document.querySelector('body > div.keyboard > div > div:nth-child(3) > button:nth-child(13)').addEventListener('click', () => {
    if (searchingValue() !== '') {
      searchListener(true);
    }
  });
};

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new window.SpeechRecognition();
recognition.interimResults = true;

speechButton.addEventListener('click', () => {
  recognition.start();
});

recognition.addEventListener('end', () => {
  if (searchingValue() !== '') {
    searchListener(true);
    resetButton.style.opacity = 1;
  }
  speechButton.checked = false;
});

recognition.addEventListener('result', (e) => {
  const transcript = Array.from(e.results).map((result) => result[0]).map((result) => result.transcript).join('');
  searchField.value = transcript;
});
