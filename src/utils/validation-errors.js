/**
 * @param {Object} error
 * @param {Object[]} error.details
 * @param {string} error.details[].message
 * @param {string[]} error.details[].path
 */
function extractJoiErrors({ details }) {
	const errors = {};

	if (!details) return errors;

	for (let error of details) {
		const { message, path } = error;
		errors[path[0]] = message;
	}

	return errors;
}

module.exports = { extractJoiErrors };
