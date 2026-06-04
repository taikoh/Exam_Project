/*
Validation function that checks data inputs and
proper formatting price, quantity, date and URL.
*/

module.exports = function validateProductUpdate (req, res, next) {
	const { price, quantity, date_added, imgurl } = req.body;

	if (price !== undefined && isNaN(Number(price))) {
		return res.status(400).jsend.fail({ statusCode: 400, message: "Price must be a number." })
	}

	if (quantity !== undefined && isNaN(Number(quantity))) {
		return res.status(400).jsend.fail({ statusCode: 400, message: "Quantity must be a number." })
	}

	// Date validation: Date format must be YYYY-MM-DD
	const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

	if (date_added && !dateRegex.test(date_added)) {
		return res.status(400).jsend.fail({
			message: "Date must be in correct format (YYYY-MM-DD)."
		})
	}

	// Image URL validation: Requires a valid URL with an image extension (jpg, jpeg, gif or png)
	const imgURLRegex = /^https?:\/\/.*\.(jpg|jpeg|png|gif)$/i;

	if (imgurl && !imgURLRegex.test(imgurl)) {
		return res.status(400).jsend.fail({
			message: "Invalid image URL."
		})
	}

    next();
}