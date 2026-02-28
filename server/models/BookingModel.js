import mongoose from "mongoose";
const BookingSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true }, // E.164 expected "+91..."

    date: { type: String, required: true },              // "2026-03-07"
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

    message: { type: String, trim: true, maxlength: 1200 }, // simple cap (not perfect 200 words, but ok)
  },
  { timestamps: true }
);

// stop same email booking same slot twice
BookingSchema.index({ email: 1, slotId: 1 }, { unique: true });

const Booking = mongoose.model("Booking", BookingSchema);

export default Booking;