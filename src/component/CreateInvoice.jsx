import React, { useEffect } from "react";
import { useState } from "react";
import Layout from "./Layout";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";

function CreateInvoice() {
  const [client, setClient] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [gstnum, setGstnum] = useState("");
  const [company, setCompany] = useState("");
  const [items, setItems] = useState([]);
  const [gst, setGst] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("unpaid");
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state;

  useEffect(() => {
    if (editData) {
      setClient(editData.client.name);
      setCompany(editData.client.company);
      setGstnum(editData.client.gstNumber);
      setDate(new Date(editData.date).toISOString().split("T")[0]);
      setItems(editData.items);
      setStatus(editData.status);
    }
  }, [editData]);
  const addItem = () => setItems([...items, { name: "", qty: 1, price: 0 }]);

  const updateItem = (i, field, value) => {
    const updated = [...items];
    updated[i][field] = value;
    setItems(updated);
  };

  const subtotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);
  const gstAmount = gst ? subtotal * 0.18 : 0;
  const total = subtotal + gstAmount - discount;

  const handlePreview = () => {
    if (!client) return setError("Client name required");
    if (items.length === 0) return setError("Add at least one item");
    setError("");
    navigate("/preview", {
      state: {
        client,
        gstnum,
        company,
        items,
        subtotal,
        gstAmount,
        discount,
        total,
        date,
      },
    });
  };
  const handleSave = async () => {
    if (!client || items.length === 0) {
      return alert("Fill required fields");
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const invoiceData = {
      client,
      company,
      gstnum,
      date,
      status,
      items,
      subtotal,
      gstAmount,
      discount,
      total,
    };

    try {
      if (editData) {
        // ✏️ UPDATE
        await axios.put(
          `${process.env.REACT_APP_API_URL}/bills/${editData._id}`,
          invoiceData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        alert("Invoice updated");
      } else {
        // ➕ CREATE NEW
        await axios.post(
          `${process.env.REACT_APP_API_URL}/bills`,
          invoiceData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        alert("Invoice saved");
      }
      navigate("/invoices");
    } catch (error) {
      console.error("Failed to save invoice:", error);
      alert("Failed to save invoice");
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Create Invoice</h1>

      {error && <div className="text-red-500 mb-3">{error}</div>}

      <div className="bg-white p-4 rounded-xl shadow mb-4  flex gap-10">
        <input
          placeholder="Client Name"
          className="border p-2 rounded"
          value={client}
          onChange={(e) => setClient(e.target.value)}
        />
        <input
          type="date"
          className="border p-2 rounded"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          placeholder="GST Number"
          className="border p-2 rounded"
          value={gstnum}
          onChange={(e) => setGstnum(e.target.value)}
        />
        <input
          placeholder="Company Name"
          className="border p-2 rounded"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Select Status</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
        </select>
      </div>

      <div className="bg-white p-4 rounded-xl shadow mb-4">
        {items.map((item, i) => (
          <div key={i} className="grid grid-cols-3 gap-2 mb-2">
            <input
              placeholder="Item"
              className="border p-2"
              onChange={(e) => updateItem(i, "name", e.target.value)}
            />
            <input
              type="number"
              placeholder="Qty"
              className="border p-2"
              onChange={(e) => updateItem(i, "qty", +e.target.value)}
            />
            <input
              type="number"
              placeholder="Price"
              className="border p-2"
              onChange={(e) => updateItem(i, "price", +e.target.value)}
            />
          </div>
        ))}
        <button
          onClick={addItem}
          className="bg-blue-500 text-white px-3 py-2 rounded"
        >
          + Add Item
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow mb-4">
        <label className="mr-3">
          <input type="checkbox" checked={gst} onChange={() => setGst(!gst)} />{" "}
          Add GST (18%)
        </label>
        <label>Discount %</label>
        <input
          type="number"
          placeholder="Discount"
          className="border p-2 ml-4"
          value={discount}
          onChange={(e) => setDiscount(+e.target.value)}
        />
      </div>

      <div className="bg-white p-4 rounded-xl shadow flex justify-between">
        <span>Total</span>
        <span>₹ {total}</span>
      </div>

      <div className="mt-4 flex gap-3">
        <button
          onClick={handlePreview}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Preview
        </button>
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2"
        >
          Save Invoice
        </button>
      </div>
    </Layout>
  );
}
export default CreateInvoice;
