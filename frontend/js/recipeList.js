// Runs after DOM is ready (or use <script defer>)
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".main-container-recipe");
  if (!container) {
    console.error("Container .main-container-recipe not found");
    return;
  }

  fetch("https://smoocha-recipe-krtech.onrender.com/api/recipesCard") // <-- Backend API route
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((raw) => {
      const recipes = Array.isArray(raw) ? raw : [];
      const frag = document.createDocumentFragment();
      recipes.forEach((r) => {
        const id = r._id || r.id || "";
        const title = r.title || "Untitled";
        const img = r.imageUrl || r.image || "";
        const cookTime = r.cookTime || r.cookingTime || "-";
        const difficulty = r.difficulty || "-";
        const budget = r.budget || "-";
        const rating =
          r.rating || typeof r.avgRating !== "undefined" ? r.avgRating : "-";
        const card = document.createElement("div");
        card.className = "recipe1";
        card.innerHTML = `
          <div class="in1">
            <img src="${img}" alt="${title}">
            <li><a href="newpage.html?id=${id}">${title}</a></li>
          </div>
          <div class="ou2">
            <ul>
              <li>Cooking Time: ${cookTime}</li>
              <li>${difficulty}</li>
            </ul>
            <ul>
              <li>Budget: ${budget}</li>
              <li>Rating: ${rating}</li>
            </ul>
          </div>
        `;
        frag.appendChild(card);
      });

      // clear and append
      container.innerHTML = "";
      container.appendChild(frag);
    })
    .catch((err) => {
      console.error("Error fetching recipesCard:", err);
      container.insertAdjacentHTML(
        "afterbegin",
        `<p style="color:#b00">Could not load recipes. Check Console.</p>`
      );
    });
});
