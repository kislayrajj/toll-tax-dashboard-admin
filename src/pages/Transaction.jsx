import React from "react";
import { useFetch } from "../hooks/useFetch";
import { Spinner, ErrorMessage } from "../components/UtilityComponents";
import { formatErrorMessage } from "../utils/errorUtils";

// A small helper component to style the status badges with user-friendly text
const StatusBadge = ({ status }) => {
  const statusStyles = {
    paid: "bg-green-100 text-green-800",
    hometown_exempt: "bg-blue-100 text-blue-800",
    insufficient_balance: "bg-yellow-100 text-yellow-800",
    tag_inactive: "bg-orange-100 text-orange-800",
    vehicle_not_registered: "bg-red-100 text-red-800",
  };

  const statusDisplay = {
    paid: "Paid",
    hometown_exempt: "Exempt (Hometown)",
    insufficient_balance: "Not Paid (Insufficient Balance)",
    tag_inactive: "Not Paid (Tag Inactive)",
    vehicle_not_registered: "Failed (Unregistered Tag)",
  };

  const displayText = statusDisplay[status] || status.replace(/_/g, " ");

  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${
        statusStyles[status] || "bg-gray-100 text-gray-800"
      }`}>
      {displayText}
    </span>
  );
};

const Transactions = () => {
  const {
    data: transactions,
    loading,
    error,
    refetch,
  } = useFetch("/transactions");

  return (
    <div className="p-4 md:p-6">
      <div className="flex gap-20 items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Transaction Log</h2>

        {/* 🔄 Refresh Button */}
      {/*   <button
          onClick={refetch}
          disabled={loading}
          className={`px-4 py-2 text-sm font-medium rounded-lg shadow transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-slate-600 text-white cursor-pointer hover:bg-blue-700"
          }`}>
          {loading ? "Refreshing..." : "Refresh"}
        </button>*/}
      </div>

      {loading && <Spinner />}
      {error && <ErrorMessage message={formatErrorMessage(error)} />}

      {!loading && !error && (
        <div>
          {/* --- DESKTOP TABLE --- */}
          <div className="hidden md:block bg-white shadow-lg rounded-2xl overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Plate Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Toll Booth
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions?.map((tx) => (
                  <tr key={tx._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(tx.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-800">
                      {tx.vehicleId?.plateNumber || (
                        <span className="text-gray-400 italic">
                          {tx.tagId} (Unregistered)
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {tx.boothId?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{tx.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={tx.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* --- MOBILE CARD LIST --- */}
          <div className="md:hidden space-y-4">
            {transactions?.map((tx) => (
              <div
                key={tx._id}
                className="bg-white shadow-lg rounded-2xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-lg text-gray-800">
                    {tx.vehicleId?.plateNumber || (
                      <span className="italic">{tx.tagId}</span>
                    )}
                  </span>
                  <StatusBadge status={tx.status} />
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Toll Booth</span>
                    <span className="font-medium text-gray-800">
                      {tx.boothId?.name || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-500">Amount</span>
                    <span className="font-medium text-gray-800">
                      ₹{tx.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-500">Date</span>
                    <span className="font-medium text-gray-800">
                      {new Date(tx.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
