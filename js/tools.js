//iffe - tools section
const fzTool = (() => {
  const inputSubstitute = document.getElementById("input-substitute");
  const btnSubstitute = document.getElementById("btn-substitute");
  const substituteText = document.getElementById("substitute-text");
  const inputNutrition = document.getElementById("input-nutrition");
  const nutritionText = document.getElementById("nutrition-text");
  const btnNutrition = document.getElementById("btn-nutrition");

  //tool event listener
  
  inputTextEvent(inputSubstitute, substituteText, fetchSubstitute);
  buttonEvent(btnSubstitute, inputSubstitute, substituteText, fetchSubstitute);
  

  function inputTextEvent(element, targetText, fetch) {
    element.addEventListener("keyup", (e) => {
      e.preventDefault();
      if (e.key === "Enter") {
        checkKeywordNfetch(element.value, targetText, fetch);
      }
    });
  }

  function buttonEvent(element, textElement, targetText, fetch) {
    element.addEventListener("click", (e) => {
      e.preventDefault();
      checkKeywordNfetch(textElement.value, targetText, fetch);
    });
  }

  //end tool event listener
  function checkKeywordNfetch(keyword, targetText, fetch) {
    if (myIngredient.getIngId(keyword) === undefined) {
      //let text = "";
      let suggestArr = myIngredient.getSuggestions(keyword);
      console.log(suggestArr);
      if (suggestArr.length === 0) {
        targetText.innerHTML = `The <font style="color:red">${keyword}</font> was not in the database please try something else`;
        return false;
      } else {
        targetText.innerText = "";
        const ul = document.createElement("ul");
        ul.setAttribute("class", "list-unstyled push-top");
        suggestArr.forEach((el) => {
          const li = document.createElement("li");
          li.setAttribute("data", el.Ingredient);
          li.innerHTML = `<button class="btn btn-sm btn-grey pt-05">${el.Ingredient}</button>`;
          ul.appendChild(li);
          li.addEventListener("click", () => {
            keyword = el.Ingredient;
            fetch(keyword);
          });
        });
        targetText.appendChild(ul);
        return false;
      }
    } else {
      fetch(keyword);
    }
  }

  function fetchSubstitute(keyword) {
    return fetch(
      baseURL +
        `food/ingredients/substitutes?apiKey=${apiKey}&ingredientName=${keyword}`
    )
      .then((resp) => resp.json())
      .then((data) => {
        inputSubstitute.value = keyword;
        if (data.status === "success") {
          let text = "";
          const subArr = data.substitutes.map((el) => `<li>${el}</li>`);
          text = subArr.join("");
          text =
            "Found " +
            data.substitutes.length +
            " substitute(s) for " +
            keyword +
            "<br><ul>" +
            text +
            "</ul>";
          substituteText.innerHTML = text;
        } else {
          substituteText.innerHTML = `<font style="color:red">Could not find any substitude for ${keyword}
              </font>`;
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }
  // return functions to use in global scope
})();
