
const loadCategory = () => {
  fetch("https://openapi.programming-hero.com/api/categories")
    .then((res) => res.json())
    .then((data) => displayLoadCategory(data.categories))
    .catch((error) => console.log(error));
};

const displayLoadCategory = (categories) => {
  const categoriesContainer = document.getElementById("categories-container");
  categoriesContainer.innerHTML = "";

  categories.forEach((categorie) => {
    const { id, category_name } = categorie;

    const newDiv = document.createElement("div");
    newDiv.innerHTML = `
      <button id="${id}" class="btn hover:bg-green-600 w-full hover:text-white">${category_name}</button>
    `;
    categoriesContainer.appendChild(newDiv);

    categoriesContainer.addEventListener("click", (e) => {
      const allBtn = document.querySelectorAll("button");
      allBtn.forEach((btn) => {
        btn.classList.remove("bg-green-600");
        btn.classList.remove("text-white");
      });

      if (e.target.localName === "button") {
        e.target.classList.add("bg-green-600");
        e.target.classList.add("text-white");
        loadCardByCategory(e.target.id);
      }
    });
  });
};

const loadCardByCategory = (id) => {
  fetch(`https://openapi.programming-hero.com/api/category/${id}`)
    .then((res) => res.json())
    .then((data) => displayCardByCategory(data.plants))
    .catch((error) => console.log(error));
};

const displayCardByCategory = (plants) => {
  const plantsContainer = document.getElementById("plants-container");
  plantsContainer.innerHTML = "";

  plants.forEach((plant) => {
    const { id, name, image, description, category, price } = plant;
    const div = document.createElement("div");
    div.innerHTML = `
      <div class="card bg-white shadow-sm p-3 h-full">
        <figure>
          <img class="w-full h-[140px] object-cover"
            src="${image}"
            alt=""
          />
        </figure>
        <div class="space-y-2 p-2 mt-auto ">
          <h2 class="card-title font-semibold">${name}</h2>
          <p class="text-gray-500 text-xs">${description}</p>
          <div class="card-actions justify-between">
            <div class="badge badge-outline rounded-3xl text-green-600 bg-green-100 p-2">${category}</div>
            <div class="badge text-lg font-semibold">$${price}</div>
          </div>
          <button id="addToCart" class="btn bg-green-600 text-white w-full p-2 rounded-3xl mt-1">Add to Cart</button>
        </div>
      </div>
    `;
    plantsContainer.appendChild(div);
  });
};

document.getElementById("plants-container").addEventListener("click", (e) => {
  if (e.target.id === "addToCart") {
    const card = e.target.closest(".card");
    const name = card.querySelector(".card-title").innerText;
    const price = card.querySelector(".badge.text-lg").innerText;
    const convertedPrice = parseFloat(price.replace("$", ""));

    // add-money
    const totalPrice = parseFloat(
      document.getElementById("total-price").innerText.trim()
    );
    const currentTotal = convertedPrice + totalPrice;
    document.getElementById("total-price").innerText = currentTotal;

    const addToCartContainer = document.getElementById("addToCart-container");
    const newDiv = document.createElement("div");
    newDiv.innerHTML = `
      <div class="card-item flex justify-between items-center bg-[#F0FDF4] p-3 rounded-lg mb-3">
        <div>
          <h3 class="font-semibold">${name}</h3>
          <span class="font-semibold">$${convertedPrice}</span>
        </div>
        <div>
          <i class="fa-solid fa-trash cursor-pointer hover:text-red-500"></i>
        </div>
      </div>
    `;
    addToCartContainer.appendChild(newDiv);

    newDiv.querySelector(".fa-trash").addEventListener("click", () => {
      const itemPrice = parseFloat(
        newDiv.querySelector("span").innerText.replace("$", "")
      );
      document.getElementById("total-price").innerText =
        parseFloat(document.getElementById("total-price").innerText) -
        itemPrice;
      newDiv.remove();
    });
  }
});

loadCategory();
