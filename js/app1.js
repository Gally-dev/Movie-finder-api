const lightBulb = document.querySelector(".bulb");
const backToTopBtn = document.querySelector(".back-to-top");
const searchText = document.querySelector(".text-center");
const inputText = document.querySelector("#searchText");
const searchForm = document.querySelector("#searchForm");
const movieCard = document.querySelector("#movies");
const container = document.querySelector(".container");
const searchBtn = document.querySelector("form img");
const favoriteBtn = document.querySelector(".favorite");
const sidebar = document.querySelector(".sidebar"); //sidebar
const heartIcon = document.querySelector(".toggle-btn .fas");
const asidePreview = document.querySelector(".aside-preview"); //sidebar

// day-night mode
lightBulb.addEventListener("click", () => {
  document.body.classList.toggle("light-body");
  searchText.classList.toggle("light-text");
});
//toggle aside with favorites movie
heartIcon.onclick = showAsidePanel;
function showAsidePanel() {
  sidebar.classList.toggle("active");
}
//if not click on sidebar, sidebar close
document.onclick = (e) => {
   isClickInsideElement = sidebar.contains(e.target);
  if (!isClickInsideElement) {
      sidebar.classList.remove("active");
  }
};

//show the button 'back to top' if scroll
window.onscroll = scrollFunction;

function scrollFunction() {
  if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
    backToTopBtn.style.display = "block";
  } else {
    backToTopBtn.style.display = "none";
  }
}
//searching buttons and load movies
window.addEventListener("load", renderFavorites);
searchBtn.addEventListener("click", loadMovies);
searchForm.addEventListener("submit", loadMovies);

function loadMovies(e) {
  e.preventDefault();
  let searchText = inputText.value;
  inputText.value = "";
  inputText.focus();
  getMovies(searchText);
}
//api fetch
const getMovies = async (searchText) => {
  try {
    const base_url = "https://www.omdbapi.com/";
    const api_key = "2a8d4e1";
    const api_url = `${base_url}?s=${searchText}&apikey=${api_key}`;
    const response = await fetch(api_url);
    const data = await response.json();
    let movies = data.Search;
   
    showMovies(movies);
    loadMoreBtn(data, movies);

    //pagination
    loadMore.addEventListener("click", (e) => {
      getMore(searchText);
    });
  } catch (err) {
    console.log(err, "The little dwarf struck with a hammer and destroyed it, his hammer will be taken away...asap");
  }
};
//created 'load more' button for pagination
const loadMore = document.createElement("button");
function loadMoreBtn(data, movies) {
  //only one button (load more) render on web
  if (document.getElementsByClassName("read-more").length > 1) {
    container.removeChild(container.childNodes[3]);
  }
  //no results
  
  if (data.Response == "False") {
    movieCard.innerHTML = `<h1 class="no-result">Sorry, no result</h1>`;
    loadMore.remove();
  }
  loadMore.textContent = "load more ...";
  loadMore.classList.add("load-more");
  container.append(loadMore);

  if (data.Response == "False" || movies.length < 10) {
    loadMore.remove();
  }
}
//api pagination
let counter = 1;
async function getMore(searchText) {
  counter++;
  const base_url = "https://www.omdbapi.com/";
  const api_key = "2a8d4e1";
  const search_url = `${base_url}?s=${searchText}&page=${counter}&apikey=${api_key}`;
  const response = await fetch(search_url);
  const data = await response.json();
  let movies = data.Search;

  let outputMore = "";

  for (let movie in movies) {
    const { Title, Year, imdbID, Poster } = movies[movie];
    outputMore += `
        <div class="card">
            <img onclick="getMovie('${imdbID}')" src="${Poster}"  onerror="this.src='img/no-available1.png'" alt="${movie.Title}">
            <div class="content">
                <h3>${Title}</h3>
                <h4>${Year}</h4>
                <a onclick="getMovie('${imdbID}')" "type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter")">Movie details</a>
                <i onclick="addToFavorites('${imdbID}')" class=" favorite fas fa-heart fa-2x"></i>
            </div>
        </div>
        `;
  }
  movieCard.innerHTML += outputMore;
}
function showMovies(movies) {
  let output = "";
  for (let movie in movies) {
    const { Title, Year, imdbID, Poster } = movies[movie];
    
    output += `
        <div class="card">
            <img onclick="getMovie('${imdbID}')" src="${Poster}"  onerror="this.src='img/no-available1.png'" alt="${movie.Title}">
            <div class="content">
                <h3>${Title}</h3>
                <h4>${Year}</h4>
                <a onclick="getMovie('${imdbID}')" type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">Movie details</a>
                <i onclick="addToFavorites('${imdbID}')" class=" favorite fas fa-heart fa-2x"></i>
            </div>
        </div>
        `;
  }
  movieCard.innerHTML = output;
}

async function getMovie(movieId) {

  try {
    const detailUrl = `https://www.omdbapi.com/?i=${movieId}&apikey=2a8d4e1`;
    const response = await fetch(detailUrl);
    const data = await response.json();

    const {Poster, Title, Runtime, Genre, Year, Rated, imdbRating, Director, Writer,Actors, Plot, imdbID,} = data;

  //filled MODAL
    document.querySelector('#exampleModalLongTitle').innerHTML =`${Title}`;
    document.querySelector('.poster').setAttribute('src',`${Poster}`);
    document.querySelector('.poster').setAttribute('alt',`${Title}`);
    document.querySelector('.imdb').setAttribute('href',`https://imdb.com/title/${imdbID}`);
    
    document.querySelector('.title').innerHTML =`${Title}`;
    document.querySelector('.length').innerHTML =`${Runtime}`;
    document.querySelector('.genre').innerHTML =`${Genre}`;
    document.querySelector('.released').innerHTML =`${Year}`;
    document.querySelector('.rated').innerHTML =`${Rated}`;
    document.querySelector('.rating').innerHTML =`${imdbRating}`;
    document.querySelector('.director').innerHTML =`${Director}`;
    document.querySelector('.writer').innerHTML =`${Writer}`;
    document.querySelector('.actors').innerHTML =`${Actors}`;

    document.querySelector('.plot').innerHTML =`${Plot}`;
    
  } catch (err) {
    console.log(err, "The little dwarf struck with a hammer and destroyed it, his hammer will be taken away...asap");
  }
}

//add to favorites to local storage
let movieIdAside = [];

const addToFavorites = (id) => {
  heartIcon.style.animation = "shake .8s ease infinite";
  let parseId = JSON.parse(localStorage.getItem("movieIdAside")) || [];
  movieIdAside = [...new Set(parseId)];
  movieIdAside.unshift(id);

  //remove the duplicates from local storage
  let uniqueId = movieIdAside.filter((c, index) => {
    return movieIdAside.indexOf(c) === index;
  });

  localStorage.setItem("movieIdAside", JSON.stringify(uniqueId));
  renderFavorites();
};
//get from local storage and render to favorites aside
async function renderFavorites() {
  let movieIdAsideParsed = JSON.parse(localStorage.getItem("movieIdAside"));

  let outputAside = "";
  for (asideId in movieIdAsideParsed) {
    let asideIds = movieIdAsideParsed[asideId];
    const detailUrl = `https://www.omdbapi.com/?i=${asideIds}&apikey=2a8d4e1`;
    const response = await fetch(detailUrl);
    const data = await response.json();
    const { Poster, Title, Year, imdbID } = data;
   
    outputAside += `
            <article class="preview" >
                <a href="https://imdb.com/title/${imdbID}" target="_blank" rel="noreferrer"><img src="${Poster}" onerror="this.src='img/no-available1.png'" alt="${Title}"></a>
                <h7>${Title}</h7>
                <p>${Year}</p>
                <div class="close-btn">
                    <i class="far fa-times-circle" onclick="deleteFavorite('${imdbID}')"></i>
                </div>    
            </article>
            `;
  }

  asidePreview.innerHTML = "";
  asidePreview.innerHTML += outputAside;
}
//delete movie from favorites
const deleteFavorite = (movieId) => {
  let movieIdAsideParsed = JSON.parse(localStorage.getItem("movieIdAside"));
  const index = movieIdAsideParsed.findIndex((name) => {
    return name === movieId;
  });

  if (index > -1) {
    movieIdAsideParsed.splice(index, 1);
    localStorage.setItem("movieIdAside", JSON.stringify(movieIdAsideParsed));
  }
  renderFavorites();
};