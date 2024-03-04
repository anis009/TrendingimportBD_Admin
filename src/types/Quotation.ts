export type IQuotation = {
    _id: string;
    name?: String,
    departureAirport?: String,
    departureDate?: String, // Assuming getLocalDate formats your date as needed
    arrivalAirport?: String,
    arrivalDate?: String, // Adjust this as well

  status?: string;
    action?: 'View Details',
    firstName: String,
    lastName: String,
    email:String,
    phoneNumber:String,
   
    PAX:String,
    class:String,
    notes:String,
    type:String,
   
 
}

