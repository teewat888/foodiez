"USE STRICT";

/* 
To do :
->add eventListener "error" to image in recipe page to handle missing of image property (renderRecipe)
-->add loading spinner for individual recipe  (add more infoBox on top with default height 0)
--> add there is no result text to inform user. 

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
      toolBox.style.display = "none";
    });

    advance.addEventListener("click", () => {
      navActive("advance");
    });

    tools.addEventListener("click", () => {
      navActive("tools");
      searchForm.style.display = "none";
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
      const topContent = document.createElement("div");
      topContent.setAttribute("class", "row");
      topContent.innerHTML = `<div class="col-md-6">
        <img alt="${data.title}" src="${data.image}" class="rounded"/>
        </div>
        <div class="col-md-6">
        </div>`;
      recipeInfo.appendChild(topContent);
    }
    //render recipes
    function renderList(data) {
      alert.style.visibility = "collapse";
      alertTop.style.visibility = "collapse";
      spinnerTop.style.visibility = "collapse";
      topInfoBox.style.height = "0";
      //display no search result
      const totalResults = data.totalResults;
      //idx to track slice element to get 6 slices each row (idx+6)
      let idx = 0;
      // i to limit the max rows to display each time
      for (let i = 0; i < 3; i++) {
        const list = document.createElement("div");
        list.setAttribute("class", "row mb-3 text-center");
        let choppedData = data.results.slice(idx, idx + 6); //chopped data = number of columns
        choppedData.forEach((element) => {
          list.appendChild(cardDisplay(element));
        });
        idx = idx + 6; // offset the chopped range
        resultList.appendChild(list);

        loadMore(totalResults);
      }
    }
    //image card render for render list
    function cardDisplay(element) {
      //image container for  result list
      const cardColumn = document.createElement("div");
      const card = document.createElement("div");
      const img = document.createElement("img");
      const cardBody = document.createElement("div");
      const cardTitle = document.createElement("h6");

      cardColumn.setAttribute("class", "col-12 col-sm-6 col-md-2");
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
      return fetch(baseURL + `/food/jokes/random?apiKey=${apiKey}`).then(
        (resp) => resp.json()
      );
    }

    function fetchRecipe(id) {
      return fetch(
        baseURL + `/recipes/${id}/information?apiKey=${apiKey}`
      ).then((resp) => resp.json());
    }

    function fetchList(query) {
      return fetch(
        baseURL +
          `/recipes/complexSearch?apiKey=${apiKey}&query=${query}&number=${number}&offset=${offset}`
      )
        .then((resp) => resp.json())
        .then((data) => {
          if (data.totalResults === 0) {
            notifiedText.style.visibility = "visible";
            notifiedText.innerHTML =
              "<span style='color:red'>We can not find any food you like please try again eg. pasta :)</span>";
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
