"use client"

import debounce from "lodash.debounce"

import {useRef} from 'react';
import type {MapRef} from 'react-map-gl';

import Map, {  GeolocateControl, Source, Layer, useMap} from 'react-map-gl';
import SearchBar from '@/components/SearchBar';
import EventCard from '@/components/EventCard';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useState, useCallback, useEffect } from 'react';
import toGeoJSONHelper from '@/lib/toGeoJSON';

import type {CircleLayer} from 'react-map-gl';
import type {FeatureCollection} from 'geojson';

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

function BaseMap() {
  const {current: map} = useMap();
  const [viewState, setViewState] = useState({
    longitude: -73.95589136975939,
    latitude:40.81375534914457,
    zoom: 14,
    pitch: 25,
    bearing: 50,
  })

  const [geoJSON, setGeoJSON] = useState<FeatureCollection>({type: 'FeatureCollection', features: []})  
  const layerStyle : CircleLayer  = {
    id: "data",
    source: "geojson",
    type: "circle",
    paint: {
      'circle-color': '#4264fb',
      'circle-radius': 8,
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff'
    }
  };
  // Search Logic
  const getSearchResults = async (searchTerm: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/data?searchTerm=${searchTerm}`);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      return data
    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
    }
  }

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] =  useState<string[]>([]);

  const request = debounce(async (searchTerm : string) => {
      const results = await getSearchResults(searchTerm)
      setGeoJSON(results)
    },1000 //debounce time
  )

  const debouncedRequest = useCallback(
    (searchTerm: string)=> request(searchTerm), 
    []
  )


  //
  const onChange = (e) => {
    setSearchTerm(e.target.value); // constrolled input value 
    debouncedRequest(e.target.value)
  };

  // Hovering Logic
  const [hoverInfo, setHoverInfo] = useState(null);

  const onHover = useCallback(event => {
    const {
      features,
      point: {x, y}
    } = event;
    const hoveredFeature = features && features[0];
    // prettier-ignore
    setHoverInfo(hoveredFeature && {feature: hoveredFeature, x, y});
  }, []);

  const layerClick = e =>{
    map?.flyTo({
        center: e.features[0].geometry.coordinates
    });
    
  }


  return (
    <Map 
    mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
    initialViewState={viewState}
    onMove={(evt) => setViewState(evt.viewState)}
    onMouseMove={onHover}
    mapStyle="mapbox://styles/mapbox/dark-v11"
    onClick={layerClick} //Add once the interactive element is added
    interactiveLayerIds={['data']}
  >
  
  <div className="flex gap-4 p-2 fixed min-w-[400px]">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={onChange}
        className="bg-gray-200 border min-w-[300px] border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-1"
      />
    </div>

  <GeolocateControl position="top-right" />
  <Source type="geojson" data={geoJSON}>
        <Layer {...layerStyle} />
    </Source>

    {hoverInfo && (
     <div className="relative w-64 h-32"
      style={{top: `${hoverInfo.y}px`, left: `${hoverInfo.x}px`}}
    >
      < EventCard features={hoverInfo.feature.properties} image_urls={hoverInfo}/> 
      </div>
    )}
  </Map>
  )
}

export default BaseMap
