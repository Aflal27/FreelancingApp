import React, { useState, useEffect } from "react";
import axios from "axios";
import { uploadFileCloud } from "../../helpers/uploadFileCloud";

// Component to display a person card
const PersonCard = ({ person, onDelete, onEdit }) => (
  <div className="bg-gray-100 p-4 rounded-lg shadow-lg">
    <img
      className="w-24 h-24 rounded-full mx-auto"
      src={person.image}
      alt={person.name}
    />
    <h2 className="text-xl font-bold text-center">{person.name}</h2>
    <p className="text-center">{person.position}</p>
    <ul className="mt-2">
      {person.responsibilities.map((resp, index) => (
        <li key={index} className="text-sm text-gray-600">
          • {resp}
        </li>
      ))}
    </ul>
    <div className="flex justify-between mt-4">
      <button onClick={() => onEdit(person)} className="text-blue-500">
        Edit
      </button>
      <button onClick={() => onDelete(person._id)} className="text-red-500">
        Delete
      </button>
    </div>
  </div>
);

// Main PeopleManagement Component
const PeopleManagement = () => {
  const [people, setPeople] = useState([]);
  const [type, setType] = useState("Founder"); // 'Founder' or 'Employee'
  const [newPerson, setNewPerson] = useState(initialPersonState());
  const [imageLoading, setImageLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false); // State to track if we are editing
  const [editId, setEditId] = useState(null); // Track the id of the person being edited

  // Initial state for a new person form
  function initialPersonState() {
    return {
      name: "",
      position: "",
      image: "",
      responsibilities: "",
      type: "Founder",
    };
  }

  // Fetch data on component load and whenever 'type' changes
  const fetchPeople = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/person/${type}`);
      setPeople(data);
    } catch (error) {
      console.error("Error fetching people", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPeople();
  }, [type]);

  // Handle file/image upload
  const handleImageUpload = async (e) => {
    setImageLoading(true);
    const file = e.target.files[0];
    try {
      const upload = await uploadFileCloud(file); // Assumes function uploads and returns a URL
      if (upload) {
        setNewPerson((prev) => ({
          ...prev,
          image: upload.url,
        }));
      }
    } catch (error) {
      console.error("Error uploading image", error);
    }
    setImageLoading(false);
  };

  // Handle form submit for adding or editing a person
  const handleSubmit = async () => {
    if (!newPerson.name || !newPerson.position || !newPerson.image) {
      alert("Please fill in all fields and upload an image.");
      return;
    }

    try {
      if (editing) {
        // If editing, update the person
        await axios.put(`/api/person/update/${editId}`, {
          ...newPerson,
          responsibilities: newPerson.responsibilities
            .split(",")
            .map((res) => res.trim()),
        });
      } else {
        // If not editing, create a new person
        await axios.post("/api/person/create", {
          ...newPerson,
          responsibilities: newPerson.responsibilities
            .split(",")
            .map((res) => res.trim()), // Trims responsibilities
        });
      }

      fetchPeople();
      setNewPerson(initialPersonState()); // Reset form after submission
      setEditing(false); // Exit editing mode
      setEditId(null); // Reset editId
    } catch (error) {
      console.error("Error creating/updating person", error);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/person/delete/${id}`);
      fetchPeople();
    } catch (error) {
      console.error("Error deleting person", error);
    }
  };

  // Handle edit
  const handleEdit = (person) => {
    setEditing(true);
    setEditId(person._id);
    setNewPerson({
      name: person.name,
      position: person.position,
      image: person.image,
      responsibilities: person.responsibilities.join(", "), // Convert array back to comma-separated string
      type: person.type,
    });
  };

  // Toggle between Founder and Employee view
  const toggleType = (newType) => {
    if (newType !== type) {
      setType(newType);
      setNewPerson((prev) => ({ ...prev, type: newType }));
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        Manage {type === "Founder" ? "Founders" : "Employees"}
      </h1>

      {/* Loading Spinner */}
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {people.map((person) => (
            <PersonCard
              key={person._id}
              person={person}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}

      {/* Form to Add or Edit a Person */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl mb-4">
          {editing
            ? `Edit ${type === "Founder" ? "Founder" : "Employee"}`
            : `Add a new ${type === "Founder" ? "Founder" : "Employee"}`}
        </h2>
        <input
          className="border p-2 rounded w-full mb-4"
          placeholder="Name"
          value={newPerson.name}
          onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
        />
        <input
          className="border p-2 rounded w-full mb-4"
          placeholder="Position"
          value={newPerson.position}
          onChange={(e) =>
            setNewPerson({ ...newPerson, position: e.target.value })
          }
        />
        <input
          type="file"
          className="border p-2 rounded w-full mb-4"
          onChange={handleImageUpload}
        />
        {imageLoading && (
          <p className="text-center text-gray-500">Uploading image...</p>
        )}
        {newPerson.image && (
          <img
            src={newPerson.image}
            alt="Uploaded"
            className="w-24 h-24 rounded-full mx-auto mb-4"
          />
        )}
        <textarea
          className="border p-2 rounded w-full mb-4"
          placeholder="Responsibilities (comma separated)"
          value={newPerson.responsibilities}
          onChange={(e) =>
            setNewPerson({ ...newPerson, responsibilities: e.target.value })
          }
        />
        <button
          className={`bg-blue-500 text-white p-2 rounded w-full ${
            imageLoading ? "opacity-50" : ""
          }`}
          onClick={handleSubmit}
          disabled={imageLoading}>
          {editing ? "Update" : "Add"} {type}
        </button>
      </div>

      {/* Toggle Between Founder and Employee View */}
      <div className="mt-6 flex justify-center">
        <button
          className={`mr-4 p-2 rounded ${
            type === "Founder" ? "bg-gray-300" : "bg-blue-500 text-white"
          }`}
          onClick={() => toggleType("Employee")}>
          View Employees
        </button>
        <button
          className={`p-2 rounded ${
            type === "Employee" ? "bg-gray-300" : "bg-blue-500 text-white"
          }`}
          onClick={() => toggleType("Founder")}>
          View Founders
        </button>
      </div>
    </div>
  );
};

export default PeopleManagement;
