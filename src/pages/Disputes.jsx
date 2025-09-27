import React, { useState } from "react";
import { useFetch } from "../hooks/useFetch";
import {
  Spinner,
  ErrorMessage,
  EmptyState,
} from "../components/UtilityComponents";
import DisputeResolutionModal from "../components/DisputeResolutionModal";

const DisputesPage = () => {
  const {
    data: disputes,
    isLoading,
    isError,
    error,
    refetch: refetchDisputes,
  } = useFetch("/disputes?status=PENDING");

  const [selectedDispute, setSelectedDispute] = useState(null);

  const handleReviewClick = (dispute) => {
    setSelectedDispute(dispute);
    console.log("Reviewing dispute:", dispute);
  };

  const handleCloseModal = () => {
    setSelectedDispute(null);
  };
  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Pending Dispute Reports
      </h2>

      {isLoading && <Spinner />}
      {isError && <ErrorMessage message={error.message} />}

      {!isLoading && !isError && (
        <div className="bg-white shadow-lg rounded-2xl overflow-x-auto">
          {disputes && disputes.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Reported At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Plate Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {disputes.map((dispute) => (
                  <tr key={dispute._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(dispute.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-mono">
                      {dispute.transactionId?.vehicleId?.plateNumber || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {dispute.reason.replace(/_/g, " ")}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleReviewClick(dispute)}
                        className="font-medium text-indigo-600 hover:text-indigo-900">
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState message="No pending disputes to review." />
          )}
        </div>
      )}
      <DisputeResolutionModal
        dispute={selectedDispute}
        onClose={handleCloseModal}
        refetchDisputes={refetchDisputes}
      />
    </div>
  );
};

export default DisputesPage;
