import * as Yup from "yup";

const checkoutFormSchema = Yup.object({
  quantity: Yup.number().min(1).required().label("quantity"),
  pointsToUse: Yup.number().min(0).label("pointsToUse"),
  couponNominal: Yup.number().min(0).label("couponNominal"),
});

export default checkoutFormSchema;
