//iffe - tools section
const fzTool = (() => {
    const inputSubstitute = document.getElementById("input-substitute");
    const btnSubstitute = document.getElementById("btnSubstitute");
    const substituteText = document.getElementById("substituteText");
    const maxInputGI = 10; //maximum number of input that gi tool can add

    //tool event listener

    btnSubstitute.addEventListener("click", (e) => {
        e.preventDefault();
        fetchSubstitute(inputSubstitute.value)
          .then((data) => {
            console.log(data);
            if (data.status === "success") {
              let text = "";
              const subArr = data.substitutes.map((el) => `<li>${el}</li>`);
              console.log(subArr);
              text = subArr.join("");
              console.log(text);
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
      });
  
      //end tool event listener

      function fetchSubstitute(keyword) {
        return fetch(
          baseURL +
            `food/ingredients/substitutes?apiKey=${apiKey}&ingredientName=${keyword}`
        ).then((resp) => resp.json());
      }
      // return functions to use in global scope


})();