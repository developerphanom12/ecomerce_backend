import Joi from "joi";

const ProductTagInitial = Joi.object({
  tag: Joi.string().required().messages({
    "string.empty": "tag is required",
    "any.required": "tag is required",
  })
});

 export const ValidateProductTag = (req, res, next) => {
  const { error } = ProductTagInitial.validate(req.query);

  if (error) {
    return res
      .status(400)
      .json({ status: false, message: error.details[0].message });
  }

  next();
};