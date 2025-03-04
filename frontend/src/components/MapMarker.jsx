import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon } from "react-leaflet";
import L from "leaflet";
import { useNavigate, useParams } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import postStore from "../store/postStore";
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";
import "./styles/mapMarker.css"

const icon = L.icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export const MapMarker = observer(() => {
  const { latitude, longitude } = useParams();
  const nav = useNavigate();
  const [showPoly, setShowPoly] = useState(false);

  useEffect(() => {
    postStore.setLimit(100);
    postStore.getPosts();
  }, [postStore.currentPage]);

  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);

  const cond = !isNaN(lat) && !isNaN(lng);

  const defaultPosition = [43.3188, 45.6865];
  const position = cond ? [lat, lng] : defaultPosition;

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  
  const groupedPosts = postStore.posts.reduce((acc, post) => {
    const key = `${post.latitude},${post.longitude}`; // Ключ для группировки
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(post);
    return acc;
  }, {});

  const groupedByTags = postStore.posts.reduce((acc, post) => {
    post.tags.forEach((tag) => {
      if (!acc[tag]) {
        acc[tag] = [];
      }
      acc[tag].push(post);
    });
    return acc;
  }, {});


  const polygonCoordinates = Object.keys(groupedPosts).map((key) => {
    const [lat, lng] = key.split(",").map(Number);
    return [lat, lng];
  });

  const list = [];

  return (
    <>
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: "100vh", width: "100%" }} // Убедитесь, что высота задана
    >
      <TileLayer
        url="https://maps.geoapify.com/v1/tile/maptiler-3d/{z}/{x}/{y}.png?&apiKey=35d30b48231643c69db94ee00e5ca9e0"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {cond && (
        <Marker position={position} icon={icon}>
          <Popup>
            Ваш маркер
          </Popup>
        </Marker>
      )}

      {!cond && Object.entries(groupedPosts).map(([key, posts]) => {
        const [lat, lng] = key.split(",").map(Number); // Получаем координаты из ключа
        return (
          <Marker key={key} position={[lat, lng]} icon={icon}>
            <Popup>
              <h3>Посты на данной локации:</h3>
              <div>
                {posts.map((post, index) => (
                  <li key={index}>
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

      {showPoly && !cond && Object.entries(groupedByTags).map(([tag, posts]) => {
        const coordinates = posts.map((post) => [post.latitude, post.longitude]);
        const color = getRandomColor(); // Генерируем случайный цвет для каждого тега
            list?.push({
                tag,
                color
            });
            console.log(list);
        return (
          <Polygon
            key={tag}
            positions={coordinates}
            pathOptions={{
              color: color,
              fillColor: color,
              fillOpacity: 0.4,
            }}
          />
        );
      })}
    </MapContainer>
    { !cond && <>
    {showPoly ? <div className="maplist">
        <span style={{marginLeft: "auto", 
                      marginBottom: "10px",
                      cursor: "pointer"}}
              onClick={() => setShowPoly(false)}>Скрыть</span>
        {list.map((el) => {
            return <div className="maplist_item">
                <span className="maplist_item_color"
                      style={{background: el?.color || ''}}></span>
                <span className="maplist_item_tag">{el?.tag || ''}</span>
            </div>
        })}
    </div> : <div className="mapShowPoly"
                  onClick={() => setShowPoly(true)}>Показать полигоны</div>
   }
   </>}
    </>
  );
});