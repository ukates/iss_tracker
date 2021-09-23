import React, {useState, useRef, useEffect} from "react";
import './App.css';
import mapboxgl  from "mapbox-gl";
mapboxgl.accessToken = 'pk.eyJ1IjoidWthdGVzIiwiYSI6ImNrcjlsbjh0MzJwZDUybnJ6NXU5YTRpZHQifQ._tUfP3-piOiB12vzkTEkWA';


function App() {
  const [location, setLocation] = useState({});

  const mapContainer = useRef(null); 
  const map = useRef(null); 
  const [lng, setLng] = useState(-70.9); 
  const [lat, setLat] = useState(42.35); 
  const [zoom, setZoom] = useState(4);
  const [center, setCenter] = useState([lng, lat]) 

  useEffect(() => {
    if(map.current) return; 
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: center, 
      zoom: zoom
    });
    });

    useEffect(() => {
      if (!map.current) return; // wait for map to initialize
      map.current.on('move', () => {
        setLng(map.current.getCenter().lng.toFixed(4));
        setLat(map.current.getCenter().lat.toFixed(4));
        setZoom(map.current.getZoom().toFixed(2));
      });
    });

  useEffect(() => {
    fetch("http://api.open-notify.org/iss-now.json")
      .then(res => res.json())
      .then(result => {
        setLocation(result)
      });
      map.current.setCenter([lng, lat])
  });

  const update = () => {
    setLng(location.iss_position.longitude)
    setLat(location.iss_position.latitude)
    setCenter([lng, lat])
    console.log({center})
  }

  return (
    <div className="App">
      <header>
        <h1>International Space Station Tracker</h1>
      </header>
      <button className="locate-button" type="submit" onClick={update}>Click to Locate</button>
        <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
        <div ref={mapContainer} className="map-container" />
      </div>
  );
}

export default App;
