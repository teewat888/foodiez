//iffe - tools section
const fzTool = (() => {
  const inputSubstitute = document.getElementById("input-substitute");
  const btnSubstitute = document.getElementById("btnSubstitute");
  const substituteText = document.getElementById("substituteText");
  //const maxInputGI = 10; //maximum number of input that gi tool can add

  //tool event listener
  inputSubstitute.addEventListener("keyup", (e) => {
    e.preventDefault();
    if (e.key === "Enter") {
      searchSubstitute();
    }
  });
  btnSubstitute.addEventListener("click", (e) => {
    e.preventDefault();
    searchSubstitute();
  });

  //end tool event listener
  function searchSubstitute() {
    if (myIngredient.getIngId(inputSubstitute.value) === undefined) {
      let text = "";
      let suggestArr = myIngredient.getSuggestions(inputSubstitute.value);
      console.log(suggestArr);
      if (suggestArr.length === 0) {
        substituteText.innerHTML = `The <font style="color:red">${inputSubstitute.value}</font> was not in the database please try something else`;
        return false;
      } else {
          substituteText.innerText = '';
          const ul = document.createElement("ul");
          ul.setAttribute('class','list-unstyled push-top');
          suggestArr.forEach((el) => {
              const li = document.createElement("li");
              li.setAttribute('data',el.Ingredient);
              li.innerHTML = `<button class="btn btn-sm btn-grey pt-05">${el.Ingredient}</button>`;
              ul.appendChild(li);
              li.addEventListener('click', () => {
                  inputSubstitute.value = el.Ingredient;
                  searchSubstitute();
              })
          })
          substituteText.appendChild(ul);
          return false;
      }
    }
    fetchSubstitute(inputSubstitute.value)
      .then((data) => {
        if (data.status === "success") {
          let text = "";
          const subArr = data.substitutes.map((el) => `<li>${el}</li>`);
          text = subArr.join("");
          text =
            "Found " +
            data.substitutes.length +
            " substitute(s) for " +
            inputSubstitute.value +
            "<br><ul>" +
            text +
            "</ul>";
          substituteText.innerHTML = text;
        } else {
          substituteText.innerHTML = `<font style="color:red">Could not find any substitude for ${inputSubstitute.value}
              </font>`;
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function fetchSubstitute(keyword) {
    return fetch(
      baseURL +
        `food/ingredients/substitutes?apiKey=${apiKey}&ingredientName=${keyword}`
    ).then((resp) => resp.json());
  }
  // return functions to use in global scope
})();
