import Person from "../models/personModel.js";

export const createPerson = async (req, res) => {
  const { name, position, image, responsibilities, type } = req.body;
  try {
    const newPerson = new Person({
      name,
      position,
      image,
      responsibilities,
      type,
    });

    await newPerson.save();
    res.status(201).json(newPerson);
  } catch (error) {
    res.status(400).json({ message: "Error creating person", error });
  }
};
export const getPerson = async (req, res) => {
  const { type } = req.params; // 'Founder' or 'Employee'

  try {
    const people = await Person.find({ type });
    res.status(200).json(people);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error });
  }
};
export const updatePerson = async (req, res) => {
  const { id } = req.params;
  const { name, position, image, responsibilities } = req.body;

  try {
    const updatedPerson = await Person.findByIdAndUpdate(
      id,
      {
        name,
        position,
        image,
        responsibilities,
      },
      { new: true }
    );

    if (!updatedPerson) {
      return res.status(404).json({ message: "Person not found" });
    }

    res.status(200).json(updatedPerson);
  } catch (error) {
    res.status(400).json({ message: "Error updating person", error });
  }
};
export const deletePerson = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPerson = await Person.findByIdAndDelete(id);

    if (!deletedPerson) {
      return res.status(404).json({ message: "Person not found" });
    }

    res.status(200).json({ message: "Person deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting person", error });
  }
};

export const getAllPerson = async (req, res) => {
  try {
    const people = await Person.find();  // This fetches all documents in the Person collection
    res.status(200).json(people);  // Sends a JSON response with the fetched data
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error });  // Error handling
  }
};
