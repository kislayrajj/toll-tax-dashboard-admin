import React, { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { apiService } from '../services/apiService';
import { Spinner } from '../components/UtilityComponents';
import { ErrorMessage } from '../components/UtilityComponents';
import { Modal } from '../components/UtilityComponents';
import { FormInput } from '../components/UtilityComponents';
import { AddIcon } from '../components/Icons';
import { formatErrorMessage } from '../utils/errorUtils';
import { toUpperCase } from '../utils/textUtils';

/**
 * IoT Devices Page Component
 * Manages assignment, status, and balance of IoT devices.
 * @returns {JSX.Element}
 */
const IotDevices = () => {
    // NOTE: The GET /api/iot endpoint in your controller currently fetches from the Vehicle model.
    // For a complete IoT device list, it should ideally fetch from VehicleIot.find().populate('ownerVehicle').
    // The UI will work with the current setup but might not show unassigned devices.
    const { data: devices, loading, error, refetch } = useFetch('/iot');
    const { data: vehicles } = useFetch('/vehicles'); // Needed for assignment
    const [isAssignModalOpen, setAssignModalOpen] = useState(false);
    const [assignData, setAssignData] = useState({ plateNumber: '', tagId: '' });
    const [formError, setFormError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleTagIdChange = (e) => {
        setAssignData({ ...assignData, tagId: toUpperCase(e.target.value) });
    };

    const handlePlateNumberChange = (e) => {
        setAssignData({ ...assignData, plateNumber: e.target.value });
    };

    const handleAssignSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormError(null);
        try {
            // Ensure tagId is uppercase when sending to API
            const formattedData = {
                ...assignData,
                tagId: toUpperCase(assignData.tagId)
            };
            await apiService.post('/iot/assign', formattedData);
            setAssignModalOpen(false);
            setAssignData({ plateNumber: '', tagId: '' });
            refetch();
        } catch (err) {
            setFormError(formatErrorMessage(err));
        } finally {
            setIsSubmitting(false);
        }
    };


    const handleStatusToggle = async (tagId, currentStatus) => {
        try {
            await apiService.patch('/iot/status', { tagId: toUpperCase(tagId), active: !currentStatus });
            refetch();
        } catch (err) {
            alert(`Failed to update status: ${formatErrorMessage(err)}`);
        }
    };
    
    // NOTE: Your iotRoutes.js has a GET and a DELETE on the same "/:tagId" path.
    // This is ambiguous. Browsers will typically use GET.
    // Assuming the intent was DELETE for the deleteIotDevice controller.
    const handleDelete = async (tagId) => {
         if (window.confirm('Are you sure you want to delete this IoT device?')) {
            try {
                // This might not work if the route isn't explicitly DELETE in Express.
                await apiService.delete(`/iot/${toUpperCase(tagId)}`);
                refetch();
            } catch (err) {
                alert(`Failed to delete device: ${formatErrorMessage(err)}`);
            }
         }
    }

    // Function to copy text to clipboard
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            // Optional: Show a toast or notification that text was copied
            alert(`Copied to clipboard: ${text}`);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    return (
        <div className="p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Manage IoT Devices</h2>
                <button onClick={() => setAssignModalOpen(true)} className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors">
                    <AddIcon /> Assign Device
                </button>
            </div>
            
            {/* Note about backend configuration */}
            {error && error.message && error.message.includes('Cannot populate path') && (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg mb-4">
                    <p className="font-bold">Backend Configuration Note:</p>
                    <p>The backend needs to set the `strictPopulate` option to false to resolve this error.</p>
                </div>
            )}
            
               {loading && <Spinner />}
        {error && <ErrorMessage message={formatErrorMessage(error)} />}

        {!loading && !error && (
            <div className="bg-white shadow-lg rounded-2xl overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tag ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned Vehicle</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {/* --- THIS IS THE FIX --- */}
                        {devices?.map((iotDevice) => (
                            <tr key={iotDevice._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-800">
                                    {toUpperCase(iotDevice.tagId)}
                                    <button 
                                        onClick={() => copyToClipboard(iotDevice.tagId)}
                                        className="ml-2 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded"
                                        title="Copy Tag ID"
                                    >
                                        Copy
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {/* Check if ownerVehicle exists and has a plateNumber */}
                                    {iotDevice.ownerVehicle?.plateNumber || <span className="text-gray-400 italic">Not Assigned</span>}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    ₹{iotDevice.balance.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {iotDevice.ownerVehicle ? ( // Only show the button if the tag is assigned
                                        <button 
                                            onClick={() => handleStatusToggle(iotDevice.tagId, iotDevice.active)}
                                            className={`px-3 py-1 text-xs font-semibold rounded-full ${iotDevice.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                                        >
                                            {iotDevice.active ? 'Active' : 'Inactive'}
                                        </button>
                                    ) : (
                                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                                            Unassigned
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                    <button onClick={() => handleDelete(iotDevice.tagId)} className="text-red-600 hover:text-red-900">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}

            {/* Assign Device Modal */}
            <Modal isOpen={isAssignModalOpen} onClose={() => setAssignModalOpen(false)} title="Assign IoT Device">
                 <form onSubmit={handleAssignSubmit}>
                    {formError && <ErrorMessage message={formError} />}
                    <FormInput label="Tag ID" id="tagId" name="tagId" type="text" value={assignData.tagId} onChange={handleTagIdChange} required />
                    <FormInput label="Vehicle Plate Number" id="plateNumber" name="plateNumber" type="text" value={assignData.plateNumber} onChange={handlePlateNumberChange} required />
                    <div className="mt-6 flex justify-end space-x-3">
                        <button type="button" onClick={() => setAssignModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300">
                            {isSubmitting ? 'Assigning...' : 'Assign'}
                        </button>
                    </div>
                </form>
            </Modal>

        </div>
    );
};

export default IotDevices;