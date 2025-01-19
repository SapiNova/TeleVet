document.getElementById("find-button").onclick = (e) => {
	let location = document.getElementById("location").value;
	if (location != "")
		window.location.href = "find?location=" + location;
};

document.getElementById('symptoms-button').onclick = (e) => {
	const symptoms = document.getElementById('symptoms').value;
	const response_div = document.getElementById('response');
	console.log("!");

	response_div.classList.remove("hidden");
	// Display a fixed dummy diagnosis
	response_div.innerHTML = `
		<strong>Diagnosis:</strong>
		<span>Based on the symptoms, it sounds like your dog might have allergies, possibly environmental or food-related, leading to dermatitis and ear infections. A vet visit is recommended to confirm and discuss treatments like antihistamines or special shampoos.</span>
	`;
};
