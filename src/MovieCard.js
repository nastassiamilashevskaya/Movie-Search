class MovieCard {
  constructor(title, year, rating, posterSrc) {
    this.title = title;
    this.posterSrc = posterSrc;
    this.year = year;
    this.rating = rating;
  }

  init() {
    const preloader = document.getElementById('preloader');
    const fragment = document.createDocumentFragment();
    const slide = document.createElement('div');
    slide.classList.add('swiper-slide');

    const mainCard = document.createElement('div');
    mainCard.classList.add('card', 'movie-card');

    const poster = document.createElement('img');
    poster.classList.add('poster');
    const posterLink = document.createElement('a');

    if (this.posterSrc === 'N/A') {
      poster.src = './assets/error.jpg';
    } else {
      poster.src = this.posterSrc;
    }

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    const titleInner = document.createElement('a');
    titleInner.classList.add('card-title__inner');
    titleInner.innerText = this.title;

    const cardYear = document.createElement('p');
    cardYear.classList.add('card-text');
    cardYear.innerText = this.year;

    const cardRating = document.createElement('div');
    cardRating.classList.add('card-text', 'card-text-container');
    const cardRatingInner = document.createElement('p');

    const starRating = document.createElement('img');
    starRating.src = 'assets/star-rating.png';
    starRating.classList.add('star-rating');
    const curRating = this.rating;

    titleInner.href = `https://www.imdb.com/title/${curRating}/`;
    posterLink.classList.add('card-title__inner');
    posterLink.href = `https://www.imdb.com/title/${curRating}/`;
    posterLink.append(poster);

    cardTitle.append(titleInner);


    (async function getRating() {
      const response = await fetch(`https://www.omdbapi.com/?i=${curRating}&apikey=bf3f41fe`);
      if (!response.ok) {
        preloader.classList.add('loaded');
        preloader.classList.remove('loaded_hiding');
        throw new Error('Ответ сети был не ok.');
      }
      const data = await response.json();
      cardRatingInner.innerText = `IMDb: ${data.imdbRating}`;
    }());
    cardRating.append(cardRatingInner, starRating);
    cardBody.append(cardTitle, cardYear, cardRating);
    mainCard.append(posterLink, cardBody);
    slide.append(mainCard);
    fragment.append(slide);
    preloader.classList.add('loaded');
    preloader.classList.remove('loaded_hiding');
    return fragment;
  }
}

export const testCard = new MovieCard('Requiem for a Dream', '2000', 'tt0180093', 'https://m.media-amazon.com/images/M/MV5BOTdiNzJlOWUtNWMwNS00NmFlLWI0YTEtZmI3YjIzZWUyY2Y3XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg');
export default MovieCard;
