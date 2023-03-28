const displayedJokes = new Set();

async function getDailyDadJoke() {
	const url = "https://icanhazdadjoke.com/";
	const headers = new Headers();
	headers.append("Accept", "application/json");

	try {
		const response = await fetch(url, { headers });
		if (response.ok) {
			const jokeData = await response.json();
			const joke = jokeData.joke;

			if (displayedJokes.size >= 1000) {
				displayedJokes.clear(); // Clear the Set after 1000 jokes have been displayed
			}

			if (!displayedJokes.has(joke)) {
				displayedJokes.add(joke);
				console.log(joke);
				badJoke.innerText = joke;

				// Encode the joke and append it as a URL parameter
				const encodedJoke = encodeURIComponent(joke).replace(/%20/g, "-").replace(/%3F/g, "-").replace(/%2C/g, "-");
				const uniqueUrl = `/daily-joke?joke=${encodedJoke}`;
				console.log(uniqueUrl);

				// Update the address bar with the unique URL
				history.pushState(null, "", uniqueUrl);
			} else {
				// If the joke has already been displayed, fetch another one
				getDailyDadJoke();
			}
		} else {
			console.log("Oops! Could not fetch a dad joke right now.");
		}
	} catch (error) {
		console.error("Error fetching dad joke:", error);
	}
}

function displayJokeFromUrl() {
	const jokeDisplay = document.getElementById("jokeDisplay");
	const urlParams = new URLSearchParams(window.location.search);
	const jokeParam = urlParams.get("joke");

	if (jokeParam) {
		const decodedJoke = decodeURIComponent(jokeParam.replace(/-/g, "%20").replace(/_/g, "%3F"));
		jokeDisplay.textContent = decodedJoke;
	}
}

// Usage
getDailyDadJoke();

document.addEventListener("DOMContentLoaded", () => {
	displayJokeFromUrl();
});

newJoke.addEventListener("click", function () {
	getDailyDadJoke();
});
