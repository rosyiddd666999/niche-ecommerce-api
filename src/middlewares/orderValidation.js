const { body } = require("express-validator");
const { handleValidationErrors } = require("./core/errorsValidationHandling.js");

const createOrderValidation = [
  body("shippingAddress")
    .isObject()
    .withMessage("Shipping address must be an object")
    .custom((value) => {
      const requiredFields = [
        "street",
        "city",
        "postal_code",
        "phone",
        "details",
      ];
      const missingFields = requiredFields.filter(
        (field) => !value.hasOwnProperty(field)
      );
      if (missingFields.length > 0) {
        throw new Error(
          `Shipping address is missing the following fields: ${missingFields.join(
            ", "
          )}`
        );
      }
      return true;
    }),
  handleValidationErrors,
];

module.exports = { createOrderValidation };