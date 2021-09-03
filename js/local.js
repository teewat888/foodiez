// module to due with all local servers functional

const localFn = (() => {
  
  const recipeComments = document.getElementById('recipe-comments');
 

  
  const getUserName = (userId) => {
  return fetch(localURL+"users")
      .then((resp) => resp.json())
      .then((data) => {
        //console.log("data ", data);
        const iName = data.find((el) => el.id === userId);
        //console.log("iName ", iName);
        if (iName === -1) {
          return "error";
        } else {
          return iName.userName;
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };


    
    //let a = getUserName;
  //let b = getUserName(1).then(a => console.log(a));
  
    

  
  const renderComments = (data) => {

  };

  const writeComment = (recipeId, comment) => {};

  const isFavourite = () => {};

  const setFavourite = () => {};

  const unsetFavourite = () => {};

  return {
    
    
  };
})();
