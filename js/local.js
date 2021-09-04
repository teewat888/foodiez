// module to due with all local servers functional

const localFn = (() => {
  const getUserName = (userId) => {
    return fetch(localURL + "users")
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
  const addComment = (dataIn, element, comment, user) => {
    const confObj = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "accept": "application/json"
      },
      body: JSON.stringify({
        recipeId: dataIn.id,
        body: {
          text: comment,
          user: {
            id: user[0],
            userName: user[1]
          }
        }
      })
    }
    fetch(localURL + 'comments',confObj)
    .then(resp => resp.json())
    .then((data) => {
      console.log(data);
      renderComments(dataIn, element);
    }).catch((e) => {
      console.log(e);
    });


  }
  const renderComments = (dataIn, element) => {
    let result = "";
    //search comments
    fetch(localURL + "comments")
      .then((resp) => resp.json())
      .then((data) => {
        const comments = data.filter(el => el.recipeId === dataIn.id);
        if (comments.length > 0) {
          comments.forEach(el => {
            result += `<p><i class="sm-txt2 ">"${el.body.text}"</i><br/> <span class="sm-txt1"><b>by ${el.body.user.userName}</b></span></p>`;
          })
          
          element.innerHTML = result;
        } else {
          
          element.innerHTML = result;
        }
      }).catch((e) => {
        console.log(e);
      });
      
   
  };

  const generateUserId = () => {
    userId = Math.floor(Math.random() * 6) + 1;
    return userId;
  }

  const writeComment = (recipeId, comment) => {};

  const isFavourite = () => {};

  const setFavourite = () => {};

  const unsetFavourite = () => {};

  return {
    renderComments: renderComments,
    addComment: addComment,
    getUserName: getUserName,
    generateUserId: generateUserId
  };
})();
