import { GetCurrentLocation } from './location.js';
import { Get, Post } from './request.js'

const clinic_container = document.getElementById("clinic-list");
const pagination_container = document.getElementById("pagination_container");

// GetCurrentLocation().then(location => {
	// console.log(location);
// });

const clinic_data = await Post('/api/clinics', {}, 'json');

function GetOrEnsureGrid(page) {
	console.log(page)
	if (clinic_container.children.length < (page + 1)) {
		clinic_container.innerHTML += `
			<div class="clinic-grid hidden"></div>
		`;
		
		pagination_container.innerHTML += `
			<button class="page-button" onclick="showPage(${page})">${page + 1}</button>
		`;
	}
	return clinic_container.children[page];
}

for (let i = 0; i < clinic_data.length; i++) {
	let clinic = clinic_data[i];
	GetOrEnsureGrid(Math.floor(i / 9)).innerHTML += `
		<div class="clinic">
			<h3>${clinic.name}</h3>
			<p><strong>Address:</strong> ${clinic.address}</p>
			<p><strong>Phone:</strong> ${clinic.phone}</p>
			<p><strong>Distance:</strong> ${clinic.distance}</p>
			<p><strong>Availability:</strong> N/A</p>
			<p><strong>Next Available Time:</strong> N/A</p>
		</div>
	`
}


// Initially show the first page
showPage(0);