document.addEventListener("DOMContentLoaded", initializeApp);

function initializeApp() {
  const elements = getDOMElements();
  loadMovies(elements.movieListContainer);
  loadFirstMovie();
}

function getDOMElements() {
  return {
    poster: document.getElementById("poster"),
    titleElement: document.getElementById("title"),
    runtimeElement: document.getElementById("runtime"),
    descriptionElement: document.getElementById("film-info"),
    showtimeElement: document.getElementById("showtime"),
    ticketNumElement: document.getElementById("ticket-num"),
    buyTicketButton: document.getElementById("buy-ticket"),
    movieListContainer: document.getElementById("films")
  };
}

function loadMovies(container) {
  fetch("http://localhost:3000/films")
    .then((response) => response.json())
    .then((movies) => {
      container.innerHTML = ""; 
      movies.forEach((movie) => createMovieListItem(container, movie));
    });
}

function createMovieListItem(container, movie) {
  const li = document.createElement("li");
  li.classList.add("film", "item");
  li.textContent = movie.title;
  li.dataset.id = movie.id; 

  addDeleteButton(li, movie.id);

  li.addEventListener("click", () => fetchMovieDetails(movie.id));

  container.appendChild(li);
}

function addDeleteButton(li, movieId) {
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("delete-button", "ui", "red", "button");

  deleteButton.addEventListener("click", (event) => {
    event.stopPropagation(); 
    deleteMovie(movieId, li);
  });

  li.appendChild(deleteButton);
}

function deleteMovie(movieId, listItem) {
  fetch(http://localhost:3000/films/${movieId}, {
    method: "DELETE",
  }).then(() => {
    listItem.remove(); // Remove the list item from DOM
  });
}

function loadFirstMovie() {
  fetchMovieDetails(1); // Load the first movie by ID (1)
}

function fetchMovieDetails(movieId) {
  fetch(http://localhost:3000/films/${movieId})
    .then((response) => response.json())
    .then((movie) => displayMovieDetails(movie));
}

function displayMovieDetails(movie) {
  const availableTickets = movie.capacity - movie.tickets_sold;
  updateMovieUI(movie, availableTickets);
  updateBuyTicketButton(movie, availableTickets);
}

function updateMovieUI(movie, availableTickets) {
  const elements = getDOMElements();

  elements.poster.src = movie.poster;
  elements.titleElement.textContent = movie.title;
  elements.runtimeElement.textContent = ${movie.runtime} minutes;
  elements.descriptionElement.textContent = movie.description;
  elements.showtimeElement.textContent = movie.showtime;
  elements.ticketNumElement.textContent = ${availableTickets} remaining tickets;

  // Update movie list item class if sold out
  const movieListItem = document.querySelector(li[data-id="${movie.id}"]);
  if (availableTickets === 0) {
    movieListItem.classList.add("sold-out");
  } else {
    movieListItem.classList.remove("sold-out");
  }
}

function updateBuyTicketButton(movie, availableTickets) {
  const buyTicketButton = document.getElementById("buy-ticket");

  if (availableTickets === 0) {
    buyTicketButton.textContent = "Sold Out";
    buyTicketButton.disabled = true;
  } else {
    buyTicketButton.textContent = "Buy Ticket";
    buyTicketButton.disabled = false;
    buyTicketButton.onclick = () => buyTicket(movie);
  }
}

function buyTicket(movie) {
  const availableTickets = movie.capacity - movie.tickets_sold;

  if (availableTickets > 0) {
    const updatedTicketsSold = movie.tickets_sold + 1;

    fetch(http://localhost:3000/films/${movie.id}, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tickets_sold: updatedTicketsSold }),
    })
      .then((response) => response.json())
      .then((updatedMovie) => {
        displayMovieDetails(updatedMovie);
      });
  }
}