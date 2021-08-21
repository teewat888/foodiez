(() => {
  document.addEventListener("DOMContentLoaded", () => {
    //config
    const baseURL = "https://api.spoonacular.com/";
    const localURL = "http://localhost:3000/";
    const config = {
      jokeEnable: false,
    };
    const searchFood = document.getElementById("searchFood");
    const searchText = document.getElementById("searchText");
    const resultList = document.getElementById("result-list");
    const spinner = document.querySelector(".spinner-border");
    //events listener
    searchFood.addEventListener("click", (e) => {
      e.preventDefault();
      spinner.style.visibility = "visible";
      console.log("search text:  ", searchText.value);
      fetchList(searchText.value)
        .then((data) => {
          spinner.style.visibility = "hidden";
          console.log(data);
          clearTags();
          renderList(data);
        })
        .catch((e) => {
          console.log(e);
        });
    });

    //functions
    function clearTags() {
      while (resultList.firstChild) {
        resultList.removeChild(resultList.firstChild);
      }
    }

    function renderList(data) {
      let idx = 0;
      for (let i = 0; i < 3; i++) {
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
      }
    }

    function renderHome() {
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
          `/recipes/complexSearch?apiKey=${apiKey}&query=${query}&number=9`
      ).then((resp) => resp.json());
    }

    renderHome();
  });
})();
