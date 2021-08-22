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
        fetchList(searchText.value);
      }
    });

    searchFoodBtn.addEventListener("click", (e) => {
      e.preventDefault();
      spinner.style.visibility = "visible";
      console.log("search text:  ", searchText.value);
      offset = 0;
      fetchList(searchText.value);
    });

    loadMoreBtn.addEventListener("click", () => {
      offset = offset + number;
      fetchList(searchText.value);
    });

    //functions
    function clearTags() {
      while (resultList.firstChild) {
        resultList.removeChild(resultList.firstChild);
      }
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
          list.innerHTML =
            list.innerHTML +
            `<div class="col-12 col-lg-4">
            <div class="card">
            <img src="${element.image}" class="rounded" />
            <div class="card-body">
            <h6 class="card-title">${element.title}</h6>
            </div>
            </div>
            </div>`;
        });
        idx = idx + 3;
        resultList.appendChild(list);
        loadMore(totalResults);
      }
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
