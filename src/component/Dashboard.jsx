import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [stats, setStats] = useState({
    totalInvoices: 0,
    revenue: 0,
    pending: 0,
  });
  const [unpaidInvoices, setUnpaidInvoices] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");
      console.log("Token from localStorage:", token);
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const { totalInvoices, revenue, pending, unpaidInvoices } =
          response.data;
        setStats({ totalInvoices, revenue, pending });
        setUnpaidInvoices(unpaidInvoices);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          navigate("/login");
        }
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // 🔍 Filter (invoice number + date)
  const filteredInvoices = unpaidInvoices.filter(
    (inv) =>
      inv.invoiceNumber?.toLowerCase().includes(search.toLowerCase()) ||
      new Date(inv.date)
        .toLocaleDateString()
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* 🔢 Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow">
          Total Invoices: {stats.totalInvoices}
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          Revenue: ₹{stats.revenue}
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          Pending: ₹{stats.pending}
        </div>
      </div>

      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="Search by Invoice No or Date..."
        className="border p-2 mb-4 w-full rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* 📋 Recent Invoices */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Invoice No</th>
              <th>Client</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((inv) => (
                <tr key={inv._id} className="border-t">
                  <td className="p-2">{inv.invoiceNumber}</td>
                  <td>{inv.clientName}</td>
                  <td>{new Date(inv.date).toLocaleDateString()}</td>
                  <td>₹ {inv.total}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        inv.status === "unpaid"
                          ? "bg-yellow-200 text-yellow-800"
                          : ""
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  No invoices found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default Dashboard;
