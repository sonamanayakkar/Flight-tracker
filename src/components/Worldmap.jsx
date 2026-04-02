import React, { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import india from '../components/images/india.jpg'
import flightlogo from './images/flightlogo.png'

import satilite from './images/satilite.jpg'
import normal from './images/normal.jpg'
import './styles/world.css'
import axios from 'axios'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
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
    let [refresh, setRefresh] = useState(false)

    let [live, setLive] = useState({ lat: 20, long: 77, zoom: 5, mark: false })

    let [checkweather, setWeather] = useState({ condition: false, index: 0 })
    let [weatherdata, setWeatherdata] = useState({})




    let slide = useRef(null)

    let searchvalue = useRef(null)

    let flightmark = useRef([])
    let flightmarkinsidemap = useRef([])

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
            let api = await axios.get('/opensky/api/states/all', {
                auth: { "clientId":"sonamanayakkar-api-client","clientSecret":"zXIpuzwZvxb9GNEyVfJVDZA8gftSfdRl" }
            })

            let final = api.data.states

            setApicheck(true)

            setFlightdata(final)



        }



        apicall()


    }, [refresh])

    //object conversion

    useEffect(() => {


        //[{},{},{}]    main important
        if (flightdata && flightdata.length > 0) {
            let filterbycountry = flightdata.filter((ele, idx) => {
                let country = ele[2]
                let ground = ele[8]
                let lat = ele[6]
                let long = ele[5]
                let time = ele[3]
                let height = ele[13]
                if (search == '' || search == "india") {
                    if (filter == 'All') {

                        return country == 'India' && lat !== null && long !== null && time !== null
                    }
                    else if (filter == "ground") {
                        return country == 'India' && ground && lat !== null && long !== null && time !== null
                    }
                    else if (filter == "sky") {
                        return country == 'India' && !ground && lat !== null && long !== null && time !== null && height !== null
                    }
                }
                else {
                    let text = search.toLowerCase()

                    if (filter == 'All') {
                        return country?.toLowerCase().includes(text) && lat !== null && long !== null && time !== null
                    }
                    else if (filter == "ground") {
                        return country?.toLowerCase().includes(text) && ground && lat !== null && long !== null && time !== null
                    }
                    else if (filter == "sky") {
                        return country?.toLowerCase().includes(text) && !ground && lat !== null && long !== null && time !== null && height !== null
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
                speed: parseInt((ele[9]) * 3.6),
                cd: ele[11],
                height: parseInt(ele[13] * 3.28084)
            }))



            setFiltereddata(fil)

        }
    }, [flightdata, search, filter])



    let createplaneicon = (angle, logo1, logo2, ground) => {

        return L.divIcon({
            className: "custom-plane",
            html: `<div class="plane" style="transform: rotate(${angle}deg)">${ground ? `<img src=${logo1} alt='plane'/>` : `<img src=${logo2} alt='plane'/>`}</div>`,
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
                flightmark.current[id].style.boxShadow = '0px 0px 10px 5px rgb(0, 157, 255)'
            }
        })



        flightmark.current[id].scrollIntoView({ behavior: "smooth", block: "center" })
        flightmark.current[id].style.boxShadow = '0px 0px 10px 5px rgba(0, 157, 255, 0.38)'





        setToggle(!toggle)
        slide.current.style.left = "10px"
        setLat({ lat: lon, long: lat, zoom: 10 })


    }

    let flightlistclick = (idx, lat, lon) => {
        setLive({ lat: 20, long: 77, zoom: 5, mark: false })
        setLat({ lat: lat, long: lon, zoom: 15 })
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


    let weather = (condition, idx, lat, long) => {



        setWeather({ condition: condition, index: idx })

        if (condition) {

          
            let apicall2 = async () => {
                let weather = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=6d5537c504000fa78943d8d8ca819aa1`,
                )


                let weatherdata = weather.data.weather[0]
                let winddata = weather.data.wind
                let visibility = weather.data.visibility
                let main = weather.data.main


                let weatherobj = {
                    description: weatherdata.description,
                    icon: weatherdata.icon,
                    windspeed:parseInt( (winddata.speed) * 3.6),
                    degree: winddata.deg,
                    visibility: (visibility) / 1000,
                    temperature: parseInt((main.temp) - 273.15),
                    pressure: main.pressure,
                    humidity: main.humidity
                }
                setWeatherdata(weatherobj)


            }

            apicall2()


        }
        else {
            setWeather({ condition: condition, index: idx })
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



                    <Mark datas={{ filtereddata, createplaneicon, flightclick, flightmarkinsidemap }} />

                    {live.mark ? (<Marker position={[live.lat, live.long]} icon={createliveicon()}>
                    </Marker>) : null}


                </MapContainer>


                <div className="search">
                    <div className="inputs">
                        <input type="text" ref={searchvalue} placeholder='Search by country' name="" id="" />
                        <button onClick={submitingdata}><i className="fa-solid fa-magnifying-glass"></i></button>
                    </div>

                    <div className="refresh" onClick={() => setRefresh((e) => !e)}><i className="fa-solid fa-arrows-rotate"></i></div>
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
                                <AnimatePresence mode='wait' key={idx}>
                                    {checkweather.condition && checkweather.index == idx ?

                                        <motion.div key={`weather-${idx}`} initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.5 }}>
                                            <div className="weathercard p" ref={(e) => flightmark.current[idx] = e} onClick={() => flightlistclick(idx, ele.lat, ele.long)}>
                                                <div className="two f">
                                                    <div className="l">
                                                        <div className="small d-flex gap-3 align-items-center">
                                                            <div className="image">
                                                                <img src={`https://openweathermap.org/img/wn/${weatherdata.icon}.png`} alt="" />
                                                            </div>
                                                            <p className='m-0'>{weatherdata.description}</p>

                                                        </div>
                                                        <div className="region"></div>


                                                    </div>
                                                    <div className="l">
                                                        <div className="small d-flex gap-3 align-items-center">
                                                            {/* <div className="image">
                                                        <img src={flightlogo} alt="" />
                                                    </div> */}
                                                            <p className='m-0'>{ele.address}</p>
                                                        </div>
                                                        {/* <div className="region">{ele.region}</div> */}


                                                    </div>

                                                </div>
                                                <div className="two2 p-3 d-flex gap-4">
                                                    <div className="r">
                                                        <h5><i className="fa-solid fa-temperature-low me-2"></i>Temperature</h5>
                                                        <h5><i className="fa-solid fa-wind me-2"></i>Wind Speed</h5>
                                                        <h5><i className="fa-solid fa-compass me-2"></i>Degree</h5>
                                                        <h5><i className="fa-solid fa-eye-low-vision me-2"></i>Visibility</h5>
                                                        <h5><i className="fa-solid fa-gauge-high me-2"></i>Pressure</h5>
                                                        <h5><i className="fa-solid fa-droplet me-2"></i>Humidity</h5>
                                                    </div>
                                                    <div className="r">
                                                        <h5 className=''>{weatherdata.temperature} <sup>0</sup>C </h5>
                                                        <h5 className=''>{weatherdata.windspeed} km/h</h5>
                                                        <h5 className=''>{weatherdata.degree} </h5>
                                                        <h5>{weatherdata.visibility} km</h5>
                                                        <h5>{weatherdata.pressure}  hPa</h5>
                                                        <h5>{weatherdata.humidity}  %</h5>
                                                    </div>

                                                    <div className="checkweather" onClick={() => weather(false, idx, ele.lat, ele.long)}>
                                                        <p className='m-0 '><i className="fa-solid fa-xmark"></i></p>
                                                    </div>

                                                </div>
                                            </div></motion.div> :
                                        (

                                            <motion.div key={`flight-${idx}`} initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                                                <div className="p" ref={(e) => flightmark.current[idx] = e} onClick={() => flightlistclick(idx, ele.lat, ele.long)}>

                                                    <div className="two f">
                                                        <div className="l">
                                                            <div className="small d-flex gap-3 align-items-center">
                                                                <div className="image">
                                                                    <img src={flightlogo} alt="" />
                                                                </div>
                                                                <p className='m-0'>{ele.address}</p>
                                                            </div>
                                                            <div className="region"><p className='countryname'>{ele.region}</p></div>


                                                        </div>
                                                        <div className="l d-flex gap-2 align-items-center">
                                                            <div className="indication" style={ele.onground ? { background: 'rgb(255, 60, 0)' } : { background: 'rgb(42, 255, 134)' }}></div>
                                                            <p className='m-0'>Inair</p>
                                                        </div>
                                                    </div>
                                                    <div className="two2 p-3 d-flex gap-4">
                                                        <div className="r">
                                                            <h5>Speed</h5>
                                                            <h5>Altitude</h5>
                                                            <h5>Status</h5>
                                                            <h5>Movement</h5>
                                                        </div>
                                                        <div className="r">
                                                            <h5 className=''>{(ele.speed)} km/h</h5>
                                                            <h5 className=''>{(ele.height)} ft</h5>
                                                            <h5> {ele.onground == true ? 'Landed' : "Flying"}</h5>
                                                            <h5>{ele.cd}</h5>
                                                        </div>

                                                        <div className="checkweather" onClick={() => weather(true, idx, ele.lat, ele.long)}>
                                                            <p className='m-0 '><i className="fa-solid fa-cloud-sun"></i> weather</p>
                                                        </div>

                                                    </div>
                                                </div>
                                            </motion.div>

                                        )
                                    }
                                </AnimatePresence>

                            ))

                        ) : (<p className='p fs-3 fw-bold p-3 text-center' style={{ color: "" }}>no data found<i className="ms-2 fa-solid fa-file-circle-xmark"></i></p>)
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