"use strict";

// DOM elements
const input = document.querySelector("#date");
const searchButton = document.querySelector("#search-button");
const results = document.querySelector("#result-list");

// helper functions for generating results
const reset = function () {
  while (results.firstChild) {
    results.removeChild(results.firstChild);
  }
};

const getResults = function (year, month, day) {
  // clearing previous
  reset();
  // choosing which option
  if (year) {
    // wikipedia API for that year
    (async function () {
      let response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&prop=info&list=search&srsearch=${year} events&srprop=snippet&format=json&origin=*`
      ).then((response) => response.json());
      response = response.query.search;
      console.log(response);
      response.shift();
      response.forEach(function (element) {
        const title = element.title;
        const event = element.snippet;
        console.log(event);
        const pageid = element.pageid;
        const newResult = document.createElement("div");
        newResult.innerHTML = `${title} : ${event} [...] <a href = "http://en.wikipedia.org/?curid=${pageid}">Click here to view more</a>`;
        newResult.classList.add("result");
        results.append(newResult);
      });
    })();
  } else {
    (async function () {
      // swagger API for the day
      let response = await fetch(
        `https://byabbe.se/on-this-day/${month}/${day}/events.json`
      ).then((response) => response.json());
      console.log(response);
      response.events.forEach(function (event) {
        const year = event.year;
        const description = event.description;
        const pageLink = event.wikipedia[0].wikipedia;
        const newResult = document.createElement("div");
        newResult.innerHTML = `${year} : ${description} [...] <a href = "${pageLink}">Click here to view more</a>`;
        newResult.classList.add("result");
        results.append(newResult);
      });
    })();
  }
};

const invalidInput = function () {
  reset();
  results.insertAdjacentHTML(
    "afterbegin",
    `<div class="result red">Invalid input! Please perform a valid search to display results!</div>`
  );
};

// function for generating results
const generateResults = function () {
  const inputString = input.value;
  let year = false;
  let month = false;
  let day = false;
  // parsing inputString into year, month, day
  if (inputString.includes("/")) {
    const indexFirstSlash = inputString.indexOf("/");
    month = Number(inputString.slice(0, indexFirstSlash));
    day = Number(inputString.slice(indexFirstSlash + 1, indexFirstSlash + 3));
    // checking for invalid input
    if (Number.isNaN(month) || Number.isNaN(day)) {
      invalidInput();
      return;
    }
    if (month < 1 || day < 1 || month > 12 || day > 31) {
      invalidInput();
      return;
    }
  } else {
    year = Number(inputString);
    if (Number.isNaN(year)) {
      invalidInput();
      return;
    }
    const currentYear = new Date().getFullYear();
    if (year > currentYear) {
      invalidInput();
      return;
    }
  }
  // requesting results from wikipedia
  getResults(year, month, day);
  reset();
};

// adding event listeners for Enter and Button

// Enter
window.addEventListener("keydown", function (event) {
  if (event.key == "Enter") {
    event.preventDefault();
    generateResults();
  }
});

//Button
searchButton.addEventListener("click", function (event) {
  event.preventDefault();
  generateResults();
});
