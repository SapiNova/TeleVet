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
        //const response = await fetch("https://www.yellowpages.ca/search/si/1/Veterinarians/Toronto+ON");
		const html = /*await response.text(); //*/fs.readFileSync("./TorontoVetData.txt", { encoding: 'utf8' });
		const dom = new JSDOM(html);
		
		const clinics = dom.window.document.getElementsByClassName("listing_right_section");
		let clinic_data = []
		for (let clinic of clinics) {
			name = clinic.getElementsByClassName("listing__name--link")[0].innerHTML;
			
			address = [];
			for (let a of clinic.getElementsByClassName("jsMapBubbleAddress"))
				address.push(a.innerHTML);	
			coords = await GetCoordinates(address);
			if (coords == null)
				continue;							
			distance = calculateDistance(coords, USER_LOCATION);
			console.log(distance);

			website = clinic.getElementsByClassName("mlr__item--website");
			website = (website.length > 0) ? website[0].children[0].href : "";
			
			phone = clinic.getElementsByClassName("mlr__item--phone");
			phone = (phone.length > 0) ? phone[0].children[0].dataset.phone : "";

			clinic_data.push({ name, address, distance, phone, website });
			
			if (clinic_data.length > 3)
				break;
		}
        res.json(clinic_data);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching clinic data");
    }
});

async function GetCoordinates(address) {
	try {
		search = address[0].replaceAll(" ", "+") + "," + address[1];
		response = await fetch(`http://nominatim.openstreetmap.org/search?q=${search}&format=json&polygon=1&addressdetails=1`);
		result = await response.json();
		console.log(result);
		result = result[0]
		return { lat: result.lat, lon: result.lon };
	} catch(error) {
		return null;
	}
}

// Function to calculate distance
function calculateDistance(a, b) {
	console.log(a, b)
	const r = 6371; // km
	const p = Math.PI / 180;
	const x = 0.5 - Math.cos((b.lat - a.lat) * p) / 2
				+ Math.cos(a.lat * p) * Math.cos(b.lat * p) *
				  (1 - Math.cos((b.lon - a.lon) * p)) / 2;
	return 2 * r * Math.asin(Math.sqrt(x));
  
    // try {
        // const response = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.lat},${origin.lon}&destinations=${encodeURIComponent(destination)}&key=${GOOGLE_MAPS_API_KEY}`);
        // const data = await response.json();
        // const element = data.rows[0].elements[0];
        // return {
            // distance: element.distance.text,
            // duration: element.duration.text,
        // };
    // } catch (error) {
        // console.error("Error calculating distance:", error.message);
        // return { distance: "Unknown", duration: "Unknown" };
    // }
}



// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});