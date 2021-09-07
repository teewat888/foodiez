"USE STRICT";
// module to due with all local servers functional
const localFn = (() => {
  const EMPTY_HEART = "♡";
  const FULL_HEART = "♥";

  const getUserName = (userId, user) => {
    return fetch(localURL + "users")
      .then((resp) => resp.json())
      .then((data) => {
        //console.log("data ", data);
        const iName = data.find((el) => el.id === userId);
        //console.log("iName ", iName);
        if (iName === -1) {
          return user.push("error");
        } else {
          return user.push(iName.userName);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const addComment = (id, element, comment, user) => {
    const confObj = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        recipeId: id,
        body: {
          text: comment,
          user: {
            id: user[0],
            userName: user[1],
          },
        },
      }),
    };
    fetch(localURL + "comments", confObj)
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        renderComments(id, element);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const renderComments = (id, element) => {
    let result = "";
    //search comments
    fetch(localURL + "comments")
      .then((resp) => resp.json())
      .then((data) => {
        const comments = data.filter((el) => el.recipeId === id);
        if (comments.length > 0) {
          comments.forEach((el) => {
            result += `<p><i class="sm-txt2 ">"${el.body.text}"</i><br/> <span class="sm-txt1"><b>by ${el.body.user.userName}</b></span></p>`;
          });

          element.innerHTML = result;
        } else {
          element.innerHTML = result;
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const generateUserId = () => {
    userId = Math.floor(Math.random() * 6) + 1;
    return userId;
  };

  const fetchAddFav = (fav) => {
    confObj = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(fav),
    };
    return fetch(localURL + "favorite", confObj).then((resp) => resp.json());
  };
  const fetchUserFav = (id, user) => {
    confObj = {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
      },
      body: '{ "users":' + JSON.stringify(user) + "}",
    };
    console.log(confObj);
    return fetch(localURL + `favorite/${id}`, confObj).then((resp) =>
      resp.json()
    );
  };

  const fullHeart = (element) => {
    element.innerHTML = FULL_HEART;
    element.setAttribute("class", "activated-heart");
  };

  const emptyHeart = (element) => {
    element.innerHTML = EMPTY_HEART;
    element.removeAttribute("class");
  };
  const checkFavorite = (element, id, userId, userName, act) => {
    fetch(localURL + "favorite")
      .then((resp) => resp.json())
      .then((data) => {
        const favoriteRecipe = data.find((el) => el.id === id);
        console.log("recipe id , user id ", favoriteRecipe, userId);
        if (favoriteRecipe !== undefined) {
          const userFavorite = favoriteRecipe.users.find(
            (el) => el.id === userId
          ); //check whether current user already fav?
          console.log("use fav id? ", userFavorite);
          if (userFavorite !== undefined) {
            //recipe fav existed and user already like this
            if (act === "render") {
              fullHeart(element);
            } else {
              const users = favoriteRecipe.users.filter(
                (el) => el.id !== userId
              );

              fetchUserFav(id, users)
                .then(() => emptyHeart(element))
                .catch((e) => {
                  console.log(e);
                });
            }
          } else {
            // user currently not fav
            if (act === "render") {
              emptyHeart(element);
            } else {
              const users = favoriteRecipe.users.filter(
                (el) => el.id !== userId
              );
              const user = {
                id: userId,
                userName: userName,
              };
              users.push(user);
              console.log("users ", users);
              fetchUserFav(id, users)
                .then(() => fullHeart(element))
                .catch((e) => {
                  console.log(e);
                });
            }
          }
        } else {
          if (act === "toggle") {
            //add entry to "favorite"
            const fav = {
              id: id,
              users: [
                {
                  id: userId,
                  userName: userName,
                },
              ],
            };
            fetchAddFav(fav)
              .then(() => fullHeart(element))
              .catch((e) => {
                console.log(e);
              });
          }
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return {
    renderComments: renderComments,
    addComment: addComment,
    getUserName: getUserName,
    generateUserId: generateUserId,
    checkFavorite: checkFavorite,
  };
})();
