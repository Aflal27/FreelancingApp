import { Card, Table, Modal, Button, Label, Select } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { MdModeEdit, MdDelete } from "react-icons/md";
import axios from "axios";
import { useSelector } from "react-redux";

export default function Users() {
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [newRole, setNewRole] = useState("");
  const { _id, role } = useSelector((state) => state.userState);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`/api/auth/get/${_id}`);
      setAllUsers(data);
    } catch (error) {
      console.log("getUserError", error);
    }
  };

  // Delete user function
  const deleteUser = async (userId) => {
    try {
      await axios.delete(`/api/auth/delete/${userId}`);
      setAllUsers(allUsers.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("DeleteUserError:", error);
    }
  };

  // Open modal and set selected user for updating role
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setShowUpdateModal(true);
  };

  // Update user role function
  const updateUserRole = async () => {
    try {
      await axios.put(`/api/auth/update/${selectedUser._id}`, {
        role: newRole,
      });
      fetchUsers(); // Refresh the user list
      setShowUpdateModal(false); // Close the modal
    } catch (error) {
      console.error("UpdateUserError:", error);
    }
  };

  return (
    <div>
      <Card>
        <h3 className="text-lg font-semibold">User List</h3>
        <Table>
          <Table.Head>
            <Table.HeadCell>ID</Table.HeadCell>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Role</Table.HeadCell>
            <Table.HeadCell>Action</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {allUsers?.map((user, index) => (
              <Table.Row key={user._id}>
                <Table.Cell>{user._id}</Table.Cell>
                <Table.Cell>{user.username}</Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell>{user.role}</Table.Cell>
                <Table.Cell className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditClick(user)}
                    className="bg-blue-500 text-white rounded p-1">
                    <MdModeEdit size={20} />
                  </button>
                  <button
                    onClick={() => deleteUser(user._id)}
                    className="bg-red-500 text-white rounded p-1">
                    <MdDelete size={20} />
                  </button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Card>

      {/* Update Role Modal */}
      <Modal show={showUpdateModal} onClose={() => setShowUpdateModal(false)}>
        <Modal.Header>Update User Role</Modal.Header>
        <Modal.Body>
          <div>
            <Label htmlFor="role" className="mb-2 block">
              Role
            </Label>
            <Select
              id="role"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </Select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setShowUpdateModal(false)}>
            Cancel
          </Button>
          <Button color="blue" onClick={updateUserRole}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
