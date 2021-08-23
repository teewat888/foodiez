'USE STRICT';
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
    const spinner = document.querySelector(".spinner-border");
    const alert = document.querySelector(".alert");
    const loadMoreBtn = document.createElement("button");
    const closeContent = document.getElementById("closeContent");
    const infoBox = document.getElementById('info-box');
    let number = 18; //number of result per fetch
    let offset = 0; // offset for pagination

    //events listener
    searchText.addEventListener("keyup", (e) => {
      e.preventDefault();
      if (e.key === "Enter") {
        spinner.style.visibility = "visible";
        offset = 0;
        clearTags();
        resultList.style.visibility = "visible";
        fetchList(searchText.value);
      }
    });

    searchFoodBtn.addEventListener("click", (e) => {
      e.preventDefault();
      spinner.style.visibility = "visible";
      //console.log("search text:  ", searchText.value);
      offset = 0;
      clearTags();
      resultList.style.visibility = "visible";
      fetchList(searchText.value);
    });

    loadMoreBtn.addEventListener("click", () => {
      offset = offset + number;
      fetchList(searchText.value);
    });

    closeContent.addEventListener("click", () => {
      while (recipeInfo.firstChild) {
        recipeInfo.removeChild(recipeInfo.firstChild);
      }
      closeContent.style.visibility = "hidden";
      resultList.style.visibility = "visible";
    });

    const cardEvent = (card, id) => {
      card.addEventListener("click", () => {
        spinner.style.visibility = "visible";
        resultList.style.visibility = "hidden";
        document.documentElement.scrollTop = 0;
        fetchRecipe(id).then((data) => {
            //console.log(data);
            infoBox.style.visibility = "collapse";
            spinner.style.visibility = "collapse";
            renderRecipe(data);
        });
        
      });
    };

    //functions
    function clearTags() {
      while (resultList.firstChild) {
        resultList.removeChild(resultList.firstChild);
      }
    }

    function renderRecipe(data) {
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

    function renderList(data) {
      //display no search result
      const totalResults = data.totalResults;
      //idx to track slice element to get 6 slices each row (idx+6)
      let idx = 0;
      // i to provide the max rows to display each time
      for (let i = 0; i < 3; i++) {
        const list = document.createElement("div");
        list.setAttribute("class", "row mb-3 text-center");
        let choppedData = data.results.slice(idx, idx + 6);
        choppedData.forEach((element) => {
          list.appendChild(cardDisplay(element));
        });
        idx = idx + 6; // offset the chopped range
        resultList.appendChild(list);

        loadMore(totalResults);
      }
    }

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

    function loadMore(totalResults) {
      if (totalResults - number - offset > 0) {
        loadMoreBtn.setAttribute("class", "btn-lg btn-light");
        loadMoreBtn.innerText = "Load more....";
        resultList.appendChild(loadMoreBtn);
      } else {
        loadMoreBtn.remove();
      }
    }

    function renderHome() {
      alert.style.visibility = "collapse";
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
          spinner.style.visibility = "collapse";
          infoBox.style.height = "0";
         // console.log(data);
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
