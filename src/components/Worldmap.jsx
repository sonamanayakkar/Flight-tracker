import React, { useEffect, useState } from 'react'
import './styles/world.css'
import axios from 'axios'
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css"
import L from 'leaflet'

const Worldmap = () => {

    let [flightdata, setFlightdata] = useState([])
    let [filter1, setFilter] = useState('all')
    console.log(filter1);


    useEffect(() => {
        let apicall = async () => {
            let api = await axios.get('https://opensky-network.org/api/states/all', {
                auth: { "clientId": "sonamanayakkar-api-client", "clientSecret": "HkORRn4pZKpoztKikNha6xxlGLNX2Arq" }
            }
            )

            let final = api.data.states


            let india = final.filter((ele, idx) => {


                let lon = ele[5];
                let lat = ele[6];

                if (filter1 == 'India') {
                    return (
                        lon !== null &&
                        lat !== null &&
                        lon >= 68.7 && lon <= 97.25 &&
                        lat >= 6.4 && lat <= 37.6
                    )
                }
               
                


            })

            console.log('one', india);

            setFlightdata(india)

        }

        apicall()
    }, [filter1])
    // console.log("hi");
    // console.log(flightdata[0])
    let fil;
    if (flightdata && flightdata.length > 0) {

        fil = flightdata.map(ele => ({
            region: ele[2],
            long: ele[5],
            lat: ele[6],
            degree: ele[10],
            onground: ele[8],
            cd: ele[11]
        }))




    }
    // console.log('hi');

    // console.log(fil);




    let createplaneicon = (angle) => {
        return L.divIcon({
            className: "custom-plane",
            html: `<div class="plane" style="transform: rotate(${angle}deg)">✈️</div>`,
            iconSize: [30, 30],
        })
    }







    return (
        <section>
            <div className="map">
                <MapContainer className='link' center={[13.0827, 80.2707]} zoom={5} style={{ width: "100%", height: "100vh" }}>
                    <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />

                    {flightdata && flightdata.length > 0 ? (
                        fil.filter(ele => ele.lat !== null && ele.lon !== null)

                            .map((ele, idx) => {
                                let lon = ele.long || null;
                                let lat = ele.lat || null;
                                return (<Marker Marker key={idx} position={[lat, lon]} icon={createplaneicon(ele.degree)} >
                                    <Popup>
                                        ✈️ {"aero" || "No Name"} <br />
                                        Country: {ele.region} <br />
                                        onground: {ele.onground} m/s <br />
                                        cd: {ele.cd}
                                    </Popup>
                                </Marker>
                                )
                            })
                    )
                        : (<p>no flight found</p>)
                    }
                </MapContainer>

                <div className="filter">
                    <select name="" id="" onChange={(e) => setFilter(e.target.value)}>
                        <option value="all">All</option>
                        <option value="India">Arround india</option>
                        <option value="ground">on ground</option>
                        <option value="">onsky</option>
                        {/* <option value=""></option> */}
                    </select>
                </div>

            </div>


        </section >
    );
}

export default Worldmap