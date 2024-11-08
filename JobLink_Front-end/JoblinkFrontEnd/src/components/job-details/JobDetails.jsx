import React from "react";

function JobDetails({jobName, description, address, price, note}) {
    return (
        <div className="p-4 border rounded-lg shadow-md space-y-2">
              <h2 className="text-xl font-bold">{jobName}</h2>
              <p><strong>Description:</strong> {description}</p>
              <p><strong>Address:</strong> {address}</p>
              <p><strong>Price:</strong> {price}</p>
              <p><strong>Note:</strong> {note}</p>
        </div>
    );
}

export default JobDetails;