import Loader from "@/components/Loader";
import SearchBar from "@/components/SearchBar";
import SearchCard from "@/components/SearchCard";
import { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [keyword, setKeyWord] = useState("");
  const [search, setSearch] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const navigate = useNavigate();

  const { data, error, remove } = useQuery({
    queryKey: ["novels"],
    queryFn: async () => {
      setIsloading(true);
      const response = await fetch(`http://127.0.0.1:7000/api/novels/search?query=${keyword}`);
      setSearch(false);
      setIsloading(false);
      return response.json();
    },
    enabled: search,
  });

  if (error) {
    toast.error("error while searching!", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }

  const handleNovelClick = (url) => {
    remove();
    navigate("/novel", { state: url });
  };

  const handleRemoveFavorite = (novelUrl) => {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites = favorites.filter((item) => item.url !== novelUrl);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    toast.success("Novel removed from favorites!", {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const handleMarkAsFavorite = (novel) => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (!favorites.find((item) => item.url === novel.url)) {
      favorites.push(novel);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      toast.success("Novel marked as favorite!", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,

        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      toast.info("Novel already marked as favorite.", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,

        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  console.log(data);

  return (
    <div className="p-4 mx-6 md:mx-12 my-6">
      <>
        <ToastContainer
          position="bottom-right"
          autoClose={2000}
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
      <SearchBar setSearch={setSearch} setKeyWord={setKeyWord} keyword={keyword} />
      <div className="w-[80%] m-auto flex justify-between items-center"></div>
      <div className="w-[80%] m-auto">
        {isLoading && (
          <div className="h-[70vh] flex items-center justify-center ">
            <Loader />
          </div>
        )}
        {!isLoading && data && data.length === 0 && (
          <div className="h-[50vh] w-full flex items-center mt-16 justify-center">
            <img src=".\public\images\search-error.webp" alt="" />
          </div>
        )}
        {!isLoading &&
          data &&
          data.map((source, index) => (
            <div key={index}>
              {Object.keys(source).map((key) => (
                <div key={key}>
                  <h2 className="text-2xl font-bold mb-3">{key}</h2>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12 pb-3">
                    {source[key].map((novel, novelIndex) => (
                      <div key={novelIndex}>
                        <SearchCard
                          isFavorite={JSON.parse(localStorage.getItem("favorites") || "[]").some((item) => item.url === novel.url)}
                          data={novel}
                          onClick={handleNovelClick}
                          onMark={() => handleMarkAsFavorite(novel)}
                          onRemove={() => handleRemoveFavorite(novel.url)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
}
