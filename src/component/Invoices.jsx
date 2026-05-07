import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoices = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/bills`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              page: currentPage,
              limit: 10, // You can adjust the limit as needed
            },
          },
        );
        const { bills, totalPages } = response.data;
        setInvoices(bills);
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Failed to fetch invoices:", error);
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          navigate("/login");
        }
      }
    };

    fetchInvoices();
  }, [currentPage, navigate]);

  // ✅ DELETE
  const deleteInvoice = async (id) => {
    if (!window.confirm("Are you sure you want to delete this invoice?"))
      return;

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/bills/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Refresh the invoices list after deletion
      setInvoices(invoices.filter((i) => i._id !== id));
      alert("Invoice deleted successfully");
    } catch (error) {
      console.error("Failed to delete invoice:", error);
      alert("Failed to delete invoice");
    }
  };

  const handleStatusUpdate = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/bills/${id}`,
        { status: "paid" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      // Update the status in the local state
      setInvoices(
        invoices.map((inv) =>
          inv._id === id ? { ...inv, status: "paid" } : inv,
        ),
      );
      alert("Invoice status updated to paid");
    } catch (error) {
      console.error("Failed to update invoice status:", error);
      alert("Failed to update invoice status");
    }
  };

  // ✅ SEARCH FILTER
  const filteredInvoices = invoices.filter((inv) =>
    inv.client.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Invoice List</h1>

      {/* 🔍 SEARCH */}
      <input
        type="text"
        placeholder="Search by client..."
        className="border p-2 mb-4 w-full rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* 📋 TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Invoice No</th>
              <th>Client</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((inv) => (
                <tr key={inv._id} className="border-t">
                  <td className="p-2">{inv.invoiceNumber}</td>
                  <td>{inv.client.name}</td>
                  <td>{new Date(inv.date).toLocaleDateString()}</td>
                  <td>₹ {inv.total}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded text-white ${
                        inv.status === "paid" ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>

                  <td className="flex gap-4 p-2">
                    {/* 👁 VIEW */}
                    <button
                      onClick={() => navigate("/preview", { state: inv })}
                      className="text-blue-500"
                    >
                      View
                    </button>

                    {/* ✏️ EDIT STATUS */}
                    {inv.status !== "paid" && (
                      <button
                        onClick={() => handleStatusUpdate(inv._id)}
                        className="text-green-600"
                      >
                        Mark as Paid
                      </button>
                    )}

                    {/* 🗑 DELETE */}
                    <button
                      onClick={() => deleteInvoice(inv._id)}
                      className="text-red-500"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No invoices found
                </td>
              </tr>
            )}
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

export default Invoices;
