const express = require("express");
const router = express.Router({ mergeParams: true });
const Airbnb = require("../models/airbnb");
const Review = require("../models/review");
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware");

router.post(
	"/",
	validateReview,
	isLoggedIn,
	catchAsync(async (req, res) => {
		const airbnb = await Airbnb.findById(req.params.id);
		const review = new Review(req.body.review);
		review.author = req.user._id;
		airbnb.reviews.push(review);
		await review.save();
		await airbnb.save();
		req.flash("success", "Created new review!");
		res.redirect(`/${airbnb._id}`);
	})
);

router.delete(
	"/:reviewId",
	isLoggedIn,
	isReviewAuthor,
	catchAsync(async (req, res) => {
		const { id, reviewId } = req.params;
		await Airbnb.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
		await Review.findByIdAndDelete(reviewId);
		req.flash("success", "Successfully deleted review");
		res.redirect(`/${id}`);
	})
);

module.exports = router;
