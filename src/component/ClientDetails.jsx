import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ClientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchClientDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/clients/${id}`,
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
        const { client, totalPages } = response.data;
        setClient(client);
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Failed to fetch client details:", error);
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          navigate("/login");
        }
      }
    };

    fetchClientDetails();
  }, [id, currentPage, navigate]);

  if (!client) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h1 className="text-2xl font-bold mb-2">{client.name}</h1>
        <p className="text-gray-600">{client.company}</p>
        <p className="text-gray-600">GST: {client.gstNumber}</p>
      </div>

      <h2 className="text-xl font-bold mb-4">Invoices</h2>
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Invoice No</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {client.bills.map((bill) => (
              <tr key={bill._id} className="border-t">
                <td className="p-2">{bill.invoiceNumber}</td>
                <td>{new Date(bill.date).toLocaleDateString()}</td>
                <td>₹ {bill.total}</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      bill.status === "paid" ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {bill.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

export default ClientDetails;
