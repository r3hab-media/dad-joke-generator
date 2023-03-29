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

async function shareJoke() {
	const joke = badJoke.innerText;
	// const msg = `\n\nYou can find more of these at <a href="dailydadjokes.com">dailydadjokes.com</a>`;
	// const url = window.location.href;

	if (navigator.share) {
		try {
			await navigator.share({
				title: "Daily Dad Joke",
				text: joke,
				// text: msg,
			});
			console.log("Joke shared successfully");
		} catch (error) {
			console.error("Error sharing joke:", error);
		}
	} else {
		console.log("Web Share API not supported");
		// You can add a fallback sharing method here, e.g. copying the unique URL to the clipboard
	}
}

shareJokeButton.addEventListener("click", shareJoke);

document.addEventListener("DOMContentLoaded", () => {
	displayJokeFromUrl();
});

newJoke.addEventListener("click", function () {
	getDailyDadJoke();
});
