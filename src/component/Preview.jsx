import React from "react";
import Layout from "./Layout";
import { useLocation } from "react-router-dom";

function Preview() {
  const location = useLocation();

  const data = location.state;
  const shareWhatsApp = () => {
    const message = `
Invoice Details:
Client: ${data.client.name}
Total: ₹${data.total}
Date: ${new Date(data.date).toLocaleDateString()}
`;

    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const shareEmail = () => {
    const message = `
Invoice Details:
Client: ${data.client.name}
Total: ₹${data.total}
Date: ${new Date(data.date).toLocaleDateString()}
`;

    const url = `mailto:?subject=Invoice&body=${encodeURIComponent(message)}`;
    window.location.href = url;
  };
  const handlePrint = () => {
    window.print();
  };

  if (!data) return <div>No Data</div>;

  return (
    <Layout>
      <div className="print:p-0 print:shadow-none print:max-w-full">
        <div
          id="invoice"
          className="bg-white p-8 max-w-4xl mx-auto text-sm border"
        >
          {/* Header */}
          <div className="flex justify-between items-start border-b pb-4">
            <div>
              <img src="/binjwalogo.png" className="w-32" />
            </div>

            <div className="text-right">
              <p>
                605 & 301, Atulya IT Park, Near Bhawarkua Main Road, Indore-
                452010
              </p>
              <p>Www.binjwaitsolutions.com</p>
              <p>Info@binjwaitsolutions.com</p>
              <p>+91 7974147736, 9826656189</p>
              <p>GST No.:- 23ABGFB3210J1ZY</p>
            </div>
          </div>

          {/* Client */}
          <div className="flex justify-between mt-4 border-b pb-4">
            <div>
              <p className="font-semibold">Issued To</p>
              <p>{data.client.name}</p>
              <p>{data.client.gstNumber}</p>
            </div>
            <div>
              <p className="font-semibold">Billing Address</p>
              <p>{data.client.company}</p>
            </div>
          </div>

          {/* Table */}
          <table className="w-full mt-4 border text-center">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">S.No</th>
                <th className="border p-2">Item</th>
                <th className="border p-2">Qty</th>
                <th className="border p-2">Rate</th>
                <th className="border p-2">Amount</th>
              </tr>
            </thead>

            <tbody>
              {data.items.map((item, i) => (
                <tr key={i}>
                  <td className="border p-2">{i + 1}</td>
                  <td className="border p-2">{item.name}</td>
                  <td className="border p-2">{item.qty}</td>
                  <td className="border p-2">₹ {item.price}</td>
                  <td className="border p-2">₹ {item.qty * item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end mt-4">
            <div className="w-1/3 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹ {data.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>GST</span>
                <span>₹ {data.gstAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span>₹ {data.discount}</span>
              </div>
              <div className="flex justify-between font-bold border-t mt-2 pt-2">
                <span>Total</span>
                <span>₹ {data.total}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 border-t pt-4 flex justify-between text-xs">
            <div>
              <p>Bank account name :- Binjwa IT Solutions</p>
              <p>BANK NAME :- ICICI Bank</p>
              <p>BANK ACC no. :- 777705635026</p>
              <p>IFSC Code :- ICIC0006575</p>
              <p>Branch :- Gumasta Nagar, Indore</p>
              <p>Thank you for your business!</p>
            </div>

            <div className="text-right">
              <p>For Binjwa IT Solutions</p>
              <div className="h-12"></div>
              <p>Authorized Signature</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-6 print:hidden">
        <button
          onClick={handlePrint}
          className="bg-green-500 text-white px-6 py-2 rounded"
        >
          Download PDF
        </button>

        <button
          onClick={shareWhatsApp}
          className="bg-green-600 text-white px-6 py-2 rounded"
        >
          Share to WhatsApp
        </button>

        <button
          onClick={shareEmail}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Share to Email
        </button>
      </div>
    </Layout>
  );
}
export default Preview;
