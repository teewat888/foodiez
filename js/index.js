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
    const recipeInfo = document.getElementsById('recipe-info')
    const spinner = document.querySelector(".spinner-border");
    const alert = document.querySelector(".alert");
    const loadMoreBtn = document.createElement("button");
    let number = 18; //number of result per fetch
    let offset = 0; // offset for pagination

    //events listener
    searchText.addEventListener("keyup", (e) => {
      e.preventDefault();
      if (e.key === "Enter") {
        spinner.style.visibility = "visible";
        offset = 0;
        clearTags();
        fetchList(searchText.value);
      }
    });

    searchFoodBtn.addEventListener("click", (e) => {
      e.preventDefault();
      spinner.style.visibility = "visible";
      console.log("search text:  ", searchText.value);
      offset = 0;
      clearTags();
      fetchList(searchText.value);
    });

    loadMoreBtn.addEventListener("click", () => {
      offset = offset + number;
      fetchList(searchText.value);
    });

    const cardEvent = (card, id) => {
      card.addEventListener("click", () => {
        resultList.style.visibility = 'hidden';
        fetchRecipe(id).then((data) => console.log(data));
        renderRecipe(data);
      });
    };

    //functions
    function clearTags() {
      while (resultList.firstChild) {
        resultList.removeChild(resultList.firstChild);
      }
    }

    function renderRecipe(data) {
        
    }

    function renderList(data) {
      //display no search result
      const totalResults = data.totalResults;
      //idx to track slice element to get 3 slices each row (idx+3)
      let idx = 0;
      // i to provide the max rows to display each time
      for (let i = 0; i < 6; i++) {
        const list = document.createElement("div");
        list.setAttribute("class", "row mb-3 text-center");
        let choppedData = data.results.slice(idx, idx + 3);
        choppedData.forEach((element) => {
          list.appendChild(cardDisplay(element));
          /*const card = document.querySelector(`.card [data-id="${element.id}"]`);
          card.addEventListener("click", () => {
            clearTags();  
            fetchRecipe(element.id).then((data) => console.log(data));
          });*/
        });
        idx = idx + 3; // offset the chopped range
        resultList.appendChild(list);

        loadMore(totalResults);
      }
    }

    function cardDisplay(element) {
      const cardColumn = document.createElement("div");
      const card = document.createElement("div");
      const img = document.createElement("img");
      const cardBody = document.createElement("div");
      const cardTitle = document.createElement("h6");

      cardColumn.setAttribute("class", "col-12 col-lg-4");
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
        loadMoreBtn.innerText = "Load more....";
        resultList.appendChild(loadMoreBtn);
      } else {
        loadMoreBtn.remove();
      }
    }

    function renderHome() {
      alert.style.visibility = "hidden";
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
          spinner.style.visibility = "hidden";
          console.log(data);
          renderList(data);
        })
        .catch((e) => {
          console.log(e);
          alert.style.visibility = "visible";
          spinner.style.visibility = "hidden";
        });
    }

    renderHome();
  });
})();
