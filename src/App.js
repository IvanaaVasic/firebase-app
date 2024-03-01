import { useEffect, useState } from "react";
import styles from "./App.module.css";
import { Auth } from "./components/Auth";
import { db, auth, storage } from "./config/firebase";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

import { ref, uploadBytes } from "firebase/storage";

function App() {
  const [movieList, setMovieList] = useState([]);

  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newReleaseDate, setNewReleaseDate] = useState(0);
  const [isNewMovieOscar, setIsNewMovieOscar] = useState(false);

  const [updatedTitle, setUpdatedTitle] = useState("");

  //File upload state
  const [fileUpload, setFileUpload] = useState(null);

  const moviesCollectionRef = collection(db, "movies");

  const getMovieList = async () => {
    try {
      const data = await getDocs(moviesCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setMovieList(filteredData);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getMovieList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmitMovie = async () => {
    try {
      await addDoc(moviesCollectionRef, {
        title: newMovieTitle,
        releaseDate: newReleaseDate,
        receivedAnOscar: isNewMovieOscar,
        userId: auth?.currentUser?.uid,
      });
      getMovieList();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteMovie = async (id) => {
    const movieDoc = doc(db, "movies", id);

    try {
      await deleteDoc(movieDoc);
      getMovieList();
    } catch (e) {
      console.error(e);
    }
  };

  const updateMovieTitle = async (id) => {
    const movieDoc = doc(db, "movies", id);

    try {
      await updateDoc(movieDoc, {
        title: updatedTitle,
      });
      getMovieList();
    } catch (e) {
      console.error(e);
    }
  };

  const uploadFile = async () => {
    if (!fileUpload) return;
    const filesFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);
    try {
      await uploadBytes(filesFolderRef, fileUpload);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={styles.app}>
      <Auth />
      <div className={styles.movieContainer}>
        <div className={styles.movieSearchWrapper}>
          <input
            type="text"
            placeholder="Movie title..."
            onChange={(e) => setNewMovieTitle(e.target.value)}
          />
          <input
            type="number"
            placeholder="Release date..."
            onChange={(e) => setNewReleaseDate(Number(e.target.value))}
          />
          <input
            type="checkbox"
            checked={isNewMovieOscar}
            onChange={(e) => setIsNewMovieOscar(e.target.checked)}
          />
          <label>Received an Oscar</label>
          <button onClick={onSubmitMovie}>Submit Movie</button>
        </div>
      </div>
      <div>
        {movieList?.map((movie) => (
          <div key={movie.id}>
            <h2
              className={movie.receivedAnOscar ? styles.oscar : styles.notOscar}
            >
              {movie.title}
            </h2>
            <p>Date : {movie.releaseDate}</p>
            <button onClick={() => deleteMovie(movie.id)}>Delete</button>
            <input
              placeholder="New title"
              onChange={(e) => setUpdatedTitle(e.target.value)}
            />
            <button onClick={() => updateMovieTitle(movie.id)}>
              Update title
            </button>
          </div>
        ))}
      </div>

      <div className={styles.uploadContainer}>
        <input type="file" onChange={(e) => setFileUpload(e.target.files[0])} />
        <button onClick={uploadFile}>Upload file</button>
      </div>
    </div>
  );
}

export default App;
