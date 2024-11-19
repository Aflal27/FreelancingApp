import mongoose from "mongoose";

const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  image: { type: String, required: true },
  responsibilities: [{ type: String }], // list of responsibilities
  type: { type: String, enum: ["Founder", "Employee"], required: true }, // either Founder or Employee
});

const Person = mongoose.model("Person", personSchema);

export default Person;
