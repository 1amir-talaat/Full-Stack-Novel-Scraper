import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader";

const Novel = () => {
  const url = useLocation().state;
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchNovels = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:7000/api/novels/data?query=${url}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        setError(error);
        toast.error("Failed to load data.");
      } finally {
        setIsLoading(false);
      }
    };

    if (url) {
      fetchNovels();
    } else {
      navigate("/");
    }
  }, [url, navigate]);

  const handleCreateEPUB = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:7000/api/novels/create_epub?query=${url}`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Failed to initiate EPUB creation");
      }
      const result = await response.json();
      toast.success(`EPUB creation started. Path: ${result.path}`);
    } catch (error) {
      toast.error("Failed to initiate EPUB creation.");
    }
  };

  if (isLoading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return null; // or handle error display
  }

  const marker = "دعم المترجم لزيادة التنزيل :";
  let description = data && typeof data.description === "string" ? data.description : "";

  if (description.includes(marker)) {
    description = description.split(marker)[0];
  }

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const renderText = () => {
    if (isExpanded) {
      return description;
    }
    return description.split("\n").slice(0, 3).join("\n");
  };

  return (
    <div className="flex justify-center bg-white text-black p-4 mt-16">
      <div className="flex lg:w-[60%] md:w-[88%]" dir="rtl">
        <div className="ml-8">
          <img src={data.poster} alt="Book Cover" className="rounded-lg lg:w-[300px] md:w-[150px]" style={{ maxWidth: "unset" }} />
        </div>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-bold">{data.title}</h1>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p>عنوان اخر</p>
              <p className="font-bold">{data.original_title}</p>
            </div>
            <div>
              <p>الكاتب</p>
              <p className="font-bold">{data.author}</p>
            </div>
            <div>
              <p>عدد الفصول</p>
              <p className="font-bold">{data.last_chapter_number} فصل</p>
            </div>
          </div>

          <div className="text-container">
            <p className="text-muted-foreground whitespace-pre-wrap">{renderText()}</p>
            <Button variant="link" onClick={handleToggle} className="text-blue-500">
              {isExpanded ? "عرض أقل" : "المزيد"}
            </Button>
          </div>
          <div className="flex gap-2 mb-3">
            {data.genres.map((genre, index) => (
              <Badge key={index} className="text-sm">
                {genre}
              </Badge>
            ))}
          </div>
          <div
            className="border-2 border-blue-500 bg-blue-500 rounded-lg py-2 px-3 transition-all duration-200 ease-in-out text-lg hover:bg-blue-700"
            onClick={handleCreateEPUB}
            style={{ cursor: "pointer" }}
          >
            <span className="flex justify-center items-center text-white font-semibold gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="mr-2">
                <path fill="none" d="M0 0h24v24H0z"></path>
                <path fill="currentColor" d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"></path>
              </svg>
              إنشاء
            </span>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={5000} />
    </div>
  );
};

export default Novel;
