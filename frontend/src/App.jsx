import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";
import Novel from "./pages/Novel";
import Boolmark from "./pages/Bookmark";
import Layout from "./components/Layout";
import { ThemeProvider } from "@/components/theme-provider";

const App = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/novel" element={<Novel />} />
          <Route path="/bookmarks" element={<Boolmark />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
};

export default App;
