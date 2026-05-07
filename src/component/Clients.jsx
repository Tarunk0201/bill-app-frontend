import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Clients() {
  const [clients, setClients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/clients`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              page: currentPage,
              limit: 10,
            },
          },
        );
        const { clients, totalPages } = response.data;
        setClients(clients);
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Failed to fetch clients:", error);
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          navigate("/login");
        }
      }
    };

    fetchClients();
  }, [currentPage, navigate]);

  // 🔍 Search
  const filteredClients = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Clients CRM</h1>

      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="Search client..."
        className="border p-2 mb-4 w-full rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* 🧾 Cards */}
      <div className="grid grid-cols-3 gap-4">
        {filteredClients.map((client) => (
          <div
            key={client._id}
            onClick={() => navigate(`/client/${client._id}`)}
            className={`p-4 rounded-xl shadow cursor-pointer bg-white border-l-4 ${
              client.status === "paid" ? "border-green-500" : "border-red-500"
            }`}
          >
            <h2 className="text-lg font-bold">{client.name}</h2>

            <p className="text-sm mt-2">Total Billing: ₹{client.total}</p>

            <p className="text-sm">Invoices: {client.count}</p>

            <p
              className={`mt-2 font-semibold ${
                client.status === "paid" ? "text-green-600" : "text-red-600"
              }`}
            >
              {client.status.toUpperCase()}
            </p>
          </div>
        ))}
      </div>

      {/* ⏪ Pagination ⏩ */}
      <div className="flex justify-center items-center mt-6">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-l disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2 bg-gray-200">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-r disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </Layout>
  );
}

export default Clients;
