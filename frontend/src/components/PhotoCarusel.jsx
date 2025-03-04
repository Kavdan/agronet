import { useRef, useState } from "react";
import Modal from "./Modal";
import "./styles/photoCarusel.css"
import { toJS } from "mobx";

export const PhotoCarusel = ({ photos, onRemovePhoto }) => {
  const [showPhoto, setShowPhoto] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const containerRef = useRef(null);

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 100, behavior: "smooth" }); // Прокрутка на 200px влево
    }
  };

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -100, behavior: "smooth" }); // Прокрутка на 200px влево
    }
  };

  const showPhotoHandle = (i) => {
    setShowPhoto(!showPhoto);
    setCurrentPhoto(i);
  };

  return (
    <>
      {Array.isArray(photos) && photos?.length > 0 && (
        <>
          {showPhoto && (
            <Modal isOpen={showPhoto} onClose={setShowPhoto}>
              <img
                className="zoomed_photo"
                src={typeof photos[currentPhoto] === 'string' 
                  || photos[currentPhoto] instanceof String ? 
                  URL.createObjectURL(photos[currentPhoto])
                  : photos[currentPhoto].data}
                alt=""
              />
            </Modal>
          )}
        <div className="images">
          <button className="left" onClick={() => scrollLeft()}>
            {"<"}
          </button>
          <div className="imglist" ref={containerRef}>
            {photos?.map((photo, i) => {
              let url;
              if(!photo.data)
                url = URL.createObjectURL(photo);
              return (
                <div className="image-wrapper" key={i}>
                {
                  onRemovePhoto && <button onClick={() => onRemovePhoto(photo.id || i)}>x</button>
                }
                  <img src={photo.data || url} onClick={() => showPhotoHandle(i)} />
                </div>
              );
            })}
          </div>
          <button className="right" onClick={() => scrollRight()}>
            {">"}
          </button>
        </div>
        </>
      )}
    </>
  );
};
