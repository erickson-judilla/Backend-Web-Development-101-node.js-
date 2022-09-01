mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
	container: "map", // container ID
	style: "mapbox://styles/mapbox/outdoors-v11", // style URL
	center: airbnb.geometry.coordinates, // starting position [lng, lat]
	zoom: 9, // starting zoom
});

new mapboxgl.Marker({ color: "red" })
	.setLngLat(airbnb.geometry.coordinates)
	.setPopup(
		new mapboxgl.Popup({ offset: 25 }).setHTML(
			`<h3>${airbnb.title}</h3><p>${airbnb.location}</p>`
		)
	)
	.addTo(map);
