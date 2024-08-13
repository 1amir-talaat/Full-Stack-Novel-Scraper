import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { ModeToggle } from "./mode-toggle";
import { Progress } from "@/components/ui/progress";

export default function Navbar() {
  const [progress, setProgress] = useState("No progress yet");

  useEffect(() => {
    const socketUrl = `ws://localhost:7000/api/ws/progress`;
    const socket = new WebSocket(socketUrl);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setProgress(data);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    socket.onerror = (error) => {
      console.error(`WebSocket error: ${error}`);
    };

    return () => {
      socket.close();
    };
  }, []);

  console.log(progress);

  const getColor = (progress) => {
    if (progress < 33) return "bg-red-500";
    if (progress < 66) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <header className="flex w-full items-center justify-between bg-white px-4 py-3 shadow-sm dark:bg-gray-950 sm:px-6 md:px-8 lg:px-10">
      <Link to="/" className="flex items-center gap-[0.38rem]" prefetch={false}>
        <MountainIcon className="h-6 w-6" />
        <span className="font-bold">Novels</span>
      </Link>
      <nav className="hidden items-center gap-6 text-sm font-medium lg:flex">
        <Link to="/" className="hover:underline hover:underline-offset-4" prefetch={false}>
          Search
        </Link>
        <Link to="bookmarks" className="hover:underline hover:underline-offset-4" prefetch={false}>
          Bookmarks
        </Link>
      </nav>
      <div className="flex items-center gap-3 relative">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:shadow-none" size="icon">
              <WaveIcon className="h-6 w-6" />
              <span className="sr-only">Progress</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[450px] mr-4">
            <DropdownMenuLabel>EPUB Creation Progress</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {progress != "No progress yet" ? (
              <div dir="rtl" className="p-4 flex gap-3">
                <img src={progress.poster} alt="" className="w-[70px]" />
                <div className="flex flex-col gap-4 flex-1">
                  <div>
                    <div className="flex gap-2 text-lg mb-2">
                      <p className="font-bold ">{progress.title}</p>
                      <p className="font-normal">
                        ({progress.current} - {progress.end})
                      </p>
                    </div>
                    <p className="font-normal text-md text-gray-700 text-ellipsis overflow-hidden">{progress.current == progress.end ? "completed" : progress.status}</p>
                  </div>

                  <Progress value={progress.progress} indicatorColor={getColor(progress.progress)} />
                </div>
              </div>
            ) : (
              <div className="p-4 flex gap-3">No progress yet</div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <ModeToggle />
      </div>
      <div className="fixed bottom-0 left-0 z-10 flex w-full items-center justify-around bg-white py-3 shadow-t dark:bg-gray-950 lg:hidden">
        <Link
          to="/"
          className="flex flex-col items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
          prefetch={false}
        >
          <SearchIcon className="h-5 w-5" />
          Search
        </Link>
        <Link
          to={"bookmarks"}
          className="flex flex-col items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
          prefetch={false}
        >
          <InfoIcon className="h-6 w-6" />
          Bookmarks
        </Link>
      </div>
    </header>
  );
}

function InfoIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="bookmark">
      <g
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(3.5 2)"
      >
        <path d="M8.16475977,16.631579 L2.23340962,19.881007 C1.75983818,20.1271252 1.17640846,19.9529066 0.915331812,19.4874143 L0.915331812,19.4874143 C0.839799009,19.3432192 0.79904873,19.1833528 0.796338677,19.0205951 L0.796338677,4.62242565 C0.796338677,1.87643022 2.67276889,0.778032041 5.37299774,0.778032041 L11.7162472,0.778032041 C14.3340962,0.778032041 16.2929063,1.80320367 16.2929063,4.43935929 L16.2929063,19.0205951 C16.2929063,19.2803494 16.1897192,19.5294649 16.0060452,19.713139 C15.8223711,19.8968131 15.5732556,20.0000001 15.3135012,20.0000001 C15.1478164,19.9973723 14.9849578,19.9566576 14.8375287,19.881007 L8.86956526,16.631579 C8.64965001,16.5127732 8.38467502,16.5127732 8.16475977,16.631579 Z"></path>
        <line x1="4.87" x2="12.165" y1="7.323" y2="7.323"></line>
      </g>
    </svg>
  );
}

function MountainIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}

function WaveIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.0"
      width="50"
      height="50"
      viewBox="0 0 512.000000 512.000000"
      fill="none"
      className="dark:text-white"
      preserveAspectRatio="xMidYMid meet"
    >
      <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" className="fill-black dark:fill-white" stroke="none">
        <path d="M2815 3605 c-5 -2 -22 -6 -38 -9 -40 -9 -105 -72 -134 -130 -82 -161 -121 -375 -163 -891 -39 -480 -74 -740 -105 -782 -12 -16 -15 -16 -29 -3 -8 8 -26 53 -40 100 -24 80 -37 142 -116 560 -52 275 -110 427 -189 492 -78 66 -185 55 -261 -28 -78 -85 -121 -214 -179 -534 -52 -292 -75 -370 -109 -370 -16 0 -26 17 -48 78 -112 316 -136 365 -217 437 -81 74 -112 80 -417 80 l-265 0 0 -105 0 -105 255 -5 c215 -4 260 -8 281 -21 35 -23 80 -113 124 -249 66 -202 119 -292 193 -329 133 -66 255 -4 319 165 39 102 54 163 102 424 38 204 69 322 91 344 32 32 71 -98 135 -449 83 -450 130 -598 224 -698 42 -45 62 -57 111 -68 83 -19 152 26 205 134 70 142 100 324 145 867 49 586 94 840 150 840 15 0 24 -16 44 -77 41 -133 58 -233 101 -608 60 -523 123 -694 264 -726 82 -18 182 30 241 116 49 71 77 151 136 379 30 116 59 213 66 217 19 12 32 -5 73 -98 87 -199 163 -292 268 -331 54 -21 75 -22 327 -22 l270 0 0 105 0 105 -245 0 c-188 0 -254 3 -279 14 -42 17 -85 80 -132 188 -57 133 -95 197 -141 238 -72 63 -175 72 -242 22 -76 -56 -120 -159 -186 -437 -34 -142 -75 -255 -92 -255 -36 1 -70 137 -103 410 -59 489 -79 610 -121 740 -51 153 -117 240 -203 265 -51 15 -54 16 -71 10z" />
      </g>
    </svg>
  );
}

function SearchIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
