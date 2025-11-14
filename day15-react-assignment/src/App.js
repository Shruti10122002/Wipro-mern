import { useState, useEffect } from "react";
import { Provider } from "react-redux";
import { ThemeContext } from "./context/ThemeContext";
import { store } from "./app/store";

import ChildComponent from "./components/ChildComponent";
import WorkoutTracker from "./components/WorkoutTracker";
import OfflineBanner from "./components/OfflineBanner";

import "./styles/theme.css";

function App() {
  // 🔹 Load theme from localStorage (persist between reloads)
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  // 🔹 Toggle light/dark theme
  const toggleTheme = () => setTheme(prev => (prev === "light" ? "dark" : "light"));

  // 🔹 Save theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <Provider store={store}>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <div className={`app-container ${theme}`}>
          <OfflineBanner />
          <header className="header">
            <h1>🌟 Day 15 React Assignment</h1>
            <button className="theme-toggle-btn" onClick={toggleTheme}>
              Toggle to {theme === "light" ? "Dark" : "Light"} Mode
            </button>
          </header>

          <main>
            <ChildComponent />
            <WorkoutTracker />
          </main>
        </div>
      </ThemeContext.Provider>
    </Provider>
  );
}

export default App;
