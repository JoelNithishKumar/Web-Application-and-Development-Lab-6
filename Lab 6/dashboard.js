const locationSelect = document.getElementById("locationSelect");
const useCurrentLocationBtn = document.getElementById("useCurrentLocation");
const dashboardToday = document.getElementById("dashboardToday");
const dashboardTomorrow = document.getElementById("dashboardTomorrow");

const locations = {
    "New York": { lat: 40.7128, lng: -74.0060 },
    "London": { lat: 51.5074, lng: -0.1278 },
    "Tokyo": { lat: 35.6895, lng: 139.6917 },
    "Sydney": { lat: -33.8688, lng: 151.2093 },
    "Paris": { lat: 48.8566, lng: 2.3522 },
    "Cairo": { lat: 30.0444, lng: 31.2357 },
    "Toronto": { lat: 43.651070, lng: -79.347015 },
    "Rio de Janeiro": { lat: -22.9068, lng: -43.1729 },
    "Dubai": { lat: 25.276987, lng: 55.296249 },
    "Cape Town": { lat: -33.9249, lng: 18.4241 }
};

Object.keys(locations).forEach(location => {
    const option = document.createElement("option");
    option.value = location;
    option.textContent = location;
    locationSelect.appendChild(option);
});

locationSelect.addEventListener("change", () => {
    const coords = locations[locationSelect.value];
    fetchSunData(coords.lat, coords.lng);
});

useCurrentLocationBtn.addEventListener("click", () => {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            fetchSunData(latitude, longitude);
        }, () => {
            alert("Unable to retrieve your location.");
        });
    } else {
        alert("Geolocation not supported.");
    }
});

async function fetchSunData(lat, lng) {
    try {
        const todayURL = `https://api.sunrisesunset.io/json?lat=${lat}&lng=${lng}&date=today`;
        const tomorrowURL = `https://api.sunrisesunset.io/json?lat=${lat}&lng=${lng}&date=tomorrow`;

        const [todayRes, tomorrowRes] = await Promise.all([
            fetch(todayURL),
            fetch(tomorrowURL)
        ]);

        const todayData = await todayRes.json();
        const tomorrowData = await tomorrowRes.json();

        displayDashboard(todayData.results, dashboardToday, "Today");
        displayDashboard(tomorrowData.results, dashboardTomorrow, "Tomorrow");
    } catch (error) {
        alert("Error fetching data. Please try again later.");
    }
}

function displayDashboard(data, container, label) {
    container.innerHTML = `<h2>${label}</h2>`;
    const fields = [
        { className: 'sunrise', content: `🌅 Sunrise: ${data.sunrise}` },
        { className: 'sunset', content: `🌇 Sunset: ${data.sunset}` },
        { className: 'dawn', content: `🌤️ Dawn: ${data.dawn}` },
        { className: 'dusk', content: `🌙 Dusk: ${data.dusk}` },
        { className: 'daylength', content: `🕒 Day Length: ${data.day_length}` },
        { className: 'solarnoon', content: `🌞 Solar Noon: ${data.solar_noon}` },
        { className: 'timezone', content: `🕰️ Timezone: ${data.timezone}` }
    ];

    fields.forEach(field => {
        const div = document.createElement("div");
        div.className = `data-box ${field.className}`;
        div.innerHTML = field.content;
        container.appendChild(div);
    });
}
