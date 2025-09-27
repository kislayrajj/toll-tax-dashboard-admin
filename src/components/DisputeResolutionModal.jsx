import React, { useState, useEffect } from "react";
import { useSubmit } from "../hooks/useSubmit";
import { useQueryClient } from "@tanstack/react-query";

const DisputeResolutionModal = ({ dispute, onClose }) => {
  const queryClient = useQueryClient();
  const [resolution, setResolution] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const { mutate: resolveDispute, isLoading } = useSubmit();

  useEffect(() => {
    // Reset form when a new dispute is selected
    if (dispute) {
      setResolution("");
      setAdminNotes("");
    }
  }, [dispute]);

  if (!dispute) return null;

  const handleSubmit = () => {
    if (!resolution) {
      alert("Please select a resolution status.");
      return;
    }

    resolveDispute(
      {
        endpoint: `/disputes/${dispute._id}/resolve`,
        method: "post",
        body: { resolution, adminNotes },
      },
      {
        onSuccess: () => {
          alert("Dispute resolved successfully!");
          queryClient.invalidateQueries({ queryKey: ["disputes"] });
          onClose();
          onClose(); // Close the modal
        },
        onError: (error) => {
          alert(`Failed to resolve dispute: ${error.message}`);
        },
      }
    );
  };

  const transaction = dispute.transactionId || {};
  const vehicle = transaction.vehicleId || {};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold text-gray-800">
            Review Dispute
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl">
            &times;
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
          {/* Left Column: Details */}
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-bold text-gray-500 uppercase">
                Vehicle Details
              </h4>
              <p className="font-mono text-gray-800">
                {vehicle.plateNumber || "N/A"}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-500 uppercase">
                Transaction Details
              </h4>
              <p className="text-sm text-gray-600">
                Amount: ₹{transaction.amount?.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">
                Date: {new Date(transaction.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-500 uppercase">
                User Report
              </h4>
              <p className="text-sm font-semibold text-red-600">
                {dispute.reason.replace(/_/g, " ")}
              </p>
              <p className="text-sm text-gray-600 italic">
                "{dispute.userComment || "No comment provided."}"
              </p>
            </div>
          </div>

          {/* Right Column: Evidence & Action */}
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-bold text-gray-500 uppercase">
                ANPR & Video Evidence
              </h4>
              <div className="bg-gray-200 h-32 flex items-center justify-center rounded-md">
                <p className="text-gray-500 text-sm">
                  (Video player placeholder)
                </p>
              </div>
            </div>
            <div>
              <label
                htmlFor="resolution"
                className="block text-sm font-bold text-gray-500 uppercase">
                Resolution
              </label>
              <select
                id="resolution"
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md">
                <option value="">-- Select Action --</option>
                <option value="RESOLVED">Approve Refund</option>
                <option value="DENIED">Deny Report</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="adminNotes"
                className="block text-sm font-bold text-gray-500 uppercase">
                Admin Notes
              </label>
              <textarea
                id="adminNotes"
                rows="2"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md"></textarea>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-4 bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!resolution || isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300">
            {isLoading ? "Processing..." : "Resolve Dispute"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisputeResolutionModal;
