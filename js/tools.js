//iffe - tools section
const fzTool = (() => {
  const inputSubstitute = document.getElementById("input-substitute");
  const btnSubstitute = document.getElementById("btn-substitute");
  const substituteText = document.getElementById("substitute-text");
  const inputNutrition = document.getElementById("input-nutrition");
  const nutritionText = document.getElementById("nutrition-text");
  const btnNutrition = document.getElementById("btn-nutrition");
  const inputConvert = document.getElementById("input-convert");
  const btnConvert = document.getElementById("btn-convert");
  const convertText = document.getElementById("convert-text");
  const fromConvert = document.getElementById("from-convert");
  const toConvert = document.getElementById("to-convert");
  const inputAmount = document.getElementById("input-amount");
  const divGI = document.getElementById("divGI");
  const btnAddGi = document.querySelector("button[name='addIng']");
  const maxGiElements = 6; // the maximum number of dynamic ingredients to put for gi calculator
  const giText = document.getElementById("gi-text");

  //tool event listener

  btnAddGi.addEventListener("click", addInputGi);

  inputTextEvent(inputSubstitute, substituteText, fetchSubstitute, "name");
  buttonEvent(
    btnSubstitute,
    inputSubstitute,
    substituteText,
    fetchSubstitute,
    "name"
  );

  inputTextEvent(inputNutrition, nutritionText, fetchNutrition, "id");
  buttonEvent(
    btnNutrition,
    inputNutrition,
    nutritionText,
    fetchNutrition,
    "id"
  );

  // convert amount require only button input
  buttonEvent(btnConvert, inputConvert, convertText, fetchConvert, "name");

  function inputTextEvent(element, targetText, fetch, ftype) {
    element.addEventListener("keyup", (e) => {
      e.preventDefault();
      if (e.key === "Enter") {
        checkKeywordNfetch(element, targetText, fetch, ftype);
      }
    });
  }

  function buttonEvent(element, textElement, targetText, fetch, ftype) {
    element.addEventListener("click", (e) => {
      e.preventDefault();
      checkKeywordNfetch(textElement, targetText, fetch, ftype);
    });
  }

  function displayText(element, dText) {
    element.innerHTML = dText;
  }
  function removeText(element) {
    element.innerHTML = '';
  }

  //end tool event listener
  function addInputGi() {
    const newInput = document.createElement("input");
    const removeBtn = document.createElement("button");
    newInput.setAttribute("type", "text");
    newInput.setAttribute("class", "input4GI");
    newInput.setAttribute("value", "");
    removeBtn.setAttribute("class", "btn btn-sm btn-danger btn4GI");
    removeBtn.setAttribute("name", "removeBtn");
    removeBtn.innerText = "-";
    if (isMaxLimit(document.querySelectorAll('input[class="input4GI"]').length)) {
      displayText(giText,'<span style=\'color:red\'>You have reached maximum number of input!</span>');
    } else {
      removeText(giText);
      divGI.appendChild(newInput);
      divGI.appendChild(removeBtn);
      removeBtn.addEventListener("click", () => {
        removeInputGi(newInput, removeBtn);
      });
    }
  }

  function removeInputGi(newInput, removeBtn) {
    removeText(giText);
    newInput.remove();
    removeBtn.remove();
  }

  function isMaxLimit(inputLength) {
    if (inputLength < maxGiElements) {
      return false;
    } else {
      return true;
    }
  }

  function checkKeywordNfetch(keyword, targetText, fetch, ftype) {
    //hack this to check the amount//
    //console.log('from select value: ',fromConvert.value);
    //console.log('to select value: ',toConvert.value);

    if (targetText.id === "convert-text") {
      if (inputAmount.value.length === 0 || isNaN(inputAmount.value)) {
        inputAmount.focus();
        displayText(targetText,'<span style=\'color:red\'>Please input amount in NUMBER eg, 2 </span>');
        //targetText.innerHTML =
         // "<span style='color:red'>Please input amount in NUMBER eg, 2 </span>";
        return false;
      }
    }
    suggestWords(keyword, targetText, fetch, ftype);
  }
  function suggestWords(keyword, targetText, fetch, ftype) {
    if (keyword.value.length > 0) {
      if (myIngredient.getIngId(keyword.value) === undefined) {
        //let text = "";
        let suggestArr = myIngredient.getSuggestions(keyword.value);
        console.log(suggestArr);
        if (suggestArr.length === 0) {
          displayText(targetText,`The <font style="color:red">${keyword.value}</font> was not in the database please try something else`);
          //targetText.innerHTML = `The <font style="color:red">${keyword.value}</font> was not in the database please try something else`;
          return false;
        } else {
          removeText(targetText);
          //targetText.innerText = "";
          const ul = document.createElement("ul");
          ul.setAttribute("class", "list-unstyled push-top");
          suggestArr.forEach((el) => {
            const li = document.createElement("li");
            li.setAttribute("data", el.Ingredient);
            li.innerHTML = `<button class="btn btn-sm btn-grey pt-05">${el.Ingredient}</button>`;
            ul.appendChild(li);
            li.addEventListener("click", () => {
              keyword.value = el.Ingredient;
              console.log(el.id);
              if (ftype === "name") {
                fetch(keyword.value);
              } else if (ftype === "id") {
                fetch(el.id);
              }
            });
          });
          targetText.appendChild(ul);
          return false;
        }
      } else {
        if (ftype === "name") {
          fetch(keyword.value);
        } else if (ftype === "id") {
          fetch(myIngredient.getIngId(keyword.value));
        }
      }
    } else {
      keyword.focus();
      displayText(targetText,'<span style=\'color:red\'>Please input something :)</span>');
      //targetText.innerHTML =
        //"<span style='color:red'>Please input something :)</span>";
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
            '<br><ul class="sm-txt2" >' +
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

  function fetchNutrition(id) {
    return fetch(
      baseURL +
        `food/ingredients/${id}/information?apiKey=${apiKey}&amount=100&unit=grams`
    )
      .then((resp) => resp.json())
      .then((data) => {
        nutritionText.value = data.originalName;

        let text = "";
        const subArr = data.nutrition.nutrients.map(
          (el) =>
            `<div class="col-6">${el.name}</div><div class="col-6">${el.amount}${el.unit}</div>`
        );
        text = subArr.join("");
        text = '<div class="row row-col-2 sm-txt1" >' + text + "</div>";
        nutritionText.innerHTML = text;
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function fetchConvert(keyword) {
    return fetch(
      baseURL +
        `recipes/convert?ingredientName=${keyword}&sourceAmount=${inputAmount.value}&sourceUnit=${fromConvert.value}&targetUnit=${toConvert.value}&apiKey=${apiKey}`
    )
      .then((resp) => resp.json())
      .then((data) => {
        console.log(
          baseURL +
            `recipes/convert?ingredientName=${keyword}&sourceAmount=${inputAmount.value}&sourceUnit=${fromConvert.value}&targetUnit=${toConvert.value}&apiKey=${apiKey}`
        );

        if (data.status === undefined) {
          convertText.innerHTML = data.answer;
        } else {
          convertText.innerHTML = `<font style="color:red">sorry, no conversion available! please try something else
              </font>`;
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }
})();
