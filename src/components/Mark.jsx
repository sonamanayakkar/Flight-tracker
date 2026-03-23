import React from 'react'
import { Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css"
import L from 'leaflet'
import { useMap } from "react-leaflet";
import flightmark from './images/flightmark.png'

const Mark = (props) => {
    const { fil, createplaneicon, flightclick } = props.datas




    return (

        fil && fil.length > 0 ? (
            fil.map((ele, idx) => {

                let lon = ele.long;
                let lat = ele.lat;

                return (< Marker key={idx} position={[lat, lon]} icon={createplaneicon(ele.degree,flightmark)} eventHandlers={{ click: () => flightclick(idx) }}>
                    <Popup>
                        ✈️ {ele.address || "No Name"} <br />
                        Country: {ele.region} <br />
                        onground: {ele.onground} m/s <br />
                        speed:{ele.speed}<br />
                        cd: {ele.cd}
                    </Popup>
                </Marker>)
            })
        ) : (<p>no flight found</p>)

        // <h1>hi</h1>

    )
}

export default Mark