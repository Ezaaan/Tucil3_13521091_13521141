import {useEffect, useRef, useState} from 'react';
import {Loader} from '@googlemaps/js-api-loader';

import styles from '@/styles/GoogleMap.module.css'
import * as OSM from "osm-api"
import getSolution from '../script';

const getSimpangan = (elem) => {
  // console.log(elem)
  let mapNode = new Map();
  elem.forEach(element => {
    if (element['type'] == 'way') {
      // console.log(element['tags'])
      if (!element.hasOwnProperty('tags') ||
        (element.hasOwnProperty('tags') && 
        !(
          // (
          //   element['tags'].hasOwnProperty('highway') && 
          //   (
          //     element['tags']['highway'] == 'footway' ||
          //     element['tags']['highway'] == 'bridleway' ||
          //     element['tags']['highway'] == 'steps' ||
          //     element['tags']['highway'] == 'corridor' ||
          //     element['tags']['highway'] == 'path' ||
          //     element['tags']['highway'] == 'via_ferrata'
          //   )
          // )
          //   || 
          // (
          //   element['tags'].hasOwnProperty('building') 
          //   || element['tags'].hasOwnProperty('amenity') 
          //   || element['tags'].hasOwnProperty('waterway')
          //   || element['tags'].hasOwnProperty('leisure')
          //   || element['tags'].hasOwnProperty('landuse')
          // )
          //   ||
          // (
          //   element['tags'].hasOwnProperty('natural') ||
          //   element['tags'].hasOwnProperty('water') 
          // )
          element['tags'].hasOwnProperty('highway') && (
            element['tags']['highway'] == 'motorway' ||
            element['tags']['highway'] == 'trunk' ||
            element['tags']['highway'] == 'primary' ||
            element['tags']['highway'] == 'secondary' ||
            element['tags']['highway'] == 'tertiary' ||
            element['tags']['highway'] == 'unclassified' ||
            element['tags']['highway'] == 'residential'
          )
        ))
        ) {
        return
      }

      element['nodes'].forEach(el => {
        if (typeof(mapNode.get(el.toString())) !== "undefined" && element['nodes'].filter(x => x == el).length == 1) {
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

  let result = new Array()
  // console.log(mapNode)
  mapNode.forEach(
    (v, k) => {
      if (v > 1){
        // mapNode.delete(k)
        result.push(k)
        // if (k == 5024785997) {
        //   // console.log(k, v)
        // }
      }
    }
  )
  // console.log(mapNode)
  // console.log(result)

  mapNode.forEach(el => {
    if (el == "5024785997") {
      // console.log(el)
      //   console.log(mapNode.get(el.toString()))
      }
    })
  // console.log(mapNode)
  return result
}



const calculateDistance = (paths) => {
  let lastPath;
  let subMatDist = new Set()

  const getEuclid = (a, b) => {
    return Math.sqrt(Math.pow(Math.abs(a['lat'] - b['lat']), 2) + Math.pow(Math.abs(a['lon'] - b['lon']), 2))
  }

  paths.forEach(e => {
    if (typeof(lastPath) == "undefined") {
      lastPath = e 
      return
    }
    
    subMatDist.add(
        Number(e['id']) < Number(lastPath['id']) ?
          [e['id'].toString(), lastPath['id'].toString(), getEuclid(e, lastPath).toString()]
          :
          [lastPath['id'].toString(), e['id'].toString(), getEuclid(e, lastPath).toString()]
      )
    lastPath = e
  })

  return subMatDist
}

const getNodesName = (pathsName) => {
  // pathsName = pathsName.filter(e => !set.has(e))

  return pathsName.map(e => e['id'].toString())
}

const getNodesCoord = (pathsName) => {
  // pathsName = pathsName.filter(e => !set.has(e))

  return pathsName.map(e => {
      return { 
        name : e['id'].toString(),
        X : e['lon'],
        Y : e['lat']
      }
    })
}

const drawLines = (arrOfSimpangan, nodes, map) => {
  let nodesInLines = new Array()
  let edgeMatrix = new Set()
  let nodesNameMatrix = new Set()
  let nodesCoordMatrix = new Set()

  nodes.forEach(el => {
    if (el['type'] == 'way') {
      let coords = new Array()

      el['nodes'].forEach(e => {
        arrOfSimpangan.forEach(e1 => {
          if (e == e1['id']) {
            // console.log(e, e1['id'])
            coords.push(e1)

            if (el['nodes'].length > 1 && !nodesInLines.includes(e)) {
              nodesInLines.push(e)
            }
          }
        })
      })

      // console.log(coords)

      const pline = new google.maps.Polyline({
        path: coords.map(i => { 
          return {lat : i['lat'], lng : i['lon']}
        }),
        geodesic: true,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 2,
      });

      if (coords.length > 1) {
        edgeMatrix.add(...calculateDistance(coords))

        nodesNameMatrix.add(...getNodesName(coords))
        nodesCoordMatrix.add(...getNodesCoord(coords))
      }

      // console.log(coords)
    
      pline.setMap(map)
    }
  })

  // console.log("sebelum" + arrOfSimpangan.length)
  // console.log("sesudah" + nodesInLines.length)

  console.log(nodesInLines, edgeMatrix, nodesNameMatrix)
  return {
    nodesInLines : nodesInLines, 
    edgeMatrix : Array.from(edgeMatrix),
    nodesNameMatrix : Array.from(nodesNameMatrix), 
    nodesCoordMatrix : Array.from(nodesCoordMatrix)
  }
}

const drawNodes = (arrOfSimpangan, arrOfLines, map) => {
  // console.log(arrOfLines)
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

        

        // console.log('snode1', e['id'], e['lat'], e['lon'])

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
}

const drawStart = (startNode, map, i) => {
  
  // console.log('snode', startNode['name'], startNode['Y'], startNode['X'])
  
  const z = new window.google.maps.Circle({
    strokeWeight : 0,
    fillColor : `#0000FF`,
    fillOpacity : 1,
    map : map,
    radius : 8,
    center : new google.maps.LatLng(startNode['Y'], startNode['X']),
  });
  

  z.addListener("click", () =>  {
    window.alert(i)
    info.open({
      anchor : circle,
      map,
    });
  })

  
}

const GoogleMap = () => {
  const googlemap = useRef(null);
  let [definedNode, setDefinedNode] = useState();


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
        zoom: 18,
        mapTypeId : "OSM",
        disableDefaultUI : true
      });

      map.mapTypes.set("OSM", new google.maps.ImageMapType({
          getTileUrl: function(coord, zoom) {
              var tilesPerGlobe = 1 << zoom;
              var x = coord.x % tilesPerGlobe;
              if (x < 0) {
                  x = tilesPerGlobe+x;
              }
              return "https://tile.openstreetmap.org/" + zoom + "/" + x + "/" + coord.y + ".png";
          },
          tileSize: new google.maps.Size(256, 256),
          name: "OpenStreetMap",
          maxZoom: 19.5,
          minZoom: 16
      }));

      map.addListener("dragend", async (mapsMouseEvent) => {
        // window.alert(mapsMouseEvent.latLng);
        const bound = map.getBounds()
        
        // window.alert(bound.getNorthEast().lat())
        // window.alert(bound.toString())
        console.log('fetching data ...')
          const response = await fetch(`https://api.openstreetmap.org/api/0.6/map.json?bbox=${bound.getSouthWest().lng()},${bound.getSouthWest().lat()},${bound.getNorthEast().lng()},${bound.getNorthEast().lat()}`)
          
          // const response = await fetch('https://master.apis.dev.openstreetmap.org/api/0.6/map.json?bbox=11.54,48.14,11.543,48.145');
          console.log(response)
          const js = await response.json().then(console.log('data fetched.'));
          console.log(js) // ambile elements
          const simpangan = getSimpangan(js["elements"])

          let arrOfSimpangan = new Array()
          for (const x of simpangan) {
            js['elements'].forEach(el => {
              if (el['type'] == 'node' && el['id'] == x) {
                // console.log(el['id'], x)
                arrOfSimpangan.push(el)
              }
            })
          }

          console.log('calculatiion done')

          console.log("final : " + arrOfSimpangan)
          // console.log(arrOfSimpangan[0])

          // arrOfSimpangan.forEach(e => {
          //   // new google.maps.Marker({
          //   //   position: new google.maps.LatLng(e['lat'], e['lon']),
          //   //   map,
          //   //   title : `${e['user']}`
          //   // })
          // })

          const {nodesInLines, edgeMatrix, nodesNameMatrix, nodesCoordMatrix} = drawLines(arrOfSimpangan, js['elements'], map)
  
          console.log(nodesInLines, edgeMatrix, nodesNameMatrix)
          // drawStart(nodesCoordMatrix[0], map)
          drawNodes(arrOfSimpangan, nodesInLines, map)

          for(let i = 0; i < 2; i++) {
            drawStart(nodesCoordMatrix[i], map, i)
          }          

          
          getSolution(edgeMatrix, 
            nodesNameMatrix,
            nodesCoordMatrix,
            nodesNameMatrix[0],
            nodesNameMatrix[1],
            'A*'
            )
          
          
          
          // setDefinedNode(arrOfSimpangan)
          // console.log(definedNode)
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