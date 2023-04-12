import {useEffect, useRef} from 'react';
import {Loader} from '@googlemaps/js-api-loader';

import styles from '@/styles/GoogleMap.module.css'
import * as OSM from "osm-api"

const getSimpangan = (elem) => {
  console.log(elem)
  let mapNode = new Map();
  elem.forEach(element => {
    if (element['type'] == 'way') {
      element['nodes'].forEach(el => {
        // if (el.toString() == "5024785997") {
        //   console.log(mapNode.get(el.toString()))
        // }
        if (typeof(mapNode.get(el.toString())) !== "undefined") {
          mapNode.set(el.toString(), mapNode.get(el.toString()) + 1);
        } else {
          mapNode.set(el.toString(), 1);
        }
      }) 
      
      // new google.maps.Polyline({
      //   path : element['nodes'],
      //   strokeOpacity : "#FF0000"
      // })
    }
  });

  console.log(mapNode)
  mapNode.forEach(
    (v, k) => {
      if (v <= 1){
        mapNode.delete(k)
      }
    }
  )
  console.log(mapNode)

  mapNode.forEach(el => {
    if (el.toString() == "5024785997") {
        console.log(mapNode.get(el.toString()))
      }
    })
  // console.log(mapNode)
  return mapNode.keys()
}

const drawLines = (arrOfSimpangan, nodes, map) => {
  let nodesInLines = new Array()

  nodes.forEach(el => {
    if (el['type'] == 'way') {
      let coords = new Array()

      el['nodes'].forEach(e => {
        arrOfSimpangan.forEach(e1 => {
          if (e == e1['id']) {
            // console.log(e, e1['id'])
            coords.push({ lat : e1['lat'], lng : e1['lon']})

            if (el['nodes'].length > 1 && !nodesInLines.includes(e)) {
              nodesInLines.push(e)
            }
          }
        })
      })

      // console.log(coords)

      const pline = new google.maps.Polyline({
        path: coords,
        geodesic: true,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 2,
      });

      pline.setMap(map)
    }
  })

  // console.log("sebelum" + arrOfSimpangan.length)
  // console.log("sesudah" + nodesInLines.length)

  return nodesInLines
}

const drawNodes = (arrOfSimpangan, arrOfLines, map) => {
  arrOfSimpangan.forEach(e => {
    arrOfLines.forEach(e1 => {
      if (e['id'] == e1) {
        // const contentStr = 
        //   '<div>' +
        //   '<h2>Node</h2> <br/>' +
        //   `<div>${e['id']}</div>` +
        //   '</div>'

        const link = `https://www.openstreetmap.org/node/${e['id']}`

        const info = new google.maps.InfoWindow({
          content : link,
          ariaLabel : "tes"
        })

        const circle = new google.maps.Circle({
          strokeWeight : 0,
          fillColor : "#FF0F0F",
          fillOpacity : 1,
          map,
          radius : 2,
          center : new google.maps.LatLng(e['lat'], e['lon']),
        })

        circle.addListener("click", () =>  {
          window.alert(link)
          info.open({
            anchor : circle,
            map,
          })
        })
      }
    })
  })

  arrOfSimpangan.forEach(el => {
    
    if (el['id'] == 5024785997) {
        console.log('ini')
      }
    })
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
        // window.alert(mapsMouseEvent.latLng);
        const bound = map.getBounds()
        
        // window.alert(bound.getNorthEast().lat())
        // window.alert(bound.toString())
          const response = await fetch(`https://api.openstreetmap.org/api/0.6/map.json?bbox=${bound.getSouthWest().lng()},${bound.getSouthWest().lat()},${bound.getNorthEast().lng()},${bound.getNorthEast().lat()}`);
          // const response = await fetch('https://master.apis.dev.openstreetmap.org/api/0.6/map.json?bbox=11.54,48.14,11.543,48.145');
          console.log(response)
          const js = await response.json()
          console.log(js) // ambile elements
          const simpangan = getSimpangan(js["elements"])

          let arrOfSimpangan = new Array()
          for (const x of simpangan) {
            js['elements'].forEach(el => {
              if (el['type'] == 'node' && el['id'] == x) {
                console.log(el['id'], x)
                arrOfSimpangan.push(el)
              }
            })
          }

          console.log(arrOfSimpangan)

          // arrOfSimpangan.forEach(e => {
          //   // new google.maps.Marker({
          //   //   position: new google.maps.LatLng(e['lat'], e['lon']),
          //   //   map,
          //   //   title : `${e['user']}`
          //   // })
          // })

          const nodeInLines = drawLines(arrOfSimpangan, js['elements'], map)
          drawNodes(arrOfSimpangan, nodeInLines, map)
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