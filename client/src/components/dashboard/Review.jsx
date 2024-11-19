import {
  Card,
  Label,
  Table,
  TextInput,
  Button,
  Modal,
  FileInput,
} from "flowbite-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { uploadFileCloud } from "../../helpers/uploadFileCloud";

export default function Review() {
  const [gigId, setGigId] = useState("");
  const [reviews, setReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [logoLoading, setLogoLoading] = useState(false);
  const [profilePic, setProfilePic] = useState("");


  // Function to handle profile image upload
  const handleProfile = async (e) => {
    setLogoLoading(true);
    const file = e.target.files[0];
    const upload = await uploadFileCloud(file);
    setProfilePic(upload?.url);
    setLogoLoading(false);
  };

  // Fetch reviews for the specified gig ID
  const fetchReviews = async () => {
    if (!gigId) return;
    try {
      const { data } = await axios.get(`/api/gig/get-reviews/${gigId}`);
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  // Add a new review
  const addReview = async (newReview) => {
    try {
      const { data } = await axios.post(
        `/api/gig/create-reviews/${gigId}`,
        newReview
      );
      setReviews([...reviews, data]);
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  // Update an existing review
  const updateReview = async (reviewId, updatedReview) => {
    try {
      await axios.put(
        `/api/gig/update-reviews/${gigId}/${reviewId}`,
        updatedReview
      );
      setReviews(
        reviews.map((rev) => (rev._id === reviewId ? updatedReview : rev))
      );
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  // Delete a review
  const deleteReview = async (reviewId) => {
    try {
      await axios.delete(`/api/gig/delete-reviews/${gigId}/${reviewId}`);
      setReviews(reviews.filter((rev) => rev._id !== reviewId));
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  // Handle adding/updating review in modal
  const handleSubmitReview = (e) => {
    e.preventDefault();
    const reviewData = {
      rating: e.target.rating.value,
      comment: e.target.comment.value,
      name: e.target.name.value,
      profilePic: profilePic || "", // Include profile picture URL
    };

    if (selectedReview) {
      updateReview(selectedReview._id, reviewData);
    } else {
      addReview(reviewData);
    }
    setIsModalOpen(false);
    setSelectedReview(null);
  };

  // Open modal for editing or adding a review
  const openModal = (review = null) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchReviews();
  }, [gigId]);

  return (
    <div>
      <div className="">
        <Card>
          <h3 className=" text-lg font-semibold">Reviews</h3>

          <div className="flex items-center justify-center my-3">
            <div className=" flex flex-col gap-4">
              <label className="w-[500px]">
                <p className="text-sm font-semibold text-center mb-2">
                  Gig ID:
                </p>
                <TextInput
                  value={gigId}
                  onChange={(e) => setGigId(e.target.value)}
                  className="w-[500px]"
                  placeholder="Search by Gig ID..."
                />
              </label>
              <Button onClick={fetchReviews} className="">
                Search Reviews
              </Button>
            </div>
          </div>

          <div className="mt-5">
            <Table>
              <Table.Head>
                <Table.HeadCell>ID</Table.HeadCell>
                <Table.HeadCell>Rating</Table.HeadCell>
                <Table.HeadCell>User</Table.HeadCell>
                <Table.HeadCell>Comment</Table.HeadCell>
                <Table.HeadCell>Action</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {reviews.map((review) => (
                  <Table.Row key={review._id}>
                    <Table.Cell>{review._id}</Table.Cell>
                    <Table.Cell>{review.rating}</Table.Cell>
                    <Table.Cell>{review.name}</Table.Cell>
                    <Table.Cell>{review.comment}</Table.Cell>
                    <Table.Cell className=" flex items-center">
                      <Button onClick={() => openModal(review)} size="xs">
                        Edit
                      </Button>
                      <Button
                        color="failure"
                        onClick={() => deleteReview(review._id)}
                        size="xs"
                        className="ml-2">
                        Delete
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            <Button onClick={() => openModal()} className="mt-3">
              Add New Review
            </Button>
          </div>
        </Card>
      </div>

      {/* Modal for Adding/Updating Review */}
      {isModalOpen && (
        <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <Modal.Header>
            {selectedReview ? "Update Review" : "Add New Review"}
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmitReview}>
              <div className="mb-2">
                <Label htmlFor="name">User Name</Label>
                <TextInput
                  id="name"
                  defaultValue={selectedReview?.name || ""}
                  placeholder="User Name"
                  required
                />
              </div>
              <div className="mb-2">
                <Label>Profile</Label>
                <FileInput accept="image/*" onChange={handleProfile} />
                {logoLoading && <p>Loading...</p>}
              </div>
              <div className="mb-2">
                <Label htmlFor="rating">Rating</Label>
                <TextInput
                  id="rating"
                  type="number"
                  min="1"
                  max="5"
                  defaultValue={selectedReview?.rating || ""}
                  placeholder="Rating (1-5)"
                  required
                />
              </div>
              <div className="mb-2">
                <Label htmlFor="comment">Comment</Label>
                <TextInput
                  id="comment"
                  defaultValue={selectedReview?.comment || ""}
                  placeholder="Comment"
                  required
                />
              </div>
              <div className="flex justify-end mt-4">
                <Button type="submit">
                  {selectedReview ? "Update" : "Add"}
                </Button>
                <Button
                  color="gray"
                  onClick={() => setIsModalOpen(false)}
                  className="ml-2">
                  Cancel
                </Button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}
