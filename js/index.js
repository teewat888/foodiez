"USE STRICT";
/* 
To do :
ingredient multiplier

*/

(() => {
  const searchFoodBtn = document.getElementById("search-food");
  const searchText = document.getElementById("search-text");
  const resultList = document.getElementById("result-list");
  const recipeInfo = document.getElementById("recipe-info");
  const loadMoreBtn = document.createElement("button");
  //const closeContent = document.getElementById("close-content");
  const infoBox = document.getElementById("info-box");
  const topInfoBox = document.getElementById("top-info-box");
  const home = document.getElementById("home");
  const advance = document.getElementById("advance");
  const tools = document.getElementById("tools");
  const notifiedText = document.getElementById("notified-text");
  const searchForm = document.getElementById("search-form");
  const toolBox = document.getElementById("tool-box");
  const advanceSearch = document.getElementById("advance-search");
  const loadingTop = document.getElementById("loading-top");
  const loadingBottom = document.getElementById("loading-bottom");
  const iCaption = document.getElementById("i-caption");
  iCaption.style.display = "none";
  let number = 18; //number of result per fetch
  let offset = 0; // offset for pagination
  let unit = "us"; // default unit of ingredients
  let ingredients = {}; // object to store ingredients
  let avdSearch = false;

  const userId = config.fixUserMode === true ? 1 : localFn.generateUserId();
  const user = [];
  user.push(userId); // index 0 = id , index 1 = user name
  localFn.getUserName(userId, user);

  searchFoodBtn.style.marginTop = "24px";
  //events listener
  home.addEventListener("click", () => {
    avdSearch = false;
    navActive("home");
    searchForm.style.display = "block";
    searchFoodBtn.style.marginTop = "24px";
    recipeInfo.style.display = "block";
    toolBox.style.display = "none";
    advanceSearch.style.display = "none";
    resultList.style.display = "block";
  });

  advance.addEventListener("click", () => {
    avdSearch = true;
    navActive("advance");
    iCaption.style.display = "block";
    resultList.style.display = "block";
    recipeInfo.style.display = "block";
    searchFoodBtn.style.marginTop = "0px";
    toolBox.style.display = "none";
    searchForm.style.display = "block";
    advanceSearch.style.display = "block";
    advanceSearch.innerHTML = filter.filterSwitch.renderBadge("allSt");
    attachEventBg();
  });
  tools.addEventListener("click", () => {
    navActive("tools");
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
    /*
    console.log('press enter 1');
    if (e.key === "Enter") {
      console.log('press enter inside');
      searchFoodBtn.click();
    } 
    */
  });

  searchFoodBtn.addEventListener("click", (e) => {
    e.preventDefault();
    searchAction();
  });

  loadMoreBtn.addEventListener("click", () => {
    offset = offset + number;
    fzTool.displayText(loadingBottom, loadingText);
    fetchList(searchText.value);
  });

  const cardEvent = (card, id) => {
    card.addEventListener("click", () => {
      fzTool.displayText(loadingBottom, loadingText);
      console.log("clicked recipe id: ", id);
      resultList.style.visibility = "hidden";
      document.documentElement.scrollTop = 0;
      fzTool.displayText(loadingTop, loadingText);
      fetchRecipe(id)
        .then((data) => {
          infoBox.style.visibility = "collapse";
          fzTool.displayText(loadingBottom, "");
          topInfoBox.style.height = "0";
          fzTool.displayText(loadingTop, "");

          renderRecipe(data);
        })
        .catch((e) => {
          console.log(e);
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
    console.log("clicked close content");
    iCaption.style.display = "none";
    iCaption.innerHTML = "";
    //closeContent.style.visibility = "hidden";
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
    console.log('do search action');
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
    resultList.innerHTML = '';
  }
  //render individual recipe
  function renderRecipe(data) {
    fzTool.displayText(loadingBottom, "");
    const imageDiv = document.createElement("img");
    const infoDiv = document.createElement("div"); // info wrapper  (info - diet,ingredients,methods,nutrition)
    const dietDiv = document.createElement("div");
    const ingredientsDiv = document.createElement("div");
    const methodDiv = document.createElement("div");
    const nutritionDiv = document.createElement("div");
    const recipeComments = document.createElement("div");
    const recipeForm = document.createElement("div");
    const closeContent = document.createElement("div");
    iCaption.style.display = "block";
    closeContent.innerHTML =
      '<p class="card-text closeBtnRight" >' +
      data.title +
      "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;X</p>";
    closeContent.setAttribute("class", "card-body");

    if (data.image === undefined) {
      data.image = "https://spoonacular.com/recipeImages/606953-556x370.jpg";
    }
    imageDiv.setAttribute("class", "card-img-bottom");
    imageDiv.setAttribute("src", data.image);
    console.log(imageDiv);

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

    recipeForm.setAttribute("class", "mb-3");
    recipeForm.innerHTML = `<textarea class="form-control" id="comment-input" rows="3"></textarea>
    </br><button id="comment-submit" class="btn btn-sm btn-primary">submit</button>`;

    recipeComments.setAttribute("class", "pt-05");

    dietDiv.append(
      ingredientsDiv,
      methodDiv,
      nutritionDiv,
      recipeComments,
      recipeForm
    );
    infoDiv.appendChild(dietDiv);
    closeContent.append(imageDiv);
    iCaption.appendChild(closeContent);

    iCaption.append(infoDiv);
    recipeInfo.appendChild(iCaption);
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

    dietText.innerHTML =
      renderDiet(data) + '<span class="like-glyph">&#x2661;</span>';
    ingredientsText.innerHTML = renderIngredients(data);
    methodsText.innerHTML = renderMethods(data);
    nutritionText.innerHTML = renderNutrition(data);
    localFn.renderComments(data.id, recipeComments);
    const commentInput = document.getElementById("comment-input");
    const btnComment = document.getElementById("comment-submit");
    const spanHeart = document.querySelector("span.like-glyph");

    //event listeners for the recipe
    unitBtn(usBtn, metricBtn, data, ingredientsText); //register us event button
    unitBtn(metricBtn, usBtn, data, ingredientsText); // register metric event button
    console.log("current user ", user[1]);
    localFn.checkFavorite(spanHeart, data.id, user[0], user[1], "render"); //check current user fav?
    closeContent.addEventListener("click", closeRecipe);
    spanHeart.addEventListener("click", () => {
      localFn.checkFavorite(spanHeart, data.id, user[0], user[1], "toggle");
    });
    btnComment.addEventListener("click", (e) => {
      e.preventDefault();
      localFn.addComment(data.id, recipeComments, commentInput.value, user);
    });
  }

  //render badge style
  function renderBadge(diet, color, active) {
    let badge = "";
    if (active === true) {
      badge = `<span class="badge bg-${color}">${diet}</span>`;
    } else {
      badge = `<span class="badge bg-light text-grey">${diet}</span>`;
    }
    return badge;
  }
  //render diet badges
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
    nutritionText += '</div><h6 class="pt-05"><b>Comments</b></h6>';
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
    fzTool.displayText(loadingBottom, "");
    fzTool.displayText(loadingTop, "");
    topInfoBox.style.height = "0";

    const totalResults = data.totalResults;

    const list = document.createElement("div");
    list.setAttribute("class", "row mb-3 text-center row-col-6");

    data.results.forEach((element) => {
      list.appendChild(cardDisplay(element));
    });

    resultList.appendChild(list);
    console.log('render list');
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
    if (config.devMode) {
      console.log("fetch recipe local");
      return fetch(localURL + "recipes").then((resp) => resp.json());
    }

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

    console.log('display query in fetch list ',query);
    if (config.devMode) {
      console.log("fetch list local");
      return fetch(localURL + "lists")
        .then((resp) => resp.json())
        .then((data) => {
          if (data.totalResults === 0) {
            fzTool.displayText(
              notifiedText,
              `<span style='color:red'>${notFoundText}</span>`
            );
          }

          fzTool.displayText(loadingBottom, "");
          renderList(data);
        })
        .catch((e) => {
          console.log(e);
          fzTool.displayText(loadingBottom, errorText);
        });
    } //end local dev

    fetch(
      baseURL +
        `recipes/complexSearch?apiKey=${apiKey}&query=${query}&number=${number}&offset=${offset}`
    )
      .then((resp) => resp.json())
      .then((data) => {
        if (data.totalResults === 0) {
          fzTool.displayText(
            notifiedText,
            `<span style='color:red'>${notFoundText}</span>`
          );
        }

        fzTool.displayText(loadingBottom, "");
        console.log('fetch list');
        renderList(data);
        
      })
      .catch((e) => {
        console.log(e);
        fzTool.displayText(loadingBottom, errorText);
      });
  }

  renderHome();
})();
