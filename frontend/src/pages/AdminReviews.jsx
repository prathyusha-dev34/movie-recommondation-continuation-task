import React, { useEffect, useState } from "react";
import API from "../services/api";
import AdminLayout from "../components/AdminLayout";

function AdminReviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await API.get("/admin/reviews");

console.log("Reviews Response:", JSON.stringify(res.data, null, 2));
console.log("Is Array:", Array.isArray(res.data));

setReviews(res.data.reviews);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteReview = async (id) => {
    try {
      await API.delete(`/admin/reviews/${id}`);
      fetchReviews();
    } catch (err) {
      console.log(err);
    }
  };

  return (
  <AdminLayout>
    <div style={{ padding: "20px", width: "100%" }}>
      <h1>Review Moderation</h1>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Movie ID</th>
            <th>Review</th>
            <th>Rating</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(reviews) &&
  reviews.map((review) => (
            <tr key={review.id}>
              <td>{review.id}</td>
              <td>{review.movie_id}</td>
              <td>{review.review}</td>
              <td>{review.rating}</td>
              <td>
                <button
                  onClick={() =>
                    deleteReview(review.id)
                  }
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </AdminLayout>
  );
}

export default AdminReviews;