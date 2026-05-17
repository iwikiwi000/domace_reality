// App.tsx
import { RouterProvider } from "react-router-dom";
import { router } from "./Router";
import { ModalProvider } from "./context/ModalContext";
import "./App.css";

function App() {
  return (
    <ModalProvider>
      <RouterProvider router={router} />
    </ModalProvider>
  );
}

export default App;
