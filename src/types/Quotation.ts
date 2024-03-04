export type IQuotation = {
    name?: String,
    departureAirport?: String,
    departureDate?: String, // Assuming getLocalDate formats your date as needed
    arrivalAirport?: String,
    arrivalDate?: String, // Adjust this as well
    _id: string;
  status?: string;
    action?: 'View Details',
}

