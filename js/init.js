const baseURL = "https://api.spoonacular.com/";
const localURL = "http://localhost:3000/";
const loadingText = '<div class="d-flex justify-content-center"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></div>';
const errorText = '<span style="color:red"><b>Error! please try again later...</b></span>';

const filter = (function() {
const filterSwitch = {
        switch: {
          all: [true, "danger", "allBg", "All", "All"],
          vegetarian: [
            false,
            "primary",
            "vegetarianBg",
            "vegetarian",
            "vegetarian",
          ],
          vegan: [false, "success", "veganBg", "vegan", "vegan"],
          glutenFree: [false, "info", "glutenBg", "gluten free", "gluten"],
          dairyFree: [false, "warning", "dairyBg", "dairy free", "dairy"],
        },
        pressAll() {
          this.switch.all[0] = true;
          this.switch.vegetarian[0] = false;
          this.switch.vegan[0] = false;
          this.switch.glutenFree[0] = false;
          this.switch.dairyFree[0] = false;
          //this.switch.lowFodMap[0] = false;
        },
        pressMe(theFilter) {
          this.switch.all[0] = false;
          this.switch[theFilter][0] = !this.switch[theFilter][0];
          if (theFilter === "vegetarian" && this.switch["vegan"][0] === true) {
            this.switch["vegan"][0] = !this.switch[theFilter][0];
          } else if (theFilter === "vegan" && this.switch["vegetarian"][0] === true) {
            this.switch["vegetarian"][0] = !this.switch[theFilter][0];
          }
        },
        renderBadge() {
          let result = "";
  
          const properties = Object.keys(this.switch);
          for (const property of properties) {
            if (this.switch[property][0] === true) {
              result += `<span id="${this.switch[property][2]}" class="badge bg-${this.switch[property][1]}">${this.switch[property][3]}</span>`;
            } else {
              result += `<span id="${this.switch[property][2]}" class="badge bg-light text-grey">${this.switch[property][3]}</span>`;
            }
          }
          return result;
        },
      };
      return {
          filterSwitch
      }

    

    })();
