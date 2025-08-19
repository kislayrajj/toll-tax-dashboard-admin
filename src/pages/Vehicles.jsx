import React, { useState, useRef } from "react"; // Import useRef
import { useFetch } from "../hooks/useFetch";
import { apiService } from "../services/apiService";
import {
  Spinner,
  ErrorMessage,
  Modal,
  FormInput,
} from "../components/UtilityComponents";
import { AddIcon, CopyIcon, DeleteIcon } from "../components/Icons";
import { formatErrorMessage } from "../utils/errorUtils";
import { toUpperCase, capitalizeWords } from "../utils/textUtils";

/**
 * Vehicles Page Component
 * Manages registration, viewing, and deletion of vehicles.
 * @returns {JSX.Element}
 */
const Vehicles = () => {
  const { data: vehicles, loading, error, refetch } = useFetch("/vehicles");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    plateNumber: "",
    ownerName: "",
    vehicleType: "",
    homeTownCoordinates: "",
  });
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // NEW STATE: To track which item was copied for a brief moment.
  // It will store a unique identifier like 'vehicleId-plate' or 'vehicleId-tag'.
  const [copiedIdentifier, setCopiedIdentifier] = useState(null);
  const copyTimeoutRef = useRef(null); // To manage the timeout

  const handleInputChangeFormatted = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "plateNumber") {
      formattedValue = toUpperCase(value);
    } else if (name === "ownerName") {
      formattedValue = capitalizeWords(value);
    }

    setFormData({ ...formData, [name]: formattedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ... (rest of the function is unchanged)
    setIsSubmitting(true);
    setFormError(null);
    try {
      const coords = formData.homeTownCoordinates
        .split(",")
        .map((c) => parseFloat(c.trim()));
      if (coords.length !== 2 || isNaN(coords[0]) || isNaN(coords[1])) {
        throw new Error(
          "Invalid coordinates format. Use 'longitude, latitude'."
        );
      }
      await apiService.post("/vehicles/register", {
        ...formData,
        homeTownCoordinates: coords,
      });
      setIsModalOpen(false);
      setFormData({
        plateNumber: "",
        ownerName: "",
        vehicleType: "",
        homeTownCoordinates: "",
      });
      refetch();
    } catch (err) {
      setFormError(formatErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    // ... (function is unchanged)
    if (
      window.confirm(
        "Are you sure you want to delete this vehicle? This action cannot be undone."
      )
    ) {
      try {
        await apiService.delete(`/vehicles/${id}`);
        refetch();
      } catch (err) {
        alert(`Failed to delete vehicle: ${formatErrorMessage(err)}`);
      }
    }
  };

  // MODIFIED FUNCTION: Now sets state for feedback instead of alerting.
  const copyToClipboard = (text, identifier) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedIdentifier(identifier); // Set which item is copied

        // Clear any existing timeout to prevent conflicts
        if (copyTimeoutRef.current) {
          clearTimeout(copyTimeoutRef.current);
        }

        // Set a new timeout to clear the "Copied!" message after 2 seconds
        copyTimeoutRef.current = setTimeout(() => {
          setCopiedIdentifier(null);
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Vehicles</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors">
          <AddIcon /> Register Vehicle
        </button>
      </div>

      {loading && <Spinner />}
      {error && <ErrorMessage message={formatErrorMessage(error)} />}

      {!loading && !error && (
        <div className="bg-white shadow-lg rounded-2xl overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plate Number
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IoT Device
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vehicles?.map((vehicle) => {
                // Define unique identifiers for this row's copyable items
                const plateIdentifier = `${vehicle._id}-plate`;
                const tagIdentifier = `${vehicle._id}-tag`;

                return (
                  <tr key={vehicle._id} className="hover:bg-gray-50">
                    {/* MODIFICATION: Inline copy icon with feedback */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="flex items-center space-x-2">
                        <span>{toUpperCase(vehicle.plateNumber)}</span>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              vehicle.plateNumber,
                              plateIdentifier
                            )
                          }
                          className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
                          title="Copy Plate Number">
                          {copiedIdentifier === plateIdentifier ? (
                            <span className="text-xs text-blue-500 font-bold">
                              Copied!
                            </span>
                          ) : (
                            <CopyIcon className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {capitalizeWords(vehicle.ownerName)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vehicle.vehicleType}
                    </td>
                    {/* MODIFICATION: Inline copy icon with feedback, only shown if tag exists */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vehicle.iotDevice ? (
                        <div className="flex items-center space-x-2">
                          <span>{vehicle.iotDevice.tagId}</span>
                          <button
                            onClick={() =>
                              copyToClipboard(
                                vehicle.iotDevice.tagId,
                                tagIdentifier
                              )
                            }
                            className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
                            title="Copy Tag ID">
                            {copiedIdentifier === tagIdentifier ? (
                              <span className="text-xs text-blue-500 font-bold">
                                Copied!
                              </span>
                            ) : (
                              <CopyIcon className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    {/* MODIFICATION: Actions column is now only for primary actions (Delete) */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center">
                        <button
                          onClick={() => handleDelete(vehicle._id)}
                          className="text-gray-500 hover:text-red-600"
                          title="Delete Vehicle">
                          <DeleteIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* The Modal and Form section remains unchanged */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register New Vehicle">
        <form onSubmit={handleSubmit}>
          {formError && <ErrorMessage message={formError} />}
          <FormInput
            label="Plate Number"
            id="plateNumber"
            name="plateNumber"
            type="text"
            value={formData.plateNumber}
            onChange={handleInputChangeFormatted}
            required
          />
          <FormInput
            label="Owner Name"
            id="ownerName"
            name="ownerName"
            type="text"
            value={formData.ownerName}
            onChange={handleInputChangeFormatted}
            required
          />
          <FormInput
            label="Vehicle Type"
            id="vehicleType"
            name="vehicleType"
            type="text"
            value={formData.vehicleType}
            onChange={handleInputChangeFormatted}
            required
          />
          <FormInput
            label="Hometown Coordinates (lon, lat)"
            id="homeTownCoordinates"
            name="homeTownCoordinates"
            type="text"
            placeholder="e.g., 73.856, 18.520"
            value={formData.homeTownCoordinates}
            onChange={handleInputChangeFormatted}
          />
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300">
              {isSubmitting ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Vehicles;
