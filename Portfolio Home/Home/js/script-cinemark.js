'use strict';

//  NAV Bar and Accordion
$(function () {
  $("#accordion").accordion({
    heightStyle: "content",
    collapsible: true
  });
});

$(function () {
  $("#datepicker").datepicker();
});

function toggleDarkMode() {
  let body = document.querySelector("body");

  if (body.classList.contains("dark-mode-theme")) {
    body.classList.remove("dark-mode-theme");
  } else {
    body.classList.add("dark-mode-theme");
  }
  document.querySelector("#dark-mode-button").addEventListener("click", toggleDarkMode);
}

// LOCAL STORAGE
const usernameInput = document.getElementById('username');
let passwordInput = document.getElementById('password');
const loginButton = document.getElementById('loginSubmit');
const outputDiv = document.getElementById('welcome');

loginButton.addEventListener('click', () => {
  let username = usernameInput.value;
  let password = passwordInput.value;

  if (username) {
    localStorage.setItem('username', username);

    if (password) {
      localStorage.setItem('password', password);
      document.getElementById('login').style.display = 'none';
      document.getElementById('welcome').hidden = false;
      outputDiv.textContent = `Welcome back, ${username}`;
    } else {
      alert('Please enter your password');
    }

  } else {
    alert('Please enter a username.');
  }
});
// LOCAL STORAGE



//SLIDES
$(document).ready(function () {
  var slideIndex = 0;
  showSlides();

  function showSlides() {
    var slides = $(".slide");
    slides.eq(slideIndex).fadeIn(1000, function () {
      // Fading in
      setTimeout(function () {
        slides.eq(slideIndex).fadeOut(1000, function () {
          // Fading out
          slideIndex++;
          if (slideIndex >= slides.length) {
            slideIndex = 0;
          }
          showSlides();
        });
      }, 4000);
    });
  }
});
//SLIDES






$("#pickYear").spinner({
  classes: {
    "ui-spinner": "numSpinner",
    "ui-spinner-down": "spinnerDown",
    "ui-spinner-up": "spinnerUp"
  }
});

$(document).ready(function() {
  $("#pickYear").spinner({
    classes: {
      "ui-spinner": "numSpinner",
      "ui-spinner-down": "spinnerDown",
      "ui-spinner-up": "spinnerUp"
    }
  });

  const imgUrl = "https://image.tmdb.org/t/p/w400/";
  const apiKey = "6c5499f35b26219acd0fa5786a23875f";

  function displayMovies(selector, data) {
    const moviesContainer = $(selector);
    let html = "";

    for (let i = 0; i < 6; i++) {
      html += `
        <section class="movie subsec">
          <img src="${imgUrl}${data.results[i].poster_path}" alt="${data.results[i].title}">
          <button class="details"><span class="arrow"></span></button>
          <div>
            <h5>${data.results[i].title}</h5>
            <p>${data.results[i].overview}<span class="vote">Critic Score: ${data.results[i].vote_average}</span></p>
          </div>
        </section>`;
    }

    moviesContainer.html(html);

    $(".details").on("click", function(e) {
      $(e.target).next("div").slideToggle();
      $(e.target).children(".arrow").toggleClass("opened");
    });

    $(".movie div").hide();
  }

  function fetchMovies(url, successCallback, errorCallback) {
    $.ajax({
      url: url,
      dataType: "json"
    })

    .done(successCallback)
    .fail(function(jqXHR) {
      errorCallback();
      console.error(jqXHR.responseJSON.status_message);
    });
  }

  fetchMovies(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`,
    function(data) {
      displayMovies("#popular", data);
    },
    function() {
      $("#popular").html("There was a problem accessing the movie database");
    }
  );

  $("#yearSubmit").click(function(e) {
    e.preventDefault();

    let year = encodeURIComponent($("#pickYear").val());
    const chosenYearMovies = $("#chosenYear");

    $("#pickYear").removeClass("errorInput");
    $(".message").removeClass("error");

    if (year < 1940 || year > 2022) {
      $("#pickYear").addClass("errorInput");
      $(".message").addClass("error");
    } else {
      const yearUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&primary_release_year=${year}&sort_by=revenue.desc&language=en-US&page=1&include_adult=false`;

      fetchMovies(yearUrl,
        function(data) {
          displayMovies("#chosenYear", data);
        },
        function() {
          chosenYearMovies.html("There was a problem with the movie database");
        }
      );
    }
  });

  $("#basicSubmit").click(storeUserName);
  $("#itemSubmit").click(addToList);
});
