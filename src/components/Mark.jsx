import React from 'react'
import { Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css"
import L from 'leaflet'
import { useMap } from "react-leaflet";
import flightmark from './images/flightmark.png'
import blueflight from './images/blueflight.png'

const Mark = (props) => {

    const { filtereddata, createplaneicon, flightclick ,flightmarkinsidemap} = props.datas


    

    return (

        filtereddata && filtereddata.length > 0 ? (
            filtereddata.map((ele, idx) => {

                let lon = ele.long;
                let lat = ele.lat;

                return (< Marker key={idx} position={[lat, lon]} ref={(e)=>flightmarkinsidemap.current[idx]=e} icon={createplaneicon(ele.degree,flightmark,blueflight,ele.onground)} eventHandlers={{ click: () => flightclick(idx,lon,lat) }}>
                    <Popup>
                        ✈️ {ele.address || "No Name"} <br />
                        Country: {ele.region} <br />
                        onground: {ele.onground} m/s <br />
                        speed:{(ele.speed)}  km/h<br />
                        altitude:{(ele.height)} ft<br />
                       
                    </Popup>
                </Marker>)
            })
        ) : (<p>no flight found</p>)

        // <h1>hi</h1>

    )
}

export default Mark