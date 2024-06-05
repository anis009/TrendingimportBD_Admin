export type IQuotation = {
    _id: string;
    name?: String,
    departureAirport?: String,
    departureDate?: String, // Assuming getLocalDate formats your date as needed
    arrivalAirport?: String,
    arrivalDate?: String, // Adjust this as well

  status?: string;
    action?: 'View Details',
    firstName: String | null,
    lastName: String | null,
    email:String,
    phoneNumber:String | null,
   
    PAX:String,
    class:String,
    notes:String,
    type:String,
   
 
}

