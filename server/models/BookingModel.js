import mongoose from "mongoose";
const BookingSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true }, 

    date: { type: String, required: true },             
    slotId: { type: mongoose.Schema.Types.ObjectId, ref: "Slot", required: true },
    slotLabel: { type: String, required: true },      
    
    country: {
       type: String, 
       trim: true

   },           
    city: {
       type: String, 
       trim: true 

   },             

    message: { type: String, trim: true, maxlength: 1200 },
  },
  { timestamps: true }
);

BookingSchema.index({ email: 1, slotId: 1 }, { unique: true });
\


const Booking = mongoose.model("Booking", BookingSchema);

export default Booking;