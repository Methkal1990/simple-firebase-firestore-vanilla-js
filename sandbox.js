const db = firebase.firestore();
const list = document.querySelector("ul");
const form = document.querySelector("form");

const addRecipes = ({ title, create_at }, id) => {
  const time = create_at.toDate();
  let html = `
    <li data-id="${id}">
    <div>${title}</div>
    <div>${time}</div>
    <button class="btn btn-danger btn-sm my-2">Delete</button>
    </li>
    `;
  list.innerHTML += html;
};

const removeRecipe = id => {
  const recipes = document.querySelectorAll("li");
  recipes.forEach(recipe => {
    if (recipe.getAttribute("data-id") === id) {
      recipe.remove();
    }
  });
};

// db.collection("recipes")
//   .get()
//   .then(snapshot => {
//     snapshot.docs.forEach(doc => {
//       // console.log(doc.data(), doc.id);
//       addRecipes(doc.data(), doc.id);
//     });
//   })
//   .catch(err => console.log(err));

// add data to firestore on submit
form.addEventListener("submit", e => {
  e.preventDefault();
  const now = new Date();
  const recipe = {
    title: form.recipe.value,
    create_at: firebase.firestore.Timestamp.fromDate(now),
  };

  db.collection("recipes")
    .add(recipe)
    .then(() => {
      console.log("recipe added");
    })
    .catch(err => console.log(err));
});

// delete data
list.addEventListener("click", e => {
  if (e.target.tagName === "BUTTON") {
    const id = e.target.parentElement.getAttribute("data-id");
    db.collection("recipes")
      .doc(id)
      .delete()
      .then(() => console.log("deleted"))
      .catch(err => console.log(err));
  }
});

// listen for changes in databases in real time action
db.collection("recipes").onSnapshot(snapshot => {
  snapshot.docChanges().forEach(change => {
    const doc = change.doc;
    if (change.type === "added") {
      addRecipes(doc.data(), doc.id);
    } else if (change.type === "removed") {
      removeRecipe(doc.id);
    }
  });
});
