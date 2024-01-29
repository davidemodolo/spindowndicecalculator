import items from "./items.js";

const DADSNOTE_ITEM = {
  id: 656,
  name: "Dad_s_Note",
  suggestion: "Dad's Note",
};

const LAST_ID = 717;

/**
 * Filter the items to show based on the user input.suggestion
 *
 * @param {{id, name, suggestion}} input
 * @returns {void}
 */
function filterItems(input) {
  return items.filter((item) =>
    item.suggestion.toLowerCase().includes(input.toLowerCase())
  );
}

/**
 * Display the filtered suggestions on the passed div based on the user input.suggestion
 *
 * @param {{id, name, suggestion}} input
 * @param {string} suggestionsDivId
 * @param {int} inputId
 */
function displaySuggestions(input, suggestionsDivId, inputId) {
  // initialize the suggestions div
  const suggestionsDiv = document.getElementById(suggestionsDivId);
  suggestionsDiv.innerHTML = "";

  // set the selected index to -1 for later use in the arrow events
  var selectedIndex = -1;

  // get the filtered list
  const filteredItems = filterItems(input);
  // prepare the suggestions element
  filteredItems.forEach((item) => {
    const suggestion = document.createElement("div");
    suggestion.textContent = item.suggestion;

    // TODO: fix image visualization, right now is too high
    loadImage(item, suggestion);

    suggestion.classList.add("suggestion");
    suggestion.addEventListener("click", () => {
      document.getElementById(inputId).value = item.suggestion;
      // this is the case of the item in the second section
      if (inputId == "itemInput") {
        calculateItem();
      }
      // this is the case of the search field in the second section
      if (inputId == "searchInput") {
        calculateItem(item.suggestion);
      }
      suggestionsDiv.innerHTML = "";
    });
    // append the suggestion to the suggestions div
    suggestionsDiv.appendChild(suggestion);
  });

  //TODO: I don't like that these listeners are inside a function

  // check if the mouse is hovering over a suggestion
  const isHover = (e) => e.parentElement.querySelector(":hover") === e;
  document.addEventListener("mousemove", function checkHover() {
    // filter the DOM elements to get only the suggestions
    const suggestionItems = suggestionsDiv.querySelectorAll(".suggestion");
    if (suggestionItems.length === 0) return; // if there are no suggestions, return
    for (let i = 0; i < suggestionItems.length; i++) {
      if (isHover(suggestionItems[i])) {
        // if the mouse is hovering over a suggestion, update the selected index
        selectedIndex = i;
        updateSelection();
        break;
      }
    }
  });

  // check if the user is using the arrow keys to move up and down the suggestions
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowUp" && selectedIndex > 0) {
      selectedIndex--;
      updateSelection(); // update the selected suggestion to visually show it
    } else if (
      e.key === "ArrowDown" &&
      selectedIndex < filteredItems.length - 1
    ) {
      selectedIndex++;
      updateSelection(); // update the selected suggestion to visually show it
    } else if (e.key === "Enter" && selectedIndex !== -1) {
      // if the user presses enter, select the suggestion
      document.getElementById(inputId).value =
        filteredItems[selectedIndex].suggestion;
      suggestionsDiv.innerHTML = "";
      selectedIndex = -1; // reset the selected index
    } else if (e.key === "Escape") {
      // if the user presses escape, clear the suggestions
      suggestionsDiv.innerHTML = "";
      selectedIndex = -1; // reset the selected index
    }
  });

  /**
   * Update the selected suggestion to visually highlight the selected index
   */
  function updateSelection() {
    const suggestionItems = suggestionsDiv.querySelectorAll(".suggestion");
    suggestionItems.forEach((item, index) => {
      item.classList.toggle("selected", index === selectedIndex);
    });
  }
}

/**
 * Create an item element to be appended to the results div inside the second panel
 * The boolean parameter "up" is used to show the arrow up (true) or down (false)
 * The parameter "number" is used to show the number of spins
 *
 * @param {{id, name, suggestion}} item
 * @param {int} number
 * @param {bool} up
 * @returns
 */
function createItem(item, number, up = true) {
  const arrow = up ? "↑" : "↓";
  const result = document.createElement("div");
  result.classList.add("clickableItem");
  // load image from cache with this function
  loadImage(item, result);

  const text = document.createElement("p");
  text.textContent = `${item.suggestion} (Spins: ${number}) ${arrow}`;
  result.appendChild(text);

  // when the item is clicked, it will become the new input
  result.addEventListener("click", () => {
    document.getElementById("itemInput").value = item.suggestion;
    calculateItem();
  });

  return result;
}

/**
 * Function to load the image from the cache if it exists, or to download it otherwise
 * Usage: loadImage(item, div to append the image to);
 *
 * @param {{id, name, result}} item
 * @param {string} result
 */
function loadImage(item, result) {
  const imgSrc = `imgs/${item.id}_${item.name}.png`;
  // Check if the image URL is in localStorage
  const cachedImage = localStorage.getItem(imgSrc);
  const img = document.createElement("img");
  if (cachedImage) {
    // If the image URL is in localStorage, create an image element with the cached URL
    img.src = cachedImage;
  } else {
    // If the image URL is not in localStorage, create a new image element
    img.src = imgSrc;
    // Store the image URL in localStorage for future use
    localStorage.setItem(imgSrc, img.src);
  }
  result.appendChild(img);
}

// ***************************************
// ***** FROM ITEM / TO ITEM SECTION *****
// ***************************************

const buttonClearFromTo = document.getElementById("clearFromTo");
buttonClearFromTo.addEventListener("click", () => clearPageFromTo());

/**
 * Clear the fields in the "First Item to Second Item" container
 * @returns {void}
 */
function clearPageFromTo() {
  document.getElementById("fromInput").value = "";
  document.getElementById("toInput").value = "";
  document.getElementById("resultFromTo").innerHTML = "";
  document.getElementById("suggestionsFrom").innerHTML = "";
  document.getElementById("suggestionsTo").innerHTML = "";
  return;
}

const buttonCalculateFromTo = document.getElementById("calculateFromTo");
buttonCalculateFromTo.addEventListener("click", () => calculateItemFromTo());

/**
 * Compute the number of steps to go from the first item to the second item
 * taking into account Car Battery and Dad's Note complications
 * @returns {void}
 */
function calculateItemFromTo() {
  const from = document.getElementById("fromInput").value;
  const to = document.getElementById("toInput").value;

  if (!from || !to) {
    return;
  }

  // get the items based on the user inputs
  const fromID = items.find(
    (item) => item.suggestion.toLowerCase() === from.toLowerCase()
  );
  // we need "toID" to be "var" and not "const" in order to change it to Dad's Note if needed
  var toID = items.find(
    (item) => item.suggestion.toLowerCase() === to.toLowerCase()
  );
  // change "toID" to be a copy and not a reference so that we can change it to Dad's Note if needed
  toID = JSON.parse(JSON.stringify(toID));

  const resultDiv = document.getElementById("resultFromTo");
  resultDiv.innerHTML = "";

  // check if the items exist in the items list
  if (!(fromID && toID)) {
    resultDiv.innerHTML = '<p class="error">Item not found!</p>';
    return;
  }

  // compute the distance between the starting item to Dad's Note
  var dn = fromID.id - DADSNOTE_ITEM.id;
  if (
    fromID.id >= DADSNOTE_ITEM.id &&
    toID.id <= DADSNOTE_ITEM.id &&
    // this checks if the Dad's Note is reachable/unreachable due to Car Battery
    // the idea is that we now have Dad's Note on the way,
    // but we can ignore the problem if we have Car Battery and Dad's Note is skipped with it
    (!carBattery || dn % 2 == 0)
  ) {
    // if we have Car Battery, we need to divide the number of steps by 2
    if (carBattery && dn % 2 == 0) {
      dn = dn / 2;
    }
    resultDiv.innerHTML = `<p class="error">Dad\'s Note is on the way after ${dn} spins </p>`;
    // update the "toID" to be Dad's Note
    toID.name = DADSNOTE_ITEM.name;
    toID.id = DADSNOTE_ITEM.id;
    toID.suggestion = DADSNOTE_ITEM.suggestion;
  }
  // check if the "from" item ID is lower than the "to" item ID
  if (fromID.id <= toID.id) {
    resultDiv.innerHTML =
      '<p class="error"><b>From</b> item must be lower than <b>To</b> item</p>';
    return;
  }

  // compute the number of steps between the two items
  var steps = fromID.id - toID.id;
  // if we have Car Battery, we need to divide the number of steps by 2,
  // but if the number of steps is odd, the second item is not reachable
  if (carBattery && steps % 2 == 1) {
    const cardBatteryNewDiv = document.createElement("div");
    cardBatteryNewDiv.classList.add("item");
    const cardBatteryNewText = document.createElement("p");
    cardBatteryNewText.classList.add("error");
    cardBatteryNewText.textContent = `Due to Car Battery, the item is not achievable`;
    cardBatteryNewDiv.appendChild(cardBatteryNewText);
    const cardBatteryNewImage = document.createElement("img");
    cardBatteryNewImage.src = `imgs/352_Car_Battery.png`;
    cardBatteryNewDiv.appendChild(cardBatteryNewImage);
    resultDiv.appendChild(cardBatteryNewDiv);
    return;
  } else if (carBattery && steps % 2 == 0) {
    steps = steps / 2;
  }

  // show the result
  const result = document.createElement("div");
  result.classList.add("item");
  // load the first item image
  const imgFrom = document.createElement("img");
  imgFrom.src = `imgs/${fromID.id}_${fromID.name}.png`;
  result.appendChild(imgFrom);
  // load the first item text
  const text = document.createElement("p");
  text.textContent = `${fromID.suggestion}`;
  result.appendChild(text);
  // show the number of steps
  const text2 = document.createElement("p");
  text2.textContent = ` → ${steps} spins → `;
  result.appendChild(text2);
  // load the second item image
  const imgTo = document.createElement("img");
  imgTo.src = `imgs/${toID.id}_${toID.name}.png`;
  result.appendChild(imgTo);
  // load the second item text
  const text3 = document.createElement("p");
  text3.textContent = `${toID.suggestion}`;
  result.appendChild(text3);

  // append the result to the result div
  resultDiv.appendChild(result);
}

const buttonSwitch = document.getElementById("switchLabels");
buttonSwitch.addEventListener("click", () => switchLabels());

function switchLabels() {
  const from = document.getElementById("fromInput").value;
  const to = document.getElementById("toInput").value;
  document.getElementById("fromInput").value = to;
  document.getElementById("toInput").value = from;
  calculateItemFromTo();
}

// ***************************************
// ********* SINGLE ITEM SECTION *********
// ***************************************

const buttonClear = document.getElementById("clear");
buttonClear.addEventListener("click", () => clearPage());

/**
 * Clear the fields in the "Single Item" container
 *
 * @returns {void}
 */
function clearPage() {
  document.getElementById("itemInput").value = "";
  document.getElementById("result").innerHTML = "";
  document.getElementById("selected").innerHTML = "";
  document.getElementById("searchResult").innerHTML = "";
  document.getElementById("suggestions").innerHTML = "";
  document.getElementById("searchSuggestions").innerHTML = "";
  return;
}

const buttonCalculate = document.getElementById("calculateItemButton");
buttonCalculate.addEventListener("click", () => calculateItem());

/**
 * Compute the X previous and X following items of the selected item,
 * taking into account Car Battery and Dad's Note complications
 *
 * There is an optional parameter "suggestion" that is used to scroll to an item if it is passed
 *
 * @param {string} suggestionParameter
 */
function calculateItem(suggestionParameter = undefined) {
  // load all the DOM elements
  const input = document.getElementById("itemInput").value;
  const resultDiv = document.getElementById("result");
  const selectedDiv = document.getElementById("selected");
  const searchDiv = document.getElementById("searchResult");
  // reset the results div
  searchDiv.innerHTML = "";
  const sliderValue = document.getElementById("myRange").value;
  // find the selected item in the items list
  const selectedItem = items.find(
    (item) => item.suggestion.toLowerCase() === input.toLowerCase()
  );
  // if the item is not found, show an error and return
  if (!selectedItem) {
    resultDiv.innerHTML = '<p class="error">Item not found!</p>';
    document.getElementById("suggestions").innerHTML = "";
    selectedDiv.innerHTML = "";
    return;
  }

  selectedDiv.innerHTML = `<p><strong>Selected Item:</strong> ${selectedItem.suggestion}</p>`;
  // load the image of the selected item from the cache
  loadImage(selectedItem, selectedDiv);

  // show the second search field, that will work as every other search field
  const searchText = document.createElement("p");
  searchText.textContent = "Search for an item in the results:";
  searchDiv.appendChild(searchText);
  const inputSearch = document.createElement("input");
  inputSearch.type = "text";
  inputSearch.id = "searchInput";
  inputSearch.placeholder = "Search";
  inputSearch.addEventListener("input", (event) => {
    const inputValue = event.target.value;
    displaySuggestions(inputValue, "searchSuggestions", "searchInput");
  });
  searchDiv.appendChild(inputSearch);

  // START SEARCH OF THE ITEMS

  const previousItemsDiv = document.createElement("div");
  previousItemsDiv.id = "leftDiv";
  previousItemsDiv.innerHTML = `<p><strong>(up to) ${sliderValue} Items generated from spinning down the selected one:</strong></p>`;
  // compute the ending index, if there are more than X items, show only X items, where X is the slider value
  var endI = selectedItem.id <= sliderValue ? selectedItem.id : sliderValue;
  // create the variable "found" to be used later to scroll to the searched item from the second search field
  var found;
  // if we have Car Battery, we need to double the ending index since half of the items will be skipped
  endI = carBattery ? endI * 2 : endI;
  // loop through the items
  for (let i = 1; i <= endI; i++) {
    // ignore the current index if we have Car Battery and the index is odd
    if (carBattery && i % 2 == 1) {
      continue;
    }
    // find the previous item
    const previousItem = items.find((item) => item.id === selectedItem.id - i);
    // if the previous item exists, create the item element and append it to the previous items div
    if (previousItem) {
      const iValue = carBattery ? i / 2 : i; // if we have Car Battery, we need to divide the index by 2 since the number of spins is halved
      const item = createItem(previousItem, iValue, false);
      if (
        suggestionParameter && // if we have a suggestion from the second search field
        previousItem.suggestion.toLowerCase() === suggestionParameter.toLowerCase() // and the suggestion is the current item
      ) {
        item.classList.add("found"); // add the "found" class to the item so that it will have the green border
        found = item;
      }
      // append the item to the div
      previousItemsDiv.appendChild(item);
    }
    // if the previous item is Dad's Note, show an error and stop the loop
    if (previousItem && previousItem.name == DADSNOTE_ITEM.name) {
      const error = document.createElement("p");
      error.classList.add("error");
      error.textContent = "Dad's Note is on the way!";
      previousItemsDiv.appendChild(error);
      break;
    }
  }

  // repeat for the following items (the ones that can generate the selected item by spinning down)
  // the logic is identical to the previous loop
  const nextItemsDiv = document.createElement("div");
  nextItemsDiv.id = "rightDiv";
  nextItemsDiv.innerHTML = `<p><strong>(up to) ${sliderValue} Items that would get you to the selected one:</strong></p>`;

  endI =
    LAST_ID - selectedItem.id > sliderValue
      ? sliderValue
      : LAST_ID - selectedItem.id;
  endI = carBattery ? endI * 2 : endI;
  for (let i = 1; i <= endI; i++) {
    if (carBattery && i % 2 == 1) {
      continue;
    }
    const nextItem = items.find((item) => item.id === selectedItem.id + i);
    if (nextItem) {
      const iValue = carBattery ? i / 2 : i;
      const item = createItem(nextItem, iValue);
      if (
        suggestionParameter &&
        nextItem.suggestion.toLowerCase() == suggestionParameter.toLowerCase()
      ) {
        item.classList.add("found");
        found = item;
      }
      nextItemsDiv.appendChild(item);
    }
    if (nextItem && nextItem.name == DADSNOTE_ITEM.name) {
      const error = document.createElement("p");
      error.classList.add("error");
      error.textContent = "Dad's Note is on the way!";
      nextItemsDiv.appendChild(error);
      break;
    }
  }

  // reset and append everything to the results div
  resultDiv.innerHTML = "";
  resultDiv.appendChild(previousItemsDiv);
  resultDiv.appendChild(nextItemsDiv);

  // if the user searched for an item, and the item was found, scroll to it
  if (suggestionParameter) {
    if (found) {
      found.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      searchText.innerHTML = `<p class="error">Not found in the results</p>`;
    }
  }
}


const slider = document.getElementById("myRange");
const output = document.getElementById("stringItems");

// update the text based on the slider value
slider.oninput = function () {
  output.innerHTML = `Previous and following ${this.value} items:`;
};

// ***** Event listener for input changes *****

document.getElementById("itemInput").addEventListener("input", (event) => {
  const inputValue = event.target.value;
  displaySuggestions(inputValue, "suggestions", "itemInput");
});

document.getElementById("fromInput").addEventListener("input", (event) => {
  const inputValue = event.target.value;
  displaySuggestions(inputValue, "suggestionsFrom", "fromInput");
});

document.getElementById("toInput").addEventListener("input", (event) => {
  const inputValue = event.target.value;
  displaySuggestions(inputValue, "suggestionsTo", "toInput");
});

// Car Battery panel click event listener
var carBattery = false;
const containerBattery = document.getElementById("containerBattery");
containerBattery.addEventListener("click", () => {
  carBattery = !carBattery;
  containerBattery.style.backgroundColor = carBattery ? "#1e3e1e" : "#3e1e1e";
  const label = document.getElementById("carbattery");
  label.textContent = carBattery
    ? "I have Car Battery"
    : "I don't have Car Battery";
});

// Scroll to top button logic
const buttonScrollUp = document.getElementById("up-button");
buttonScrollUp.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

