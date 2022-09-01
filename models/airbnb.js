const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;

const AirbnbSchema = new Schema({
	title: String,
	image: String,
	geometry: {
		type: {
			type: String,
			enum: ["Point"],
			required: true,
		},
		coordinates: {
			type: [Number],
			required: true,
		},
	},
	price: Number,
	description: String,
	location: String,
	author: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: "Review",
		},
	],
});

AirbnbSchema.post("findOneAndDelete", async function (doc) {
	if (doc) {
		await review.deleteMany({
			_id: {
				$in: doc.reviews,
			},
		});
	}
});

module.exports = mongoose.model("Airbnb", AirbnbSchema);
