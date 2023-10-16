import { useRef } from "react";
import AlbumFormCss from "./AlbumForm.module.css";

const AlbumForm = ({ addAlbum }) => {
  const nameRef = useRef(null);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!nameRef.current.value) {
        return
    }
    const data = {
      name: nameRef.current.value,
    };
    addAlbum(data);
    clearInput();
  };

  const clearInput = (e) => {
    e?.preventDefault();
    nameRef.current.value = "";
  };
  return (
    <div className={AlbumFormCss.container}>
      <h1>Create an album</h1>
      <form className={AlbumFormCss.albumForm} onSubmit={submitHandler}>
        <input  type="text" ref={nameRef} required></input>
        <button className={AlbumFormCss.clear} onClick={clearInput}>Clear</button>
        <button
          type="submit"
          className={AlbumFormCss.create}
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default AlbumForm;
