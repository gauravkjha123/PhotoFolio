import { useState } from "react";
import ImageFormCss from "./ImageForm.module.css";

const ImageForm = ({ addimage ,selectedAlbum, setShowFormFn, update, updateimage }) => {
  const [title,setTitle]=useState(update?.title??"")
  const [imageUrl,setImageUrl]=useState(update?.imageUrl??"")

  const submitHandler = (e) => {
    e.preventDefault();
    if (!title) {
        return
    }

    if (update) {
      const data = {
        id:update.id,
        title: title,
        imageUrl:imageUrl,
        albumId:selectedAlbum.id
      };
      updateimage(data)
      clearInput();
      setShowFormFn()
      return;
    }
    const data = {
      title: title,
      imageUrl:imageUrl,
      albumId:selectedAlbum.id
    };
    addimage(data);
    clearInput();
    setShowFormFn()
  };

  const clearInput = (e) => {
    e?.preventDefault();
    setTitle("")
    setImageUrl("")
  };

  const onChangeTitle=(e)=>{
    setTitle(e.target.value)
  }

  const onChangeImageUrl=(e)=>{
    setImageUrl(e.target.value)
  }
  return (
    <div className={ImageFormCss.container}>
      <h1>Add image to {selectedAlbum.name}</h1>
      <form className={ImageFormCss.imageForm} onSubmit={submitHandler}>
        <input  onChange={onChangeTitle} type="text"  required placeholder="Title" value={title}></input>
        <input onChange={onChangeImageUrl} type="text" required placeholder="image URL" value={imageUrl}></input>
        <div style={{display:"flex",gap:10}}>
        <button className={ImageFormCss.clear} onClick={clearInput}>Clear</button>
        <button
          type="submit"
          className={ImageFormCss.create}
        >
         {update?"Update":"Create"} 
        </button>
        </div>
      </form>
    </div>
  );
};

export default ImageForm;
