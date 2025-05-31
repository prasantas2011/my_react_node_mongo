import React from 'react';

export default function AboutUs() {
  return (
    <div className="container mt-5">
      <h1 className="mb-4 my-custom-title">About Us</h1>
      <div className="row align-items-center">
        <div className="col-md-4 mb-3 mb-md-0">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=cover&w=400&q=80"
            alt="Team"
            className="img-fluid rounded shadow"
            style={{ maxHeight: '220px', objectFit: 'cover' }}
          />
        </div>
        <div className="col-md-8">
          <p>
            Welcome to our project! We are a passionate team dedicated to building
            modern web applications that are fast, user-friendly, and accessible.
          </p>
          <p>
            Our mission is to deliver high-quality solutions that help people
            connect, share, and grow. We believe in continuous learning,
            collaboration, and innovation.
          </p>
          <p>
            Thank you for visiting our About Us page. If you have any questions
            or feedback, feel free to reach out!
          </p>
        </div>
      </div>
    </div>
  );
}