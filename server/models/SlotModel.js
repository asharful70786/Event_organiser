import mongoose from "mongoose";
const SlotSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },          // "2026-03-07"
    start: { type: String, required: true },         // "10:00"
    end: { type: String, required: true },           // "11:00"
    label: { type: String, required: true },         // "10:00-11:00"

    capacity: { type: Number, default: 4 },
    bookedCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// prevent duplicates for same date+start
SlotSchema.index({ date: 1, start: 1 }, { unique: true });

const Slot = mongoose.model("Slot", SlotSchema);

export default Slot;