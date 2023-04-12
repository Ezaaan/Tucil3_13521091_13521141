import {useEffect, useRef} from 'react';
import {Loader} from '@googlemaps/js-api-loader';

import styles from '@/styles/GoogleMap.module.css'

const getSimpangan = (elem) => {
  // console.log(elem)
  let mapNode = new Map();
  elem.forEach(element => {
    if (element['type'] == 'way') {
      element['nodes'].forEach(el => {
        if (typeof(mapNode.get(el.toString())) !== "undefined") {
          mapNode.set(el.toString(), mapNode.get(el.toString()) + 1);
        } else {
          mapNode.set(el.toString(), 1);
        }
      })        
    }
  });

  // console.log(mapNode.entries())
  mapNode.forEach(
    (v, k) => {
      if (v <= 1){
        mapNode.delete(k)
      }
    }
  )
  // console.log(mapNode)
  return mapNode
}

const GoogleMap = () => {

  const googlemap = useRef(null);
  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
      version: 'weekly',
    });
    let map;
    loader.load().then(() => {
      const google = window.google;
      map = new google.maps.Map(googlemap.current, {
        center: {lat: -6.89113, lng: 107.60878},
        //https://api.openstreetmap.org/api/0.6/map?bbox=11.54,48.14,11.543,48.145
        // https://master.apis.dev.openstreetmap.org/export#map=17/-6.89113/107.60878
        //https://master.apis.dev.openstreetmap.org/api/0.6/map?bbox=11.54,48.14,11.543,48.145
        //https://api.openstreetmap.org/api/0.6/map?bbox=107,-6,107.1,-5.9
        zoom: 17,
      });

      map.addListener("click", async (mapsMouseEvent) => {
        window.alert(mapsMouseEvent.latLng);
        const bound = map.getBounds()
        
        window.alert(bound.getNorthEast().lat())
        // window.alert(bound.toString())
          // const response = await fetch(`https://api.openstreetmap.org/api/0.6/map.json?bbox=${bound.getSouthWest().lng()},${bound.getSouthWest().lat()},${bound.getNorthEast().lng()},${bound.getNorthEast().lat()}`);
          const response = await fetch('https://master.apis.dev.openstreetmap.org/api/0.6/map.json?bbox=11.54,48.14,11.543,48.145');
          console.log(response)
          const js = await response.json()
          console.log(js) // ambile elements
          getSimpangan(js["elements"])
      })
      
    });

    
  });

  // const userAction = async () => {
    // const response = await fetch('https://master.apis.dev.openstreetmap.org/api/0.6/map.json?bbox=11.54,48.14,11.543,48.145');
  //   console.log(response)
  //   const myJson = await response.json(); //extract JSON from the http response
  //   // do something with myJson
  //   console.log(myJson)
  // }
  // {/* <button onClick={userAction}>ASDJKAJDASHDJH</button> */}
  return (
    
      <div id={styles.map} ref={googlemap}/>
    
    
  );
}

export default GoogleMap;