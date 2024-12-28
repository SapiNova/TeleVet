


function GetCurrentLocation() {
	if ("geolocation" in navigator) {
		navigator.geolocation.getCurrentPosition((position) => {
			return [position.coords.latitude, position.coords.longitude];
		});
	} else {
		console.log("GeoLocation API not available");
		return null;
	}
}

export { GetCurrentLocation };








// function geoFindMe() {
  // const status = document.querySelector("#status");
  // const mapLink = document.querySelector("#map-link");

  // mapLink.href = "";
  // mapLink.textContent = "";

  // function success(position) {
    // const latitude = position.coords.latitude;
    // const longitude = position.coords.longitude;

    // status.textContent = "";
    // mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
    // mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;
  // }

  // function error() {
    // status.textContent = "Unable to retrieve your location";
  // }

  // if (!navigator.geolocation) {
    // status.textContent = "Geolocation is not supported by your browser";
  // } else {
    // status.textContent = "Locating…";
    // navigator.geolocation.getCurrentPosition(success, error);
  // }
// }