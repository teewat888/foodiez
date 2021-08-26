"USE STRICT";

/* 
To do :
renderNutrition
*/

(() => {
  document.addEventListener("DOMContentLoaded", () => {
    //config
    const baseURL = "https://api.spoonacular.com/";
    const localURL = "http://localhost:3000/";
    const config = {
      jokeEnable: false,
    };
    const searchFoodBtn = document.getElementById("searchFood");
    const searchText = document.getElementById("searchText");
    const resultList = document.getElementById("result-list");
    const recipeInfo = document.getElementById("recipe-info");
    const spinner = document.getElementById("spinner");
    const alert = document.getElementById("alert");
    const loadMoreBtn = document.createElement("button");
    const closeContent = document.getElementById("closeContent");
    const infoBox = document.getElementById("info-box");
    const topInfoBox = document.getElementById("top-info-box");
    const spinnerTop = document.getElementById("spinner-top");
    const alertTop = document.getElementById("alert-top");
    const home = document.getElementById("home");
    const advance = document.getElementById("advance");
    const tools = document.getElementById("tools");
    const notifiedText = document.getElementById("notified-text");
    const searchForm = document.getElementById("search-form");
    const toolBox = document.getElementById("tool-box");

    let number = 18; //number of result per fetch
    let offset = 0; // offset for pagination

    //events listener
    home.addEventListener("click", () => {
      navActive("home");
      searchForm.style.display = "block";
      recipeInfo.style.display = "block";
      toolBox.style.display = "none";
    });

    advance.addEventListener("click", () => {
      navActive("advance");
    });

    tools.addEventListener("click", () => {
      navActive("tools");
      searchForm.style.display = "none";
      recipeInfo.style.display = "none";
      toolBox.style.display = "block";
    });

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
      spinner.style.visibility = "visible";
      fetchList(searchText.value);
    });

    closeContent.addEventListener("click", () => {
      while (recipeInfo.firstChild) {
        recipeInfo.removeChild(recipeInfo.firstChild);
      }
      closeContent.style.visibility = "hidden";
      topInfoBox.style.height = "0";
      resultList.style.visibility = "visible";
    });

    const cardEvent = (card, id) => {
      card.addEventListener("click", () => {
        spinner.style.visibility = "visible";
        resultList.style.visibility = "hidden";
        document.documentElement.scrollTop = 0;
        spinnerTop.style.visibility = "visible";
        fetchRecipe(id)
          .then((data) => {
            //console.log(data);
            infoBox.style.visibility = "collapse";
            spinner.style.visibility = "collapse";
            alert.style.visibility = "collapse";
            topInfoBox.style.height = "0";
            spinnerTop.style.visibility = "collapse";
            alertTop.style.visibility = "collapse";

            renderRecipe(data);
          })
          .catch((e) => {
            console.log(e);
            alertTop.style.visibility = "visible";
          });
      });
    };

    //functions
    function searchAction() {
      offset = 0;
      clearTags();
      resultList.style.visibility = "visible";
      if (searchText.value.trim().length > 0) {
        spinner.style.visibility = "visible";
        notifiedText.style.visibility = "hidden";
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
      alert.style.visibility = "collapse";
      closeContent.style.visibility = "visible";
      const imageDiv = document.createElement("div");
      if (data.image === undefined) {
        data.image = "https://spoonacular.com/recipeImages/606953-556x370.jpg";
      }
      imageDiv.setAttribute("class", "text-center pt-10");
      imageDiv.innerHTML = `
        <img alt="${data.title}" src="${
        data.image
      }" class="rounded" /><br><h3>${data.title}</h3>
        <div style="text-align:left" class="pt-20p">

        <h6><b>Ingredients</b></h6>
        ${renderIngredients(data)}
        <h6><b>Methods</b></h6>
        ${renderMethods(data)}
        <h6><b>Nutrition Information</b></h6>
        ${renderNutrition(data)}
        <div>
        `;

      recipeInfo.appendChild(imageDiv);
      
    }

    //render Nutrition
    function renderNutrition(data) {
      let nutritionText = "";
      const nutritionDiv = document.createElement("div");
      nutritionDiv.setAttribute("class", "row row-col-3");
      nutritionText = '<div class="row row-col-3">';
      data.nutrition.nutrients.forEach((el, index, array) => {
        if (index < 8) {
          //first 8 not good for health items
          if (index !== 4) {
            //exclude net carb
            nutritionText += `
            <div class="col-4">${el.title}</div>
            <div class="col-2">${el.amount} ${el.unit}</div>
            <div class="col-6"></div>`;
          }
        }
      });
      nutritionText += '</div>';
      return nutritionText;
    }

    //render Ingredients
    function renderIngredients(data) {
      let ingredientsText = "";
      data.extendedIngredients.forEach((el) => {
        ingredientsText += `<p>${el.originalString}</p>`;
      });
      return ingredientsText;
    }
    //render Methods
    function renderMethods(data) {
      let methodsText = "";
      data.analyzedInstructions[0].steps.forEach((step) => {
        methodsText += `<p>${step.number}. ${step.step}</p>`;
      });
      return methodsText;
    }

    //render cuisine styles
    function renderCuisine(data) {}
    //render special diet

    //render recipes
    function renderList(data) {
      alert.style.visibility = "collapse";
      alertTop.style.visibility = "collapse";
      spinnerTop.style.visibility = "collapse";
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
      alert.style.visibility = "collapse";
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
      return fetch(baseURL + `food/jokes/random?apiKey=${apiKey}`).then(
        (resp) => resp.json()
      );
    }

    function fetchRecipe(id) {
      return fetch(
        baseURL +
          `recipes/${id}/information?apiKey=${apiKey}&instructionsRequired=true&includeNutrition=true`
      ).then((resp) => resp.json());
    }

    function fetchList(query) {
      return fetch(
        baseURL +
          `recipes/complexSearch?apiKey=${apiKey}&query=${query}&number=${number}&offset=${offset}`
      )
        .then((resp) => resp.json())
        .then((data) => {
          if (data.totalResults === 0) {
            notifiedText.style.visibility = "visible";
            notifiedText.innerHTML =
              "<span style='color:red'>We can not find any food you like, please try something like pasta :)</span>";
          }

          spinner.style.visibility = "collapse";
          //infoBox.style.height = "0";
          alert.style.visibility = "collapse";

          renderList(data);
        })
        .catch((e) => {
          console.log(e);
          alert.style.visibility = "visible";
          spinner.style.visibility = "collapse";
        });
    }

    renderHome();
  });
})();
