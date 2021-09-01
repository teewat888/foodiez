//iffe - tools section
const fzTool = (() => {
  
  const inputConvert = document.getElementById("input-convert");
  const btnConvert = document.getElementById("btn-convert");
  const convertText = document.getElementById("convert-text");
  const fromConvert = document.getElementById("from-convert");
  const toConvert = document.getElementById("to-convert");
  //const inputAmount = document.querySelector("input[name='convertAmount']").value;
  const inputAmount = document.getElementById("input-amount");
  //tool event listener

  

  //inputTextEvent(inputConvert, convertText, fetchConvert, "name");
  //inputTextEvent(inputAmount, convertText, fetchConvert, "name");
  //buttonEvent(btnConvert, inputConvert, convertText, fetchConvert, "name");
  //buttonEvent(btnConvert, inputAmount, convertText, fetchConvert, "name");
    btnConvert.addEventListener('click', (e) => {
        e.preventDefault();
        console.log(inputAmount.value);
        console.log(inputConvert.value);
        if(inputAmount.value.length === 0) {
            console.log('require number');
        }
    })
  
})();
