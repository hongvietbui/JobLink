import React from "react";

export default function SmallUserProfile({ name, rating, picture, address, phoneNumber }) {
  return (
      <div className="p-4 border rounded-lg shadow-md flex items-center space-x-4">
        <img src={picture} alt="User profile" className="w-16 h-16 rounded-full" />
        <div>
          <h3 className="text-lg font-semibold">{name}</h3>
          <p>
            <strong>Rating:</strong> {Array(rating).fill('⭐').join('')}
          </p>
          <p><strong>Address: {address}</strong></p>
          <p><strong>Phone number: {phoneNumber}</strong></p>
        </div>
      </div>
    );
};