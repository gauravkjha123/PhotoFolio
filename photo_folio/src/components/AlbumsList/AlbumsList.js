import AlbumListCss from "./AlbumsList.module.css";
import AlbumForm from "../AlbumForm/AlbumForm";
import albumImage from "./images/album.png";
import NavBar from "../NavBar/NavBar"
import ImagesList from "../ImagesList/ImagesList"
import { useState, useEffect,useReducer } from "react";
import { collection, getDocs, addDoc  } from "firebase/firestore";
import { db } from "../../firbaseInit.js";

const reducer = (state, action) => {
    switch (action.type) {
      case "RETERIVE":
        return [...state,...action.data]
      case "ADD":
          return [...state,action.data]
      default:
        return state;
    }
  };


const AlbumsList = () => {
  const [albums, dispatch] = useReducer(reducer, []);
  const [showForm, setShowForm] = useState(false);
  const [selectedAlbum, setselectedAlbum] = useState("");
  const fetchCollecton = async () => {
    const querySnapshot = await getDocs(collection(db, "albums"));
    let albums = [];
    querySnapshot.forEach((doc) => {
      albums.push({ id: doc.id, ...doc.data() });
    });
    dispatch({type:"RETERIVE",data:albums})
  };

  const addAlbum = async (data) => {
    const docRef = await addDoc(collection(db, "albums"), {
        name: data.name,
      })
      console.log(docRef);
    dispatch({type:"ADD",data:{id:docRef.id,name:data.name}})
  };

  useEffect(() => {
    fetchCollecton();
  }, []);
  const setShowFormFn = () => {
    setShowForm(!showForm);
  };
  return (
    <>
    <NavBar/>
    {
        selectedAlbum && (<ImagesList selectedAlbum={selectedAlbum}/>)
    }
     {
        !selectedAlbum && (
            <div className={AlbumListCss.mainContainer}>
        {showForm ? <AlbumForm addAlbum={addAlbum} dispatch={dispatch}/> : ""}
        <div className={AlbumListCss.heading}>
          <h1>Your albums</h1>
          <button onClick={setShowFormFn} className={showForm?AlbumListCss.cancel: AlbumListCss.create}>
            {showForm ? "Cancel" : "Add album"}
          </button>
        </div>
        <div className={AlbumListCss.listsContainer}>
          {albums.map((value, index) => {
            return (
              <div key={index} className={AlbumListCss.listContainer} onClick={()=>setselectedAlbum(value.id)}>
                <img className={AlbumListCss.img} src={albumImage} alt="album" />
                <span className={AlbumListCss.detail}>{value.name}</span>
              </div>
            );
          })}
        </div>
      </div>
        )
     } 
    </>
  );
};

export default AlbumsList;
