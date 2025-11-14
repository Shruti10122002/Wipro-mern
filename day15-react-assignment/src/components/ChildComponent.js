import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function ChildComponent() {
  const { theme } = useContext(ThemeContext);
  return <p>Current Theme: {theme}</p>;
}
