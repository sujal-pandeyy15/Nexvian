
function searchLearning() {
    const searchInput = document.getElementById("heroSearch");
    const resultText = document.getElementById("searchResults");
    const query = searchInput.value.trim().toLowerCase();

    if (!query) {
        resultText.innerText = "Please enter something to learn!";
        return;
    }

    const normalize = text =>
        text.toLowerCase().replace(/[^a-z0-9]/g, "");

    const searchQuery = normalize(query);

    const cards = document.querySelectorAll(
        ".category-card, .course-card, .resource-card, .quiz-card"
    );

    let matches = [...cards].filter(card => {
        const title = card.querySelector("h3")?.innerText || "";
        return normalize(title).includes(searchQuery);
    });

    if (matches.length === 0) {
        matches = [...cards].filter(card =>
            normalize(card.innerText).includes(searchQuery)
        );
    }

   cards.forEach(card => card.classList.remove("search-match"));


    
  

if (matches.length > 0) {
        matches.forEach(card => card.classList.add("search-match"));
// Remove highlight after 5 seconds
setTimeout(() => {
    matches.forEach(card => {
        card.classList.remove("search-match");
    });
}, 5000);
        resultText.innerText =
            matches.length + (matches.length === 1
                ? " Result Found"
                : " Results Found");

        matches[0].scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    } else {
        resultText.innerText = "No Results Found!";
    }

    // Automatically clear search input
    searchInput.value = "";
}


// Search when Enter is pressed
document.getElementById("heroSearch").addEventListener(
    "keydown",
    function(event) {
        if (event.key === "Enter") {
            searchLearning();
        }
    }
);

function checkAlgebra() {

    const answers = {
        q1: "8",
        q2: "a2+2ab+b2",
        q3: "(a+b)(a-b)",
        q4: "7",
        q5: "a2-2ab+b2"
    };

    let score = 0;

    for (let question in answers) {

        const selected = document.querySelector(
            'input[name="' + question + '"]:checked'
        );

        if (selected && selected.value === answers[question]) {
            score++;
        }
    }

    document.getElementById("quizResult").innerText =
        "Your Score: " + score + " / 5";
}
