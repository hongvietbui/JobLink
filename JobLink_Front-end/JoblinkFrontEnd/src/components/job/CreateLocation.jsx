import { useEffect, useState } from "react";
import agent from "@/lib/axios"; // Import API agent to fetch user details and update location
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, MapPin, Search } from "lucide-react";

export default function CreateLocation() {
  const [userLocation, setUserLocation] = useState({ address: "", lat: 0, lon: 0 });
  const [map, setMap] = useState(null); // Reference to Google Map instance

  // Fetch user's current location
  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const response = await agent.User.me(); // Fetch user details
        const { address, lat, lon } = response; // Extract location details
        setUserLocation({ address, lat, lon });
      } catch (error) {
        console.error("Error fetching user location:", error);
      }
    };
    fetchUserLocation();
  }, []);

  // Initialize map and place marker based on user's location
  useEffect(() => {
    if (window.google && userLocation.lat && userLocation.lon) {
      const mapInstance = new window.google.maps.Map(document.getElementById("map"), {
        center: { lat: userLocation.lat, lng: userLocation.lon },
        zoom: 14,
      });
      new window.google.maps.Marker({
        position: { lat: userLocation.lat, lng: userLocation.lon },
        map: mapInstance,
        draggable: true,
        title: "Drag to set location",
      });

      setMap(mapInstance); // Save map instance for future reference
    }
  }, [userLocation.lat, userLocation.lon]);

  // Handle address change and geocode new address
  const handleAddressSearch = async () => {
    try {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: userLocation.address }, (results, status) => {
        if (status === "OK" && results[0]) {
          const location = results[0].geometry.location;
          map.setCenter(location); // Center map on new location
          setUserLocation((prev) => ({
            ...prev,
            lat: location.lat(),
            lon: location.lng(),
          }));
          // Update marker position
          new window.google.maps.Marker({
            position: location,
            map,
            draggable: true,
            title: "New location",
          });
        } else {
          alert("Geocode was not successful for the following reason: " + status);
        }
      });
    } catch (error) {
      console.error("Error with address search:", error);
    }
  };

  // Save the updated location data to server
  const handleSaveLocation = async () => {
    try {
      await agent.User.updateProfile({
        address: userLocation.address,
        lat: userLocation.lat,
        lon: userLocation.lon,
      });
      alert("Location updated successfully!");
    } catch (error) {
      console.error("Error updating location:", error);
      alert("Failed to update location.");
    }
  };

  return (
    <div className="container mx-auto max-w-3xl p-6">
      <Card className="border-none shadow-none">
        <CardHeader className="px-0">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <CardTitle className="text-xl font-medium">Select Work Location</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          <div className="relative">
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-5 w-5 text-muted-foreground" />
              <Input
                className="pl-10 pr-10 h-12 bg-muted border-none text-lg"
                placeholder="Enter address"
                type="text"
                value={userLocation.address}
                onChange={(e) =>
                  setUserLocation((prev) => ({ ...prev, address: e.target.value }))
                }
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 h-8 w-8"
                onClick={handleAddressSearch}
              >
                <MapPin className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Map container */}
          <div className="mt-4 h-[600px] rounded-lg bg-muted" id="map">
            <p className="text-muted-foreground text-center">Map will be displayed here</p>
          </div>

          <div className="mt-4">
            <Button onClick={handleSaveLocation}>Save Location</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
