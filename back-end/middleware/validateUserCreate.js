/*
Validation function that checks data inputs and
proper formatting of email and phone number.
*/

module.exports = function validateUserCreate (req, res, next) {
	const { firstname, lastname, username, email, address, city, phone, password } = req.body;
    
    if (!firstname)
		return res.status(400).jsend.fail(
				{ statusCode: 400, result: "First name is required." }
			);
	if (!lastname)
		return res.status(400).jsend.fail(
				{ statusCode: 400, result: "Last name is required." }
			);
	if (!username)
		return res.status(400).jsend.fail(
				{ statusCode: 400, result: "Username is required." }
			);
	if (!email)
		return res.status(400).jsend.fail(
				{ statusCode: 400, result: "Email is required." }
			);
	if (!city)
		return res.status(400).jsend.fail(
				{ statusCode: 400, result: "City is required." }
			);
	if (!address || address.length < 3 || address.length > 100)
		return res.status(400).jsend.fail(
				{ statusCode: 400, result: "Adress is required." }
			);
	if (!phone)
		return res.status(400).jsend.fail(
				{ statusCode: 400, result: "Phone is required." }
			);
	if (!password)
		return res.status(400).jsend.fail(
				{ statusCode: 400, result: "Password is required." }
			);

    // Phone validation: No 0 at start, min 8 digits, max 15. Optional to use '+' for country code.
    const phoneRegex =  /^\+?[1-9][0-9]{7,14}$/;

    if (!phoneRegex.test(phone)) {
        return res.status(400).jsend.fail({
            message: "Invalid phone number."
        })
    }

    // Email validation: Requires text before @. Requires @. No whitespace. requires dot before domain name.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).jsend.fail({
            message: "Invalid email format."
        });
    }

    next();
}