import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";


const Map = () => {
    const [flights, setFlights] = useState([]);

    // Fetch flight data
    useEffect(() => {
        fetch("https://opensky-network.org/api/states/all")
            .then((res) => res.json())
            .then((data) => {
                setFlights(data.states);
                console.log(data.states);
                
            });
    }, []);

    // Create custom plane icon (DIV)
    const createPlaneIcon = (angle) =>
        L.divIcon({
            className: "custom-plane",
            html: `<div class="plane" style="transform: rotate(${angle}deg)">✈️</div>`,
            iconSize: [30, 30],
        });

    // Filter (India region for performance)
    const filteredFlights = flights.filter((f) => {
        const lat = f[6];
        const lon = f[5];

        return (
            lat &&
            lon &&
            lat > 6 &&
            lat < 37 &&
            lon > 68 &&
            lon < 97
        );
    });

    return (
        <div style={{ height: "100vh", width: "100%" }}>
            <MapContainer
                center={[13.0827, 80.2707]}
                zoom={5}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {filteredFlights.map((flight, index) => {
                    const lat = flight[6];
                    const lon = flight[5];
                    const heading = flight[10] || 0;

                    if (!lat || !lon) return null;

                    return (
                        <Marker
                            key={index}
                            position={[lat, lon]}
                            icon={createPlaneIcon(heading)}
                        >
                            <Popup>
                                ✈️ {flight[1] || "No Name"} <br />
                                Country: {flight[2]} <br />
                                Speed: {flight[9]} m/s <br />
                                Altitude: {flight[7]} m
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
}

export default Map