const express = require("express");
const fs = require("fs");
const jsdom = require("jsdom");

const { JSDOM } = jsdom;
const app = express();
const PORT = process.env.PORT || 3000;

// Google Maps API key
const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY";

// Hardcoded user location
const USER_LOCATION = { lat: 43.6397, lon: -79.4104 }; // 80 Western Battery Road, Toronto

// Middleware
app.use(express.static(__dirname + "/public/"));

// Endpoint to get veterinary clinic data
app.post("/api/clinics", async (req, res) => {
    try {
        // Scrape clinics from Yellow Pages (using fetch)
        const response = await fetch("https://www.yellowpages.ca/search/si/1/Veterinarians/Toronto+ON");
		const html = await response.text(); //fs.readFileSync("./TorontoVetData.txt", { encoding: 'utf8' });
		const dom = new JSDOM(html);
		
		const clinics = dom.window.document.getElementsByClassName("listing_right_section");
		let clinic_data = []
		for (let clinic of clinics) {
			name = clinic.getElementsByClassName("listing__name--link")[0].innerHTML;
			
			address = [];
			for (let a of clinic.getElementsByClassName("jsMapBubbleAddress"))
				address.push(a.innerHTML);
			
			website = clinic.getElementsByClassName("mlr__item--website");
			website = (website.length > 0) ? website[0].children[0].href : "";
			
			phone = clinic.getElementsByClassName("mlr__item--phone");
			phone = (phone.length > 0) ? phone[0].children[0].dataset.phone : "";
			
			clinic_data.push({ name, address, phone, website });
		}
        res.json(clinic_data);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching clinic data");
    }
});

// Function to calculate distance using Google Maps API
async function calculateDistance(origin, destination) {
    try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.lat},${origin.lon}&destinations=${encodeURIComponent(destination)}&key=${GOOGLE_MAPS_API_KEY}`);
        const data = await response.json();
        const element = data.rows[0].elements[0];
        return {
            distance: element.distance.text,
            duration: element.duration.text,
        };
    } catch (error) {
        console.error("Error calculating distance:", error.message);
        return { distance: "Unknown", duration: "Unknown" };
    }
}



// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});