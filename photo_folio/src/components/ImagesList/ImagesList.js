import ImageListCss from "./ImagesList.module.css";
import ImageForm from "../ImageForm/ImageForm";
import editImage from "./images/edit.png";
import backImage from "./images/back.png";
import deleteImage from "./images/trash-bin.png";
import { useState, useEffect, useReducer } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "../../firbaseInit.js";

const reducer = (state, action) => {
  switch (action.type) {
    case "RETERIVE":
      return [...action.data];
    case "ADD":
      return [...state, action.data];
    case "DELETE": {
      const images = state.filter((value) => value.id !== action.id);
      return images;
    }
    case "UPDATE": {
      const imagesIds = state.map((value) => value.id);
      let index = imagesIds.indexOf(action.data.id);

      return state.map((value, i) => {
        if (i === index) {
          return action.data;
        }
        return value;
      });
    }
    default:
      return state;
  }
};

const ImagesList = ({ selectedAlbum, setselectedAlbum }) => {
  const [images, dispatch] = useReducer(reducer, []);
  const [showForm, setShowForm] = useState(false);
  const [carousel, setCarousel] = useState({});
  const [showcarousel, setShowCarousel] = useState(false);
  const [update, setUpdate] = useState(null);

  const fetchCollecton = async () => {
    let q = query(
      collection(db, "images"),
      where("albumId", "==", selectedAlbum.id)
    );

    const querySnapshot = await getDocs(q);

    let images = [];

    querySnapshot.forEach((doc) => {
      images.push({ id: doc.id, ...doc.data() });
    });
    setCarousel(images[0]);
    dispatch({ type: "RETERIVE", data: images });
  };

  const addimage = async (data) => {
    const docRef = await addDoc(collection(db, "images"), {
      title: data.title,
      imageUrl: data.imageUrl,
      albumId: data.albumId,
    });
    dispatch({
      type: "ADD",
      data: {
        id: docRef.id,
        title: data.title,
        albumId: data.albumId,
        imageUrl: data.imageUrl,
      },
    });
  };

  const deleteimage = async (id) => {
    await deleteDoc(doc(db, "images", id));
    dispatch({ type: "DELETE", id: id });
  };

  const updateimage = async (data) => {
    await setDoc(doc(db, "images", data.id), {
      title: data.title,
      imageUrl: data.imageUrl,
      albumId: data.albumId,
    });
    dispatch({ type: "UPDATE", data });
    setUpdate(null);
  };

  useEffect(() => {
    fetchCollecton();
  }, []);

  const setShowFormFn = () => {
    setShowForm(!showForm);
  };

  const nextImage = () => {
    let imagesIds = images.map((value) => value.id);
    let index = imagesIds.indexOf(carousel.id);
    if (index !== -1) {
      console.log((index + 1) % images.length);
      setCarousel(images[(index + 1) % images.length]);
      return;
    }
    return;
  };

  const prevImage = () => {
    let imagesIds = images.map((value) => value.id);
    let index = imagesIds.indexOf(carousel.id);
    if (index !== -1) {
      if (index === 0) {
        setCarousel(images[images.length - 1]);
        return;
      }
      setCarousel(images[index - 1]);
      return;
    }
    return;
  };

  const showcarouselFn = (index) => {
    setCarousel(images[index]);
    setShowCarousel(true);
    return;
  };
  return (
    <>
      <div className={ImageListCss.mainContainer}>
        {showForm ? (
          <ImageForm
            addimage={addimage}
            dispatch={dispatch}
            selectedAlbum={selectedAlbum}
            setShowFormFn={setShowFormFn}
            update={update}
            updateimage={updateimage}
          />
        ) : (
          ""
        )}
        <div className={ImageListCss.heading}>
          <span
            onClick={() => {
              setselectedAlbum();
            }}
            className={ImageListCss.back_btn_container}
          >
            <img className={ImageListCss.back_btn} src={backImage} alt="back" />
          </span>
          <h1>Your images</h1>
          <button
            onClick={setShowFormFn}
            className={showForm ? ImageListCss.cancel : ImageListCss.create}
          >
            {showForm ? "Cancel" : "Add image"}
          </button>
        </div>
        <div style={{ display: showcarousel ? "block" : "none" }}>
          <div className={ImageListCss.carousel}>
            <button
              onClick={() => {
                setShowCarousel(false);
              }}
              className={ImageListCss.close_carousel_btn}
            >
              x
            </button>
            <button onClick={prevImage}>&lt;</button>
            <img src={carousel?.imageUrl} alt="Nature" />
            <button onClick={nextImage}>&gt;</button>
          </div>
        </div>
        <div className={ImageListCss.listsContainer}>
          {images.map((value, index) => {
            return (
              <div
                key={index}
                className={ImageListCss.listContainer}
                onClick={() => {
                  showcarouselFn(index);
                }}
              >
                <div className={ImageListCss.btn_container}>
                  <div
                    onClick={(e) => {
                      setShowForm(!showForm);
                      setUpdate(value);
                      e.stopPropagation();
                    }}
                  >
                    <img
                      className={ImageListCss.imageList_update}
                      src={editImage}
                      alt="update"
                    />
                  </div>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteimage(value.id);
                    }}
                  >
                    <img
                      className={ImageListCss.imageList_delete}
                      src={deleteImage}
                      alt="delete"
                    />
                  </div>
                </div>
                <img
                  className={ImageListCss.img}
                  src={value.imageUrl}
                  alt="image"
                />
                <span className={ImageListCss.detail}>{value.title}</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ImagesList;
