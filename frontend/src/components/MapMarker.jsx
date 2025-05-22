import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon } from "react-leaflet";
import L from "leaflet";
import { useNavigate, useParams } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import postStore from "../store/postStore";
import { observer } from "mobx-react-lite";
import "./styles/mapMarker.css";

const icon = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export const MapMarker = observer(() => {
  const { latitude, longitude } = useParams();
  const nav = useNavigate();
  const [showPoly, setShowPoly] = useState(false);
  const [colorMap, setColorMap] = useState([]);

  useEffect(() => {
    postStore.setLimit(100);
    postStore.getPosts();
  }, []);

  const parseCoordinate = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? null : num;
  };

  const lat = parseCoordinate(latitude);
  const lng = parseCoordinate(longitude);

  const defaultPosition = [43.3188, 45.6865];
  const position = (lat && lng) ? [lat, lng] : defaultPosition;

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const validPosts = useMemo(() => postStore.posts.filter(post =>
    post.latitude && post.longitude &&
    !isNaN(post.latitude) && !isNaN(post.longitude)
  ), [postStore.posts]);

  const groupedPosts = useMemo(() => {
    return validPosts.reduce((acc, post) => {
      const key = `${post.latitude},${post.longitude}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(post);
      return acc;
    }, {});
  }, [validPosts]);

  const groupedByTags = useMemo(() => {
    return validPosts.reduce((acc, post) => {
      post.tags?.forEach(tag => {
        if (!acc[tag]) acc[tag] = [];
        acc[tag].push(post);
      });
      return acc;
    }, {});
  }, [validPosts]);

  useEffect(() => {
    if (showPoly && colorMap.length === 0) {
      const colors = Object.keys(groupedByTags).map(tag => ({
        tag,
        color: getRandomColor()
      }));
      setColorMap(colors);
    }
  }, [showPoly, groupedByTags, colorMap]);

  const polygons = useMemo(() => {
    if (!showPoly || lat) return null;
    return Object.entries(groupedByTags).map(([tag, posts]) => {
      const coordinates = posts.map(post => [post.latitude, post.longitude]);
      const colorObj = colorMap.find(item => item.tag === tag);
      const color = colorObj?.color || '#000000';

      return (
        <Polygon
          key={tag}
          positions={coordinates}
          pathOptions={{
            color,
            fillColor: color,
            fillOpacity: 0.4,
          }}
        />
      );
    });
  }, [showPoly, groupedByTags, colorMap, lat]);

  return (
    <>
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          url="https://maps.geoapify.com/v1/tile/maptiler-3d/{z}/{x}/{y}.png?&apiKey=35d30b48231643c69db94ee00e5ca9e0"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {lat && lng && (
          <Marker position={position} icon={icon}>
          </Marker>
        )}

        {!lat && Object.entries(groupedPosts).map(([key, posts]) => {
          const [lat, lng] = key.split(",").map(Number);
          return (
            <Marker key={key} position={[lat, lng]} icon={icon}>
              <Popup>
                <h3>Посты на данной локации:</h3>
                <div>
                  {posts.map((post) => (
                    <li key={post.id}>
                      <a
                        style={{ cursor: "pointer" }}
                        onClick={() => nav("/postInfo/" + post.id)}
                      >
                        {post.title}
                      </a>
                    </li>
                  ))}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {polygons}
      </MapContainer>

      {!lat && (
        <>
          {showPoly ? (
            <div className="maplist">
              <span 
                style={{ marginLeft: "auto", marginBottom: "10px", cursor: "pointer" }}
                onClick={() => setShowPoly(false)}
              >
                Скрыть
              </span>
              {colorMap.map((el) => (
                <div key={el.tag} className="maplist_item">
                  <span 
                    className="maplist_item_color"
                    style={{ background: el.color }}
                  />
                  <span className="maplist_item_tag">{el.tag}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="mapShowPoly" onClick={() => setShowPoly(true)}>
              Показать полигоны
            </div>
          )}
        </>
      )}
    </>
  );
});
