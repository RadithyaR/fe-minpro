import * as Yup from "yup";

const EventFormSchema = Yup.object({
  name: Yup.string().required().label("name"),
  description: Yup.string().required().label("description"),
  price: Yup.number().min(0).required().label("price"),
  startDate: Yup.date()
    .required()
    .label("startDate")
    .test(
      "is-future-date",
      "Start date must be today or in the future",
      function (value) {
        if (!value) return false;
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to compare only dates
        return selectedDate >= today;
      }
    ),
  endDate: Yup.date()
    .required()
    .label("endDate")
    .test(
      "is-after-start",
      "End date must be after start date",
      function (value) {
        const { startDate } = this.parent;
        if (!value || !startDate) return false;
        return new Date(value) > new Date(startDate);
      }
    ),
  availableSeats: Yup.number().min(1).required().label("availableSeat").min(1),
  eventImage: Yup.string().label("eventImage"),
  locationType: Yup.string().required().label("locationType"),
  address: Yup.string().label("address"),
  city: Yup.string().label("city"),
  link: Yup.string().label("link"),
});

export default EventFormSchema;
