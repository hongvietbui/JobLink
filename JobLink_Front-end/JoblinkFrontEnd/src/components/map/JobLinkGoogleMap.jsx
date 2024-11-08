import React from "react";
import { GoogleMap, LoadScript, Marker } from "../../../node_modules/@react-google-maps/api";

const containerStyle = {
    width: "100%",
    height: "100%",
    borderRadius: "8px"
};

const center = {
    lat: 71.2,
    lng: 72.3
}

const JobLinkGoogleMap = () => {
    return (
    <div className="w-full h-64 bg-gray-200 rounded-lg">
        <LoadScript googleMapsApiKey="AIzaSyDmamckOE_jWT0ownHDR0ZzPbh-ZAbJDAw">
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={15}
        >
            {/* Marker tại vị trí trung tâm */}
            <Marker position={center} />
        </GoogleMap>
        </LoadScript>
    </div>
    );
};

export default JobLinkGoogleMap;