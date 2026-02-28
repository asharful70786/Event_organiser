import mongoose from "mongoose";
const SlotSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },         
    start: { type: String, required: true },      
    end: { type: String, required: true },          
    label: { type: String, required: true },       

    capacity: { type: Number, default: 4 },
    bookedCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// prevent duplicates for same date+start
SlotSchema.index({ date: 1, start: 1 }, { unique: true });

const Slot = mongoose.model("Slot", SlotSchema);

export default Slot;