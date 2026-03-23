import React, { useEffect, useMemo, useRef, useState } from 'react'
import india from '../components/images/india.jpg'
import flightlogo from './images/flightlogo.png'
import satilite from './images/satilite.jpg'
import normal from './images/normal.jpg'
import './styles/world.css'
import axios from 'axios'
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css"
import L from 'leaflet'
import { useMap } from "react-leaflet";
import Mark from './Mark'


const Worldmap = () => {

    let [flightdata, setFlightdata] = useState([])  //flight data
    let [filtereddata, setFiltereddata] = useState({})
    let [search, setSearch] = useState('')    //search value
    let [filter, setFilter] = useState('All')  // filter value
    let [toggle, setToggle] = useState(false)  // toggle btn
    let [apicheck, setApicheck] = useState(false) //api check
    let [map, setMap] = useState('http://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}')  //maps
    let [lat, setLat] = useState({ lat: 20, long: 77, zoom: 5 })  //map zoom view
    let [countries, setCountries] = useState([])      //country data

    let [live, setLive] = useState({ lat: 20, long: 77, zoom: 5, mark: false })




    let slide = useRef(null)

    let searchvalue = useRef(null)

    let flightmark = useRef([])

    let submitingdata = () => {
        setSearch(searchvalue.current.value)
        setLive({ lat: 20, long: 77, zoom: 5, mark: false })
    }

    useEffect(() => {
        let countryapi = async () => {
            let api2 = await axios.get('https://countriesnow.space/api/v0.1/countries/positions')
            let mark_informations = api2.data.data

            setCountries(mark_informations)

        }

        countryapi()
    }, [])

    const countriesdata = useMemo(() => {

        return countries.filter((ele, idx) => {
            if (search == "" || search == "India") {
                return (
                    ele.name == 'India' && ele.lat != null && ele.long != null
                )
            }
            else {
                let s = search.toLowerCase()

                return (
                    ele.name?.toLowerCase() == s && ele.lat != null && ele.long != null
                )
            }
        })

    }, [search, countries])

    useEffect(() => {
        if (countriesdata.length > 0) {
            setLat({ ...countriesdata[0], zoom: 5 })
        }
        else {
            setLat({ lat: 20, long: 77, zoom: 2 })
        }
    }, [countriesdata])

    useEffect(() => {

        let apicall = async () => {
            setApicheck(false)
            let api = await axios.get('https://opensky-network.org/api/states/all', {
                auth: { "clientId": "sonamanayakkar-api-client", "clientSecret": "HkORRn4pZKpoztKikNha6xxlGLNX2Arq" }
            })

            let final = api.data.states

            setApicheck(true)

            setFlightdata(final)



        }

        apicall()

    }, [])

    //object conversion

    useEffect(() => {


        //[{},{},{}]    main important
        if (flightdata && flightdata.length > 0) {
            let filterbycountry = flightdata.filter((ele, idx) => {
                let country = ele[2]
                let ground = ele[8]
                let lat = ele[6]
                let long = ele[5]
                if (search == '' || search == "india") {
                    if (filter == 'All') {

                        return country == 'India' && lat !== null && long !== null
                    }
                    else if (filter == "ground") {
                        return country == 'India' && ground && lat !== null && long !== null
                    }
                    else if (filter == "sky") {
                        return country == 'India' && !ground && lat !== null && long !== null
                    }
                }
                else {
                    let text = search.toLowerCase()

                    if (filter == 'All') {
                        return country?.toLowerCase().includes(text) && lat !== null && long !== null
                    }
                    else if (filter == "ground") {
                        return country?.toLowerCase().includes(text) && ground && lat !== null && long !== null
                    }
                    else if (filter == "sky") {
                        return country?.toLowerCase().includes(text) && !ground && lat !== null && long !== null
                    }
                }
            })


            let fil = filterbycountry.map(ele => ({
                address: ele[1],
                region: ele[2],
                long: ele[5],
                lat: ele[6],
                degree: ele[10],
                onground: ele[8],
                speed: ele[9],
                cd: ele[11]
            }))



            setFiltereddata(fil)

        }
    }, [flightdata, search, filter])



    let createplaneicon = (angle, logo) => {
        return L.divIcon({
            className: "custom-plane",
            html: `<div class="plane" style="transform: rotate(${angle}deg)"><img src=${logo} alt='plane'/></div>`,
            iconSize: [30, 30],
        })
    }
    let createliveicon = () => {


        return L.divIcon({
            className: "custom-plane",
            html: `<div class="plane" >📍</div>`,
            iconSize: [30, 30],
        })
    }

    let flightclick = (id, lat, lon) => {
        // console.log(flightmark.current);

        setLive({ lat: 20, long: 77, zoom: 5, mark: false })
        flightmark.current.map((ele) => {
            if (ele != null) {
                ele.style.background = " rgb(255, 255, 255)"
            }
        })

        flightmark.current[id].scrollIntoView({ behavior: "smooth", block: "center" })
        flightmark.current[id].style.background = " rgb(137, 208, 255)"

        setToggle(!toggle)
        slide.current.style.left = "10px"
        setLat({ lat: lon, long: lat, zoom: 10 })


    }




    let click = () => {
        if (window.innerWidth < 800) {
            if (toggle) {
                slide.current.style.left = "10px"
            }
            else {
                slide.current.style.left = "-100%"
            }
            setToggle(!toggle)
        }


    }



    const MoveMap = ({ lat, long, zoom }) => {
        const map = useMap();

        useEffect(() => {
            if (lat && long) {
                map.flyTo([lat, long], zoom);
            }
        }, [lat, long]);

        return null;
    };

    //location

    let mylocation = () => {

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    let lat = position.coords.latitude;
                    let lng = position.coords.longitude;

                    // console.log(lat, lng);
                    // console.log(position.coords.accuracy)
                    setLive({ lat: lat, long: lng, zoom: 10, mark: true }); // store in state
                },
                (error) => {
                    console.error("Error getting location:", error);
                }, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }

            );
        } else {
            alert("Geolocation not supported");
        }
    }

    // 13.0827, 80.2707
    return (
        <section>
            <div className="map">
                <MapContainer className='link' center={[20, 77]} zoom={5} style={{ width: "100%", height: "100vh" }}>
                    <TileLayer url={map} />

                    <MoveMap
                        lat={live.mark ? live.lat : lat.lat}
                        long={live.mark ? live.long : lat.long}
                        zoom={live.mark ? live.zoom : lat.zoom}
                    />



                    <Mark datas={{ filtereddata, createplaneicon, flightclick }} />

                    {live.mark ? (<Marker position={[live.lat, live.long]} icon={createliveicon()}>
                    </Marker>) : null}


                </MapContainer>


                <div className="search">

                    <input type="text" ref={searchvalue} placeholder='Search by country' name="" id="" />
                    <button onClick={submitingdata}><i className="fa-solid fa-magnifying-glass"></i></button>
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
                        filtereddata && filtereddata.length > 0 ? (
                            filtereddata.map((ele, idx) => (
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
                                            <div className="indication" style={ele.onground ? { background: 'rgb(255, 60, 0)' } : { background: 'rgb(42, 255, 134)' }}></div>
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


                        <div className="spinner">
                            <div className="dot1"></div>
                            <div className="dot2"></div>
                            <div className="dot3"></div>
                        </div>
                    )
                    }






                </div>
                <div className="total d-flex gap-3 ">
                    <div className="flightimg"><img src={flightlogo} alt="" /></div>
                    <div className="count m-0 text-white">{filtereddata.length}</div>
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
                <div className="location" onClick={mylocation}><i className="fa-solid fa-location-crosshairs"></i></div>

            </div>

            <div className="up" onClick={click}>
                {toggle ? (<i className="fa-solid fa-angles-right"></i>) : (<i className="fa-solid fa-angles-left"></i>)}

            </div>
        </section >
    );
}

export default Worldmap