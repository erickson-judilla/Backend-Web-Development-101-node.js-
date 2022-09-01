const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Airbnb = require("../models/airbnb");
const { isLoggedIn, isAuthor, validateAirbnb } = require("../middleware");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken =
	"pk.eyJ1IjoiZXJpY2tzb25qdWRpbGxhIiwiYSI6ImNsNm5qazRlNzAxZ3QzanFvdWMxdnhvNmUifQ.2NK74MUU3tfsztDDoUJdCg";

const geocoder = mbxGeocoding({ accessToken: mapToken });

router.get(
	"/",
	catchAsync(async (req, res) => {
		const airbnbs = await Airbnb.find({});
		res.render("index", { airbnbs });
	})
);

router.get("/airbnbs/new", isLoggedIn, (req, res) => {
	res.render("airbnbs/new");
});

router.post(
	"/",
	isLoggedIn,
	validateAirbnb,
	catchAsync(async (req, res, next) => {
		const geoData = await geocoder
			.forwardGeocode({
				query: req.body.airbnb.location,
				limit: 1,
			})
			.send();
		const airbnb = new Airbnb(req.body.airbnb);
		airbnb.geometry = geoData.body.features[0].geometry;
		airbnb.author = req.user._id;
		await airbnb.save();
		req.flash("success", "Succesfully made a new Hotel");
		res.redirect(`/${airbnb._id}`);
	})
);

router.get(
	"/:id",
	catchAsync(async (req, res) => {
		const airbnb = await Airbnb.findById(req.params.id)
			.populate({
				path: "reviews",
				populate: {
					path: "author",
				},
			})
			.populate("author");
		if (!airbnb) {
			req.flash("error", "Cannot find that Hotel!");
			return res.redirect("/");
		}
		res.render("airbnbs/show", { airbnb });
	})
);

router.get(
	"/airbnbs/:id/edit",
	isLoggedIn,
	isAuthor,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const airbnb = await Airbnb.findById(id);
		if (!airbnb) {
			req.flash("error", "Cannot find that Hotel!");
			return res.redirect("/");
		}
		res.render("airbnbs/edit", { airbnb });
	})
);

router.put(
	"/:id",
	validateAirbnb,
	isLoggedIn,
	isAuthor,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const airbnb = await Airbnb.findByIdAndUpdate(id, { ...req.body.airbnb });
		req.flash("success", "Successfully updated Hotel");
		res.redirect(`/${airbnb._id}`);
	})
);

router.delete(
	"/:id",
	isLoggedIn,
	isAuthor,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		await Airbnb.findByIdAndDelete(id);
		req.flash("success", "Successfully deleted Hotel");
		res.redirect("/");
	})
);

module.exports = router;
