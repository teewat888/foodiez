"USE STRICT";

/* 
To do :

fixed error word clear up when move to other section
favourite button
comment
ingredient multiplier

*/

(() => {
  //config

  const config = {
    jokeEnable: false,
  };
  const searchFoodBtn = document.getElementById("searchFood");
  const searchText = document.getElementById("searchText");
  const resultList = document.getElementById("result-list");
  const recipeInfo = document.getElementById("recipe-info");
  //const spinner = document.getElementById("spinner");
  //const alert = document.getElementById("alert");
  const loadMoreBtn = document.createElement("button");
  const closeContent = document.getElementById("closeContent");
  const infoBox = document.getElementById("info-box");
  const topInfoBox = document.getElementById("top-info-box");
  //const spinnerTop = document.getElementById("spinner-top");
  //const alertTop = document.getElementById("alert-top");
  const home = document.getElementById("home");
  const advance = document.getElementById("advance");
  const tools = document.getElementById("tools");
  const notifiedText = document.getElementById("notified-text");
  const searchForm = document.getElementById("search-form");
  const toolBox = document.getElementById("tool-box");
  const advanceSearch = document.getElementById("advance-search");
  const loadingTop = document.getElementById("loading-top");
  const loadingBottom = document.getElementById("loading-bottom");

  let number = 18; //number of result per fetch
  let offset = 0; // offset for pagination
  let unit = "us"; // default unit of ingredients
  let ingredients = {}; // object to store ingredients
  let avdSearch = false;
  searchFoodBtn.style.marginTop = "24px";
  //events listener
  home.addEventListener("click", () => {
    avdSearch = false;
    navActive("home");
    // notifiedText.style.display = "none";
    searchForm.style.display = "block";
    searchFoodBtn.style.marginTop = "24px";
    recipeInfo.style.display = "block";
    toolBox.style.display = "none";
    advanceSearch.style.display = "none";
    resultList.style.display = "block";
  });

  advance.addEventListener("click", () => {
    avdSearch = true;
    // notifiedText.style.display = "none";
    navActive("advance");
    searchFoodBtn.style.marginTop = "0px";
    toolBox.style.display = "none";
    searchForm.style.display = "block";
    advanceSearch.style.display = "block";
    advanceSearch.innerHTML = filter.filterSwitch.renderBadge("allSt");
    attachEventBg();
  });
  tools.addEventListener("click", () => {
    navActive("tools");
    //  notifiedText.style.display = "none";
    searchForm.style.display = "none";
    recipeInfo.style.display = "none";
    resultList.style.display = "none";
    toolBox.style.display = "block";
  });

  const attachEventBg = () => {
    const allBg = document.getElementById("allBg");
    const vegetarianBg = document.getElementById("vegetarianBg");
    const veganBg = document.getElementById("veganBg");
    const glutenBg = document.getElementById("glutenBg");
    const dairyBg = document.getElementById("dairyBg");

    allBg.addEventListener("click", () => {
      filter.filterSwitch.pressAll();
      advanceSearch.innerHTML = filter.filterSwitch.renderBadge();
      attachEventBg();
    });
    vegetarianBg.addEventListener("click", () => {
      filter.filterSwitch.pressMe("vegetarian");
      advanceSearch.innerHTML = filter.filterSwitch.renderBadge();
      attachEventBg();
    });
    veganBg.addEventListener("click", () => {
      filter.filterSwitch.pressMe("vegan");
      advanceSearch.innerHTML = filter.filterSwitch.renderBadge();
      attachEventBg();
    });
    glutenBg.addEventListener("click", () => {
      filter.filterSwitch.pressMe("glutenFree");
      advanceSearch.innerHTML = filter.filterSwitch.renderBadge();
      attachEventBg();
    });
    dairyBg.addEventListener("click", () => {
      filter.filterSwitch.pressMe("dairyFree");
      advanceSearch.innerHTML = filter.filterSwitch.renderBadge();
      attachEventBg();
    });
  };

  searchText.addEventListener("keyup", (e) => {
    e.preventDefault();
    if (e.key === "Enter") {
      searchAction();
    }
  });

  searchFoodBtn.addEventListener("click", (e) => {
    e.preventDefault();
    searchAction();
  });

  loadMoreBtn.addEventListener("click", () => {
    offset = offset + number;
    //spinner.style.visibility = "visible";
    fzTool.displayText(loadingBottom, loadingText);
    fetchList(searchText.value);
  });

  closeContent.addEventListener("click", closeRecipe);

  const cardEvent = (card, id) => {
    card.addEventListener("click", () => {
      //spinner.style.visibility = "visible";
      fzTool.displayText(loadingBottom, loadingText);
      resultList.style.visibility = "hidden";
      document.documentElement.scrollTop = 0;
      fzTool.displayText(loadingTop, loadingText);
      fetchRecipe(id)
        .then((data) => {
          //console.log(data);
          infoBox.style.visibility = "collapse";
          //spinner.style.visibility = "collapse";
          fzTool.displayText(loadingBottom, "");
          //alert.style.visibility = "collapse";
          topInfoBox.style.height = "0";
          //spinnerTop.style.visibility = "collapse";
          // alertTop.style.visibility = "collapse";
          fzTool.displayText(loadingTop, "");

          renderRecipe(data);
        })
        .catch((e) => {
          console.log(e);
          //alertTop.style.visibility = "visible";
          fzTool.displayText(loadingTop, errorText);
        });
    });
  };

  //unit buttons
  const unitBtn = (btn, btn2, data, ingredientsText) => {
    btn.addEventListener("click", () => {
      if (btn.id === "metric") {
        unit = "metric";
      } else {
        unit = "us";
      }
      btn.setAttribute("class", "btn btn-sm btn-outline-secondary active");
      btn2.setAttribute("class", "btn btn-sm btn-outline-secondary");
      ingredientsText.innerHTML = renderIngredients(data);
    });
  };

  //functions
  function closeRecipe() {
    while (recipeInfo.firstChild) {
      recipeInfo.removeChild(recipeInfo.firstChild);
    }
    closeContent.style.visibility = "hidden";
    topInfoBox.style.height = "0";
    resultList.style.visibility = "visible";
  }

  //function to render search with query parameters
  function renderSearchQuery() {
    let queryString = "";
    // diet - single of either vegan or vegetarian , intorolance comma sep of diary, gluten
    if (filter.filterSwitch.switch.vegetarian[0]) {
      queryString += `&diet=${filter.filterSwitch.switch.vegetarian[4]}`;
    } else if (filter.filterSwitch.switch.vegan[0]) {
      queryString += `&diet=${filter.filterSwitch.switch.vegan[4]}`;
    }
    if (
      filter.filterSwitch.switch.glutenFree[0] &&
      filter.filterSwitch.switch.dairyFree[0]
    ) {
      queryString += `&intolerances=${filter.filterSwitch.switch.glutenFree[4]},${filter.filterSwitch.switch.dairyFree[4]}`;
    } else if (filter.filterSwitch.switch.glutenFree[0]) {
      queryString += `&intolerances=${filter.filterSwitch.switch.glutenFree[4]}`;
    } else if (filter.filterSwitch.switch.dairyFree[0]) {
      queryString += `&intolerances=${filter.filterSwitch.switch.dairyFree[4]}`;
    }
    return queryString;
  }

  //handle search action
  function searchAction() {
    offset = 0;
    clearTags();
    closeRecipe();
    recipeInfo.style.visibility = "none";
    resultList.style.visibility = "visible";
    if (searchText.value.trim().length > 0) {
      //spinner.style.visibility = "visible";
      fzTool.displayText(loadingBottom, loadingText);
      fetchList(searchText.value);
    } else {
      notifiedText.style.visibility = "visible";
      notifiedText.innerHTML =
        "<span style='color:red'>Please put something to eat :)</span>";
    }
  }

  function navActive(currentPage) {
    home.setAttribute("class", "nav-link");
    advance.setAttribute("class", "nav-link");
    tools.setAttribute("class", "nav-link");
    switch (currentPage) {
      case "home":
        home.setAttribute("class", "nav-link active");
        break;
      case "advance":
        advance.setAttribute("class", "nav-link active");
        break;
      case "tools":
        tools.setAttribute("class", "nav-link active");
        break;
    }
  }

  function clearTags() {
    while (resultList.firstChild) {
      resultList.removeChild(resultList.firstChild);
    }
  }
  //render individual recipe
  function renderRecipe(data) {
    //alert.style.visibility = "collapse";
    fzTool.displayText(loadingBottom, "");
    closeContent.style.visibility = "visible";
    const imageDiv = document.createElement("div"); //image wrapper
    const infoDiv = document.createElement("div"); // info wrapper  (info - diet,ingredients,methods,nutrition)
    const dietDiv = document.createElement("div");
    const ingredientsDiv = document.createElement("div");
    const methodDiv = document.createElement("div");
    const nutritionDiv = document.createElement("div");

    if (data.image === undefined) {
      data.image = "https://spoonacular.com/recipeImages/606953-556x370.jpg";
    }
    imageDiv.setAttribute("class", "text-center pt-10");
    imageDiv.innerHTML = `
        <img alt="${data.title}" src="${data.image}" class="rounded" /><br><h3>${data.title}</h3>`;

    infoDiv.setAttribute("class", "pt-20p");
    infoDiv.setAttribute("style", "text-align:left");

    dietDiv.innerHTML = `<div id="diet-text"></div>`;
    ingredientsDiv.setAttribute("class", "pt-05");
    ingredientsDiv.innerHTML = `<h6><b>Ingredients</b></h6>
        <div class="btn-group">
        <button id="us" class="btn btn-sm btn-outline-secondary active" aria-current="page">US</button>
        <button id="metric" class="btn btn-sm btn-outline-secondary">METRIC</button>
        </div>
        <div id="ingredientsText">
        </div>`;
    methodDiv.innerHTML = `<h6><b>Methods</b></h6>
      <div id="methodsText"></div>`;
    nutritionDiv.innerHTML = `<h6><b>Nutrition Information</b></h6>
      <div id="nutritionText"></div>`;

    dietDiv.append(ingredientsDiv, methodDiv, nutritionDiv);
    infoDiv.appendChild(dietDiv);

    imageDiv.append(infoDiv);
    recipeInfo.appendChild(imageDiv);

    const dietText = document.getElementById("diet-text");
    const ingredientsText = document.getElementById("ingredientsText");
    const methodsText = document.getElementById("methodsText");
    const nutritionText = document.getElementById("nutritionText");
    const usBtn = document.getElementById("us");
    const metricBtn = document.getElementById("metric");
    //check the current unit and maintain state to each recipe
    if (unit === "us") {
      usBtn.setAttribute("class", "btn btn-sm btn-outline-secondary active");
      metricBtn.setAttribute("class", "btn btn-sm btn-outline-secondary");
    } else {
      usBtn.setAttribute("class", "btn btn-sm btn-outline-secondary");
      metricBtn.setAttribute(
        "class",
        "btn btn-sm btn-outline-secondary active"
      );
    }
    unitBtn(usBtn, metricBtn, data, ingredientsText); //register us button
    unitBtn(metricBtn, usBtn, data, ingredientsText); // register metric button
    dietText.innerHTML = renderDiet(data);
    ingredientsText.innerHTML = renderIngredients(data);
    methodsText.innerHTML = renderMethods(data);
    nutritionText.innerHTML = renderNutrition(data);
  }

  //render badge
  function renderBadge(diet, color, active) {
    let badge = "";
    if (active === true) {
      badge = `<span class="badge bg-${color}">${diet}</span>`;
    } else {
      badge = `<span class="badge bg-light text-grey">${diet}</span>`;
    }
    return badge;
  }
  //render diet
  function renderDiet(data) {
    let dietText = "";
    vegetarianBadge = data.vegetarian
      ? renderBadge("vegetarian", "primary", true)
      : renderBadge("vegetarian", "primary", false);
    veganBadge = data.vegan
      ? renderBadge("vegan", "success", true)
      : renderBadge("vegan", "primary", false);
    glutenFreeBadge = data.glutenFree
      ? renderBadge("gluten free", "info", true)
      : renderBadge("gluten free", "primary", false);
    dairyFreeBadge = data.dairyFree
      ? renderBadge("dairy free", "warning", true)
      : renderBadge("dairy free", "primary", false);
    lowFodMapBadge = data.lowFodmap
      ? renderBadge("low fodmap", "dark", true)
      : renderBadge("low fodmap", "primary", false);
    dietText =
      vegetarianBadge +
      veganBadge +
      glutenFreeBadge +
      dairyFreeBadge +
      lowFodMapBadge;
    return dietText;
  }

  //render Nutrition
  function renderNutrition(data) {
    let nutritionText = "";
    //const nutritionDiv = document.createElement("div");
    //nutritionDiv.setAttribute("class", "row row-col-3");
    nutritionText = '<div class="row row-col-4">';
    data.nutrition.nutrients.forEach((el, index, array) => {
      if (index < 8) {
        //first 8 not good for health items
        if (index !== 4) {
          //exclude net carb
          nutritionText += `
            <div class="col-2 red-n">${el.title}</div>
            <div class="col-2 red-n">${el.amount} ${el.unit}</div>
            <div class="col-7">
            <div class="progress m-progress-t" style="height: 5px;">
            <div class="progress-bar bg-danger" role="progressbar" style="width: ${el.percentOfDailyNeeds}%" aria-valuenow="${el.percentOfDailyNeeds}" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            </div>
            <div class="col-1 red-n">${el.percentOfDailyNeeds}%</div>`;
        }
      } else {
        nutritionText += `
            <div class="col-2 green-n">${el.title}</div>
            <div class="col-2 green-n">${el.amount} ${el.unit}</div>
            <div class="col-7">
            <div class="progress m-progress-t" style="height: 5px;">
            <div class="progress-bar bg-success" role="progressbar" style="width: ${el.percentOfDailyNeeds}%" aria-valuenow="${el.percentOfDailyNeeds}" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            </div>
            <div class="col-1 green-n">${el.percentOfDailyNeeds}%</div>`;
      }
    });
    nutritionText += "</div>";
    return nutritionText;
  }

  //render Ingredients
  function renderIngredients(data) {
    let ingredientsText = '<ul class="list-unstyled">';
    const usArr = [];
    const metricArr = [];
    let tempEl;
    data.extendedIngredients.forEach((el) => {
      usArr.push([
        el.measures["us"].amount,
        el.measures["us"].unitShort + " " + el.originalName,
      ]);

      tempEl = Number.isInteger(el.measures["metric"].amount)
        ? el.measures["metric"].amount
        : el.measures["metric"].amount.toFixed(2);

      metricArr.push([
        tempEl,
        el.measures["metric"].unitShort + " " + el.originalName,
      ]);
    });
    ingredients.us = usArr;
    ingredients.metric = metricArr;
    console.log(ingredients);
    if (unit === "us") {
      usArr.forEach((el) => {
        ingredientsText += `<li>${el[0]}&nbsp;&nbsp;&nbsp;${el[1]}</li>`;
      });
    } else {
      metricArr.forEach((el) => {
        ingredientsText += `<li>${el[0]}&nbsp;&nbsp;&nbsp;${el[1]}</li>`;
      });
    }
    return ingredientsText + "</ul>";
  }
  //render Methods
  function renderMethods(data) {
    let methodsText = '<ul class="list-unstyled">';
    data.analyzedInstructions[0].steps.forEach((step) => {
      methodsText += `<li>${step.number}. ${step.step}</li>`;
    });
    return methodsText + "</ul>";
  }

  //render recipes
  function renderList(data) {
    //alert.style.visibility = "collapse";
    fzTool.displayText(loadingBottom, "");
    fzTool.displayText(loadingTop, "");
    //alertTop.style.visibility = "collapse";
    //spinnerTop.style.visibility = "collapse";
    topInfoBox.style.height = "0";

    const totalResults = data.totalResults;

    const list = document.createElement("div");
    list.setAttribute("class", "row mb-3 text-center row-col-6");

    data.results.forEach((element) => {
      list.appendChild(cardDisplay(element));
    });

    resultList.appendChild(list);

    loadMore(totalResults);
  }
  //image card render for render list
  function cardDisplay(element) {
    //image container for  result list
    const cardColumn = document.createElement("div");
    const card = document.createElement("div");
    const img = document.createElement("img");
    const cardBody = document.createElement("div");
    const cardTitle = document.createElement("h6");

    cardColumn.setAttribute("class", "col-12 col-sm-6 col-md-2 mb-3");
    card.setAttribute("data-id", element.id);
    card.setAttribute("class", "card");
    img.setAttribute("src", element.image);
    img.setAttribute("class", "rounded");
    cardBody.setAttribute("class", "card-body");
    cardTitle.setAttribute("class", "card-title");
    cardTitle.innerText = element.title;

    cardBody.appendChild(cardTitle);

    card.append(img, cardBody);
    cardColumn.appendChild(card);
    cardEvent(card, element.id); // add event listener
    return cardColumn;
  }
  //load more button
  function loadMore(totalResults) {
    if (totalResults - number - offset > 0) {
      loadMoreBtn.setAttribute("class", "btn-lg btn-light");
      loadMoreBtn.innerText = "Load more....";
      resultList.appendChild(loadMoreBtn);
    } else {
      loadMoreBtn.remove();
    }
  }
  //home page
  function renderHome() {
    //alert.style.visibility = "collapse";
    fzTool.displayText(loadingBottom, "");
    toolBox.style.display = "none";
    if (config.jokeEnable) {
      const joke = document.getElementsByTagName("h6")[0];
      fetchJoke()
        .then((data) => {
          joke.innerText = data.text;
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }

  //fetch
  function fetchJoke() {
    return fetch(baseURL + `food/jokes/random?apiKey=${apiKey}`).then((resp) =>
      resp.json()
    );
  }

  function fetchRecipe(id) {
    return fetch(
      baseURL +
        `recipes/${id}/information?apiKey=${apiKey}&instructionsRequired=true&includeNutrition=true`
    ).then((resp) => resp.json());
  }

  function fetchList(query) {
    fzTool.displayText(notifiedText, "");
    let notFoundText = "";
    if (avdSearch === true && filter.filterSwitch.switch.all[0] !== true) {
      query += renderSearchQuery();
      fzTool.displayText(loadingBottom, loadingText);
      notFoundText =
        "sorry please try another keyword (there is not dish to match the filter).";
    } else {
      notFoundText =
        "We can not find any food you like, please try something like pasta :)";
    }

    console.log(query);

    return fetch(
      baseURL +
        `recipes/complexSearch?apiKey=${apiKey}&query=${query}&number=${number}&offset=${offset}`
    )
      .then((resp) => resp.json())
      .then((data) => {
        if (data.totalResults === 0) {
          // notifiedText.style.display = "block";
          fzTool.displayText(
            notifiedText,
            `<span style='color:red'>${notFoundText}</span>`
          );
        }

        //spinner.style.visibility = "collapse";
        fzTool.displayText(loadingBottom, "");
        //infoBox.style.height = "0";
        //alert.style.visibility = "collapse";

        renderList(data);
      })
      .catch((e) => {
        console.log(e);
        //alert.style.visibility = "visible";
        fzTool.displayText(loadingBottom, errorText);
        //spinner.style.visibility = "collapse";
      });
  }

  renderHome();
})();
