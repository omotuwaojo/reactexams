import React, { useState, useEffect } from "react";
import axios from "axios";

const CustomTable = () => {
  // State management
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);  // Loading state
  const [error, setError] = useState(null);  // Error state

  // Dynamic API URL for different environments
  const apiUrl =
    process.env.NODE_ENV === "production"
      ? "https://api.razzakfashion.com"
      : "/api";  // For development (handled by Vite proxy)

  // Fetch data on page, perPage, or search change
  useEffect(() => {
    fetchData();
  }, [page, perPage, search]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);  // Reset error before each request
    try {
      const response = await axios.get(apiUrl, {
        params: {
          paginate: perPage,
          search,
          page,
        },
      });
      setData(response.data.data || []);
      setTotalPages(response.data.last_page || 1);
    } catch (error) {
      setError("Error fetching data. Please try again.");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to the first page on search
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="p-4">
      {error && <div className="text-red-500 mb-4">{error}</div>}  {/* Display error message */}

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search area"
        value={search}
        onChange={handleSearch}
        className="mb-4 p-2 border border-gray-300 rounded"
      />

      {/* Loading state */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">ID</th>
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Created At</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">{item.id}</td>
                <td className="border border-gray-300 p-2">{item.name}</td>
                <td className="border border-gray-300 p-2">{item.email}</td>
                <td className="border border-gray-300 p-2">
                  {new Date(item.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CustomTable;
