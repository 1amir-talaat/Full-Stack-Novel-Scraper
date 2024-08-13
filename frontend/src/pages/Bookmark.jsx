import { useEffect, useState } from "react";
import SearchCard from "@/components/SearchCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Boolmark() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  const handleRemoveFavorite = (novelUrl) => {
    const updatedFavorites = favorites.filter((novel) => novel.url !== novelUrl);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    toast.success("Novel removed from favorites!", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  return (
    <div className="p-4 mx-6 md:mx-12 my-6">
      <>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </>
      <h2 className="text-2xl font-bold mb-6">Bookmark Novels</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {favorites.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">No Bookmark novels found.</div>
        ) : (
          favorites.map((novel, index) => (
            <div key={index}>
              <SearchCard data={novel} />
              <button onClick={() => handleRemoveFavorite(novel.url)} className="mt-2 bg-red-500 text-white p-2 rounded">
                Remove from Bookmark
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
