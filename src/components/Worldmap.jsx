import React, { useEffect, useRef, useState } from 'react'
import india from '../components/images/india.jpg'
import './styles/world.css'
import axios from 'axios'
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css"
import L from 'leaflet'

const Worldmap = () => {

    let [flightdata, setFlightdata] = useState([])
    let [search, setSearch] = useState('')

    let searchvalue = useRef(null)

    let submitingdata = () => {
        setSearch(searchvalue.current.value)
    }

    useEffect(() => {
        let apicall = async () => {
            let api = await axios.get('https://opensky-network.org/api/states/all', {
                auth: { "clientId": "sonamanayakkar-api-client", "clientSecret": "HkORRn4pZKpoztKikNha6xxlGLNX2Arq" }
            }
            )

            let final = api.data.states
            debugger

            let india = final.filter((ele, idx) => {

                let country = ele[2]
                if (search == '') {
                    return (
                        country == 'India'
                    )
                }
                let text = search.toLowerCase()
                return (
                    country?.toLowerCase().includes(text)
                )

            })

            // console.log('one', india);

            setFlightdata(india)

        }

        apicall()
    }, [search])

    //object conversion
    let fil;
    if (flightdata && flightdata.length > 0) {

        fil = flightdata.map(ele => ({
            region: ele[2],
            long: ele[5],
            lat: ele[6],
            degree: ele[10],
            onground: ele[8],
            speed: ele[9],
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
                        fil.filter(ele => ele.lat !== null && ele.long !== null)

                            .map((ele, idx) => {
                                let lon = ele.long || null;
                                let lat = ele.lat || null;
                                return (<Marker Marker key={idx} position={[lat, lon]} icon={createplaneicon(ele.degree)} >
                                    <Popup>
                                        ✈️ {"aero" || "No Name"} <br />
                                        Country: {ele.region} <br />
                                        onground: {ele.onground} m/s <br />
                                        speed:{ele.speed}<br/>
                                        cd: {ele.cd}
                                    </Popup>
                                </Marker>
                                )
                            })
                    )
                        : (<p>no flight found</p>)
                    }
                </MapContainer>

                {/* <div className="filter">
                    <select name="" id="" onChange={(e) => setFilter(e.target.value)}>
                        <option value="all">All</option>
                        <option value="India">Arround india</option>
                        <option value="ground">on ground</option>
                        <option value="">onsky</option>
                    </select>
                </div> */}

                <div className="search">
                    <input type="text" ref={searchvalue} placeholder='Search by country' name="" id="" />
                    <button onClick={submitingdata}>Search</button>
                </div>

                <div className="totallists">

                    {flightdata && flightdata.length > 0 ? (

                        fil.filter(ele => ele.lat != null && ele.long != null && ele.cd!=null)
                            .map((ele, idx) => (
                                <div className="p">
                                    <div className="two">
                                        <div className="L d-flex gap-3 align-item-center">
                                            <div className="image">
                                                <img src={india} alt="" />
                                            </div>
                                            
                                            <h5 className='text-white m-0'>{ele.region}</h5>
                                        </div>
                                        <div className="L d-flex gap-4 ">
                                            <div className="loc text-white-50 ">{ele.lat}</div>
                                            <div className="loc text-white-50 ">{ele.long}</div>
                                        </div>
                                    </div>
                                    <div className="two2">
                                        <h5 className='text-white'>speed:{ele.speed}</h5>
                                        <h4>On Ground Status:{ele.onground==true?'flight on ground':"flight on sky"}</h4>
                                        <h4>climbing:{ele.cd}</h4>
                                    </div>
                                </div>
                            ))

                    ):(<p>no data found</p>)
                      
                    }

                    {/* <div className="p">
                        <div className="two">
                            <div className="L d-flex gap-3 align-item-center">
                                <div className="image">
                                    <img src={india} alt="" />
                                </div>

                                <h5 className='text-white m-0'>India</h5>
                            </div>
                            <div className="L d-flex gap-4 ">
                                <div className="loc text-white-50 ">15.20</div>
                                <div className="loc text-white-50 ">20.1</div>
                            </div>
                        </div>
                        <div className="two2">
                            <h4>On Ground Status:true</h4>
                            <h4>climbing</h4>
                        </div>
                    </div>

                    <div className="p">
                        <div className="two">
                            <div className="L d-flex gap-3 align-item-center">
                                <div className="image">
                                    <img src={india} alt="" />
                                </div>

                                <h5 className='text-white m-0'>India</h5>
                            </div>
                            <div className="L d-flex gap-4 ">
                                <div className="loc text-white-50 ">15.20</div>
                                <div className="loc text-white-50 ">20.1</div>
                            </div>
                        </div>
                        <div className="two2">
                            <h4>On Ground Status:true</h4>
                            <h4>climbing</h4>
                        </div>
                    </div>

                    <div className="p">
                        <div className="two">
                            <div className="L d-flex gap-3 align-item-center">
                                <div className="image">
                                    <img src={india} alt="" />
                                </div>

                                <h5 className='text-white m-0'>India</h5>
                            </div>
                            <div className="L d-flex gap-4 ">
                                <div className="loc text-white-50 ">15.20</div>
                                <div className="loc text-white-50 ">20.1</div>
                            </div>
                        </div>
                        <div className="two2">
                            <h4>On Ground Status:true</h4>
                            <h4>climbing</h4>
                        </div>
                    </div>

                    <div className="p">
                        <div className="two">
                            <div className="L d-flex gap-3 align-item-center">
                                <div className="image">
                                    <img src={india} alt="" />
                                </div>

                                <h5 className='text-white m-0'>India</h5>
                            </div>
                            <div className="L d-flex gap-4 ">
                                <div className="loc text-white-50 ">15.20</div>
                                <div className="loc text-white-50 ">20.1</div>
                            </div>
                        </div>
                        <div className="two2">
                            <h4>On Ground Status:true</h4>
                            <h4>climbing</h4>
                        </div>
                    </div>

                    <div className="p">
                        <div className="two">
                            <div className="L d-flex gap-3 align-item-center">
                                <div className="image">
                                    <img src={india} alt="" />
                                </div>

                                <h5 className='text-white m-0'>India</h5>
                            </div>
                            <div className="L d-flex gap-4 ">
                                <div className="loc text-white-50 ">15.20</div>
                                <div className="loc text-white-50 ">20.1</div>
                            </div>
                        </div>
                        <div className="two2">
                            <h4>On Ground Status:true</h4>
                            <h4>climbing</h4>
                        </div>
                    </div>

                    <div className="p">
                        <div className="two">
                            <div className="L d-flex gap-3 align-item-center">
                                <div className="image">
                                    <img src={india} alt="" />
                                </div>

                                <h5 className='text-white m-0'>India</h5>
                            </div>
                            <div className="L d-flex gap-4 ">
                                <div className="loc text-white-50 ">15.20</div>
                                <div className="loc text-white-50 ">20.1</div>
                            </div>
                        </div>
                        <div className="two2">
                            <h4>On Ground Status:true</h4>
                            <h4>climbing</h4>
                        </div>
                    </div>

                    <div className="p">
                        <div className="two">
                            <div className="L d-flex gap-3 align-item-center">
                                <div className="image">
                                    <img src={india} alt="" />
                                </div>

                                <h5 className='text-white m-0'>India</h5>
                            </div>
                            <div className="L d-flex gap-4 ">
                                <div className="loc text-white-50 ">15.20</div>
                                <div className="loc text-white-50 ">20.1</div>
                            </div>
                        </div>
                        <div className="two2">
                            <h4>On Ground Status:true</h4>
                            <h4>climbing</h4>
                        </div>
                    </div>

                    <div className="p">
                        <div className="two">
                            <div className="L d-flex gap-3 align-item-center">
                                <div className="image">
                                    <img src={india} alt="" />
                                </div>

                                <h5 className='text-white m-0'>India</h5>
                            </div>
                            <div className="L d-flex gap-4 ">
                                <div className="loc text-white-50 ">15.20</div>
                                <div className="loc text-white-50 ">20.1</div>
                            </div>
                        </div>
                        <div className="two2">
                            <h4>On Ground Status:true</h4>
                            <h4>climbing</h4>
                        </div>
                    </div> */}


                </div>

            </div>


        </section >
    );
}

export default Worldmap