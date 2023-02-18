
/******************Vanilla JS Code Starts from here*********************/
require('dotenv').config();
const API_KEY = process.env.API_KEY;

// Hamburger Icon's Functionality
document.querySelector(".hamburger_icon").addEventListener("click", () => {
    document.querySelector(".hamburger_icon").classList.toggle("nav_open");
    document.querySelector("nav").classList.toggle("nav_show");
})

//Variable declaration
const container = document.getElementById("container");
const pagenation = document.getElementById("pagenation-container");

const tickerTape = document.getElementsByClassName('ticker-wrap')[0];
const category = Array.from(
    document.querySelectorAll(".nav-list li >a")
);
let pagelength = 0;
function showNewsCards(articles, category) {
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    articles.forEach((newsItem) => {
        if (!newsItem.description) {
            newsItem.description = "";
        }
        if (!newsItem.title) {
            newsItem.title = "";
        }
        const published = newsItem.publishedAt;
        if (!published) {
            published = "";
        }
        let date = published.slice(8, 10);
        if (date === "01") {
            date = date + "st";
        } else if (date === "02") {
            date = date + "nd";
        } else if (date === "03") {
            date = date + "rd";
        } else {
            date = date + "th";
        }
        let months = Number.parseInt(published.slice(5, 7));
        monthNames.forEach((month, index) => {
            if (index + 1 == months) {
                months = month;
            }
        });
        let year = published.slice(0, 4);
        const articlesPublished = months + " " + date + " ," + year;
        tickerTape.innerHTML = ` <div class="ticker">
        <div class="ticker_item">${category} NEWS
       </div>`
        container.innerHTML += `  
        <figure class="snip1347">
    <img src="${newsItem.urlToImage}" alt = "image.png" />
    <div class="date">${articlesPublished}</div>
    <figcaption>
        <h2>${newsItem.title.slice(0, 90)} ${newsItem.title.length > 90 ? '...' : ""}</h2>
        <p>${newsItem.description.slice(0, 120)} ${newsItem.description.length > 120 ? '...' : ""}</p><a href="${newsItem.url
            }" target="blank" class="read-more">Read More</a>
    </figcaption>
</figure>
`;
    });
    const cards = Array.from(document.getElementsByClassName("snip1347"));
    cards.forEach((card) => {
        card.classList.add("animation");
    });

}

// Main function
function getNewsItems(categoryValue, apiKey) {
    pagenation.innerHTML = "";
    const request = fetch(
        `https:newsapi.org/v2/top-headlines?country=in&page=1&category=${categoryValue}&apiKey=${apiKey}`
    );
    request
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            // Spinner 
            container.innerHTML = ` 
    <div class = "loader">
    <span class="spinner">
    <span></span>
    <span></span>
    <span></span>
    <span></span>
</span>
</div>
    `
            const articles = data.articles;
            console.log(data);
            tickerTape.innerHTML = "";
            container.innerHTML = "";



            // Showing only 6 articles at the time when page is laoding
            showNewsCards(articles.slice(0, 6), categoryValue);
            pagelength = Math.ceil(articles.length / 6);
            pagenation.innerHTML = "";
            for (let i = 0; i < pagelength; i++) {
                pagenation.innerHTML += `<a href="#" class="w3-button">${i + 1}</a>`;
            }
            const pages = Array.from(document.getElementsByClassName("w3-button"));
            pages[0].classList.add("active");
            pages.forEach((page, index) => {
                page.addEventListener("click", (e) => {
                    pages.forEach((page, index) => {
                        if (e.target.innerText == index + 1) {
                            page.classList.add("active");
                        } else {
                            page.classList.remove("active");
                        }
                    });
                    container.innerHTML = "";
                    const count = e.target.innerText;
                    const end = count * 6;
                    const start = end - 6;
                    const arr1 = articles.slice(start, end);
                    showNewsCards(arr1, categoryValue);
                });
            });
        });
}

// Cateories functionality
category.forEach((item) => {
    item.addEventListener("click", (e) => {
        let category = e.target.innerText.toLowerCase();
        if (category === 'top trending') {
            category = 'general';
        }
        container.innerHTML = "";
        getNewsItems(category, API_KEY);
    });
});


// Calling this function on global scope so that while loading the page function works
getNewsItems("general", API_KEY);

