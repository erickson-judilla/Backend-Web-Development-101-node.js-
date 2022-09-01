const mongoose = require("mongoose");
const Airbnb = require("../models/airbnb");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

mongoose.connect("mongodb://localhost:27017/air-bnb", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
	await Airbnb.deleteMany({});
	for (let i = 0; i < 50; i++) {
		const random1000 = Math.floor(Math.random() * 1000);
		const price = Math.floor(Math.random() * 20) + 10;
		const bnb = new Airbnb({
			author: "62f345a5ba12e69b414af1db",
			location: `${cities[random1000].city},${cities[random1000].state}`,
			title: `${sample(descriptors)} ${sample(places)}`,
			image: "https://source.unsplash.com/collection/10574893",
			description:
				"Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo aut error nobis. Illum optio minus itaque laborum, saepe animi et, perspiciatis quos nemo quisquam modi! Doloribus inventore impedit laudantium incidunt.",
			price,
			geometry: {
				type: "Point",
				coordinates: [-113.1331, 47.0202],
			},
		});
		await bnb.save();
	}
};

seedDB().then(() => {
	mongoose.connection.close();
});
