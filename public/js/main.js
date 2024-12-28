import { GetCurrentLocation } from './location.js';
import { Get, Post } from './request.js'

const clinic_container = document.getElementsByClassName("clinic-grid")[0]

// GetCurrentLocation().then(location => {
	// console.log(location);
// });

const clinic_data = await Post('/api/clinics', {}, 'json');

for (let clinic of clinic_data) {
	clinic_container.innerHTML += `
		<div class="clinic">
			<h3>${clinic.name}</h3>
			<p><strong>Address:</strong> ${clinic.address}</p>
			<p><strong>Phone:</strong> ${clinic.phone}</p>
			<p><strong>Distance:</strong> N/A</p>
			<p><strong>Availability:</strong> N/A</p>
			<p><strong>Next Available Time:</strong> N/A</p>
		</div>
	`
}

