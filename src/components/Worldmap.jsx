import React, { useEffect, useRef, useState } from 'react'
import india from '../components/images/india.jpg'
import flightlogo from './images/flightlogo.png'
import satilite from './images/satilite.jpg'
import normal from './images/normal.jpg'
import './styles/world.css'
import axios from 'axios'
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css"
import L from 'leaflet'

const Worldmap = () => {

    let [flightdata, setFlightdata] = useState([])
    let [search, setSearch] = useState('')
    let [filter, setFilter] = useState('All')
    let [toggle, setToggle] = useState(false)
    let [apicheck, setApicheck] = useState(false)
    let [map, setMap] = useState('http://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}')


    let [lat, setLan] = useState({ lat: 13.0827, lan: 80.2707 })

    let slide = useRef(null)

    let searchvalue = useRef(null)

    let flightmark = useRef([])

    let submitingdata = () => {
        setSearch(searchvalue.current.value)
    }

    useEffect(() => {

        let apicall = async () => {
            setApicheck(false)
            let api = await axios.get('https://opensky-network.org/api/states/all', {
                auth: { "clientId": "sonamanayakkar-api-client", "clientSecret": "HkORRn4pZKpoztKikNha6xxlGLNX2Arq" }
            })

            let final = api.data.states

            setApicheck(true)

            let india = final.filter((ele, idx) => {

                let country = ele[2]
                let ground = ele[8]
                let lat = ele[6]
                let long = ele[5]
                if (search == '' || search == 'india') {   //country
                    if (filter == 'All') {
                        return (
                            country == 'India' && lat !== null && long !== null
                        )
                    }

                    else if (filter == 'ground') {
                        return (
                            country == 'India' && ground && lat !== null && long !== null
                        )
                    }
                    else if (filter == 'sky') {
                        return (
                            country == 'India' && !ground && lat !== null && long !== null
                        )
                    }

                }

                else {
                    let text = search.toLowerCase()

                    if (filter == 'All') {
                        return (
                            country?.toLowerCase().includes(text) && lat !== null && long !== null
                        )
                    }

                    else if (filter == 'ground') {
                        return (
                            country?.toLowerCase().includes(text) && ground && lat !== null && long !== null
                        )
                    }
                    else if (filter == 'sky') {
                        return (
                            country?.toLowerCase().includes(text) && !ground && lat !== null && long !== null
                        )
                    }
                }


            })

            // console.log('one', india);

            setFlightdata(india)

        }

        apicall()
        console.log("hi");


    }, [search, filter])

    //object conversion
    let fil; //[{},{},{}]    main important
    if (flightdata && flightdata.length > 0) {

        fil = flightdata.map(ele => ({
            address:ele[0],
            region: ele[2],
            long: ele[5],
            lat: ele[6],
            degree: ele[10],
            onground: ele[8],
            speed: ele[9],
            cd: ele[11]
        }))

    }


    let createplaneicon = (angle) => {
        return L.divIcon({
            className: "custom-plane",
            html: `<div class="plane" style="transform: rotate(${angle}deg)">✈️</div>`,
            iconSize: [30, 30],
        })
    }

    let flightclick = (id) => {
        console.log(flightmark.current);


        flightmark.current.map((ele) => {
            if (ele != null) {
                ele.style.background = " rgb(255, 255, 255)"
            }
        })

        flightmark.current[id].scrollIntoView({ behavior: "smooth", block: "center" })
        flightmark.current[id].style.background = " rgb(137, 208, 255)"






    }




    let click = () => {
        if (toggle) {
            slide.current.style.top = "100%"
        }
        else {
            slide.current.style.top = "80px"
        }
        setToggle(!toggle)
    }




    // 13.0827, 80.2707
    return (
        <section>
            <div className="map">
                <MapContainer className='link' center={[13.0827, 80.2707]} zoom={5} style={{ width: "100%", height: "100vh" }}>
                    <TileLayer url={map} />

                    {flightdata && flightdata.length > 0 ? (

                        fil.map((ele, idx) => {
                            let lon = ele.long;
                            let lat = ele.lat;
                            return (<Marker Marker key={idx} position={[lat, lon]} icon={createplaneicon(ele.degree)} eventHandlers={{ click: () => flightclick(idx) }}>
                                <Popup>
                                    ✈️ {"aero" || "No Name"} <br />
                                    Country: {ele.region} <br />
                                    onground: {ele.onground} m/s <br />
                                    speed:{ele.speed}<br />
                                    cd: {ele.cd}
                                </Popup>
                            </Marker>
                            )
                        })
                    )
                        : (<p>no flight found</p>)
                    }
                </MapContainer>


                <div className="search">
                    
                    <input type="text" ref={searchvalue} placeholder='Search by country' name="" id="" />
                    <button onClick={submitingdata}><i class="fa-solid fa-magnifying-glass"></i></button>
                </div>

                <div className="totallists" ref={slide}>

                    <div className="filter">
                        <select name="" id="" onChange={(e) => setFilter(e.target.value)}>
                            <option value="All">All</option>
                            <option value="ground">On Ground</option>
                            <option value="sky">On Sky</option>
                        </select>
                    </div>

                    {apicheck ? (
                        flightdata && flightdata.length > 0 ? (

                            fil.filter(ele => ele.lat != null && ele.long != null)
                                .map((ele, idx) => (
                                    <div className="p" key={idx} ref={(e) => flightmark.current[idx] = e}>
                                        <div className="two f">
                                            <div className="l">
                                                <div className="small d-flex gap-3 align-items-center">
                                                    <div className="image">
                                                        <img src={flightlogo} alt="" />
                                                    </div>
                                                    <p className='m-0'>{ele.address}</p>
                                                </div>
                                                <div className="region">{ele.region}</div>


                                            </div>
                                            <div className="l d-flex gap-2 align-items-center">
                                                <div className="indication" style={ele.onground?{background:'rgb(255, 60, 0)'}:{background:'rgb(42, 255, 134)'}}></div>
                                                <p className='m-0'>Inair</p>
                                            </div>
                                        </div>
                                        <div className="two2 p-2 d-flex gap-4">
                                            <div className="r">
                                                <h5>Speed</h5>
                                                <h5>Status</h5>
                                                <h5>Movement</h5>
                                            </div>
                                            <div className="r">
                                                <h5 className='text-dark'>{ele.speed} kmPh</h5>
                                                <h5> {ele.onground == true ? 'Landed' : "Flying"}</h5>
                                                <h5>{ele.cd}</h5>
                                            </div>

                                        </div>
                                    </div>
                                ))

                        ) : (<p className=' fs-2 fw-bold' style={{ color: "red" }}>no data found</p>)
                    ) : (


                        <div class="spinner">
                            <div class="dot1"></div>
                            <div class="dot2"></div>
                            <div class="dot3"></div>
                        </div>
                    )
                    }

                    <div className="total d-flex gap-3 ">
                        <div className="flightimg"><img src={flightlogo} alt="" /></div>
                        <div className="count m-0 text-white">{flightdata.length}</div>
                    </div>




                </div>

                <div className="views">
                    <div className="r" onClick={() => setMap('https://tile.openstreetmap.org/{z}/{x}/{y}.png')}>
                        <img src={normal} alt="" />

                    </div>
                    <span>Default</span>
                    <div className="r" onClick={() => setMap('http://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}')}>
                        <img src={satilite} alt="" />

                    </div>
                    <span>Satilite</span>

                </div>

            </div>

            <div className="up" onClick={click}>
                <i className="fa-solid fa-angles-up"></i>
            </div>
        </section >
    );
}

export default Worldmap