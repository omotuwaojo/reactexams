// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CustomTable from "./components/CustomTable";
import TShirtDesigner from "./components/TShirtDesigner";


const App = () => {
  return (
    <Router >
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Multi-Feature React App</h1>
        <nav className="mb-4 flex justify-center space-x-4">
          <Link to="/" className="bg-blue-500 text-white px-4 py-2 rounded">Custom Table</Link>
          <Link to="/tshirt-designer" className="bg-green-500 text-white px-4 py-2 rounded">T-Shirt Designer</Link>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<CustomTable />} />
          <Route path="/tshirt-designer" element={<TShirtDesigner />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
