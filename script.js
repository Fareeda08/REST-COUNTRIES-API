const desktopMode = document.querySelector(".desktop-mode");
const body = document.querySelector("body");

const dropdownContainer = document.querySelector(".dropdown-container");
const overlay = document.querySelector(".overlay");
const dropdown = document.querySelector(".dropdown");

const countriesDataField = document.querySelector(".countries-data-field ul");

const countrySearchField = document.querySelector(
  ".country-search-container form",
);
const countrySearch = document.querySelector("#country-search");
const main = document.querySelector("main");

desktopMode.addEventListener("click", () => {
  const modeIcon = desktopMode.querySelector("i");
  const mode = document.querySelector("p");

  if (body.classList[0] === "light-mode") {
    body.classList.remove("light-mode");
    body.classList.add("dark-mode");

    modeIcon.classList.remove("fa-moon");
    modeIcon.classList.add("fa-sun");

    mode.textContent = "Light mode";
  } else {
    body.classList.add("light-mode");
    body.classList.remove("dark-mode");

    modeIcon.classList.add("fa-moon");
    modeIcon.classList.remove("fa-sun");

    mode.textContent = "Dark mode";
  }
});

countrySearchField.addEventListener("submit", function (ev) {
  ev.preventDefault();
  const country = countrySearch.value.toLowerCase().trim();

  if (countrySearch.value === "") alert("Please enter a valid input");

  if (countrySearch.value !== "") {
    renderSearchCountries(country);
    countrySearch.style.backgroundImage = 'none'
  }
});

const renderSearchCountries = async function (entry) {
  try {
    const data = await fetchCountryData();

    let markup = data
      .filter((data) => data.name.toLowerCase().includes(entry))
      .map((country) => generateHomePage(country))
      .join("");

    markup =
      markup !== "" ? markup : `<p>${entry} not found. Please try again</p>`;

    renderMarkup(markup, countriesDataField);
  } catch (err) {
    console.log(err);
  }
};

main.addEventListener("click", function (ev) {
  const back = ev.target.closest(".back");

  if (back) returnToHomePage();

  const countryNameElement = ev.target.closest(".country-name");

  if (countryNameElement) {
    const countryName = countryNameElement.textContent;
    renderCountry(countryName);
  }

  const borderCountry = ev.target.closest(".country-border-countries li");
  if (borderCountry) {
    console.log(borderCountry);
    renderCountry(borderCountry.textContent);
  }

  const dropdownContainer = ev.target.closest(".dropdown-container");

  if (dropdownContainer) {
    const dropdown = dropdownContainer.querySelector(".dropdown");
    const overlay = dropdownContainer.querySelector(".overlay");

    dropdown.classList.toggle("hidden");
    overlay.classList.toggle("hidden");

    const li = ev.target.closest("li");
    if (li) {
      dropdownContainer
        .querySelectorAll("li")
        .forEach((li) => li.classList.remove("selected"));
      li.classList.add("selected");
      const region = li.textContent;

      const countriesDataField = main.querySelector(".countries-data-field ul"); //re-rendered
      renderRegionCountries(region, countriesDataField);
    }
  }
});

const fetchCountryData = async function () {
  try {
    const res = await fetch("./data.json");
    const data = await res.json();

    return data;
  } catch (err) {
    console.log(err);
  }
};

const generateHomePage = function (country) {
  const markup = `        
    <li>
             <img src="${country.flags.svg}" alt="" />

                <div>
                  <p class="country-name">${country.name}</p>
                  <p class="country-population">
                    <span class="title">Population: </span>${country.population.toLocaleString("en")}
                  </p>
                  <p class="country-region">
                    <span class="title">Region: </span>${country.region}
                  </p>
                  <p class="country-capital">
                    <span class="title">Capital:</span> ${country.capital}
                  </p>
                </div>
              </li>`;

  return markup;
};

const returnToHomePage = async function () {
  try {
    const data = await fetchCountryData();

    const markup = ` 
      <section class="countries-data-field">
      <ul> ${data.map((country) => generateHomePage(country, false)).join("")}</ul></section>
        `;

    renderMarkup(markup, main);
    renderSearchField();
  } catch (err) {
    console.log(err);
  }
};

const renderSearchField = function () {
  const markup = `<section class="country-search-container">
        <form>
          <input
            name="country"
            id="country-search"
            type="text"
            placeholder="Search for a country..."
          />
        </form>

        <div class="dropdown-container">
          <span>
            <p>Filter by region</p>
            <i class="fa-solid fa-angle-down"></i>
          </span>

          <div class="overlay hidden"></div>

          <ul class="dropdown regions hidden">
            <li>Africa</li>
            <li>Americas</li>
            <li>Asia</li>
            <li>Europe</li>
            <li>Oceania</li>
          </ul>
        </div>
      </section>`;
  main.insertAdjacentHTML("afterbegin", markup);
};

const renderMarkup = function (markup, parentEl) {
  parentEl.innerHTML = "";
  parentEl.insertAdjacentHTML("beforeend", markup);
};

const renderCountry = async function (country) {
  try {
    const datas = await fetchCountryData();

    datas.find((data) => {
      if (data.name === country) {
        const markup = `
        <section class="details">
          <div class="back">
           <i class="fa-solid fa-arrow-left"></i>
           <p>Back</p>
         </div>

        <section class="country-details">
          <img class="country-flag" src="${data.flag}" alt="" />

         <div class="country-info">
         <p class="country-name">${data.name}</p>

       <ul>
         <li class="country-native-name">
           <span class="title">Native name: </span>${data.nativeName}
         </li>
         <li class="country-population">
           <span class="title">Population: </span>${data.population.toLocaleString("en")}
         </li>
         <li class="country-region">
           <span class="title">Region: </span>${data.region}
         </li>
         <li class="country-sub-region">
           <span class="title">Sub Region: </span>${data.subregion}
         </li>
         <li class="country-capital">
           <span class="title">Capital:</span> ${data.capital ? data.capital : "None"}
         </li>
         <li class="country-domain">
           <span class="title">Top Level Domain: </span>${data.topLevelDomain[0]}
         </li>
         <li class="country-currencies">
           <span class="title">Currencies: </span>${data.currencies[0].name}
         </li>
         <li class="country-languages">
           <span class="title">Languages: </span>${data.languages[0].name}
         </li>

         <li class="country-border-countries">
           <p>
             <span class="title">Border countries: </span>
           </p>
           <ul>            
             ${
               data.borders
                 ? data.borders
                     .map((border) => {
                       return `<li>${datas.find((data) => data.alpha2Code === border || data.alpha3Code === border).name}</li>`;
                     })
                     .join("")
                 : "None"
             }
           </ul>
         </li>
       </ul>
     </div>
   </section>
 </section>
`;

        renderMarkup(markup, main);
        return;
      } else {
      }
    });

    renderMarkup(markup, countriesDataField);
  } catch (err) {
    console.log(err);
  }
};

const renderRegionCountries = async function (region, parentEl) {
  try {
    const data = await fetchCountryData();

    const countriesData = data.filter((country) => country.region === region);

    const markup = `${countriesData.map((countryData) => generateHomePage(countryData)).join("")}`;

    renderMarkup(markup, parentEl);
  } catch (err) {
    console.log(err);
  }
};

const renderCountryMarkup = async function () {
  try {
    const data = await fetchCountryData();

    const markup = data.map((country) => generateHomePage(country)).join("");

    renderMarkup(markup, countriesDataField);
  } catch (err) {
    console.log(err);
  }
};

renderCountryMarkup();
