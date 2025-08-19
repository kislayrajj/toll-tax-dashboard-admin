import React, { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { apiService } from '../services/apiService';
import { Spinner } from '../components/UtilityComponents';
import { ErrorMessage } from '../components/UtilityComponents';
import { Modal } from '../components/UtilityComponents';
import { FormInput } from '../components/UtilityComponents';
import { AddIcon } from '../components/Icons';
import { formatErrorMessage } from '../utils/errorUtils';
import { toUpperCase, capitalizeWords } from '../utils/textUtils';

/**
 * Toll Booths Page Component
 * Manages creation and viewing of toll booths.
 * @returns {JSX.Element}
 */
const TollBooths = () => {
    const { data: booths, loading, error, refetch } = useFetch('/booths');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ boothId: '', name: '', coordinates: '', tollAmount: '' });
    const [formError, setFormError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChangeFormatted = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;
        
        // Apply formatting based on field name
        if (name === 'boothId') {
            formattedValue = toUpperCase(value);
        } else if (name === 'name') {
            formattedValue = capitalizeWords(value);
        }
        
        setFormData({ ...formData, [name]: formattedValue });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormError(null);
        try {
            const coords = formData.coordinates.split(',').map(c => parseFloat(c.trim()));
            if (coords.length !== 2 || isNaN(coords[0]) || isNaN(coords[1])) {
                throw new Error("Invalid coordinates format. Use 'longitude, latitude'.");
            }
            // Ensure boothId is uppercase and name is capitalized when sending to API
            await apiService.post('/booths/create', {
                boothId: toUpperCase(formData.boothId),
                name: capitalizeWords(formData.name),
                location: { coordinates: coords },
                tollAmount: parseFloat(formData.tollAmount)
            });
            setIsModalOpen(false);
            setFormData({ boothId: '', name: '', coordinates: '', tollAmount: '' });
            refetch();
        } catch (err) {
            setFormError(formatErrorMessage(err));
        } finally {
            setIsSubmitting(false);
        }
    };

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
                <h2 className="text-2xl font-bold text-gray-800">Manage Toll Booths</h2>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors">
                    <AddIcon /> Create Booth
                </button>
            </div>

            {loading && <Spinner />}
            {error && <ErrorMessage message={formatErrorMessage(error)} />}

            {!loading && !error && (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {booths?.map((booth) => (
                        <div key={booth._id} className="bg-white p-5 rounded-xl shadow-md">
                            <h3 className="text-lg font-bold text-gray-800">{capitalizeWords(booth.name)}</h3>
                            <p className="text-sm text-gray-500">
                                {toUpperCase(booth.boothId)}
                                <button 
                                    onClick={() => copyToClipboard(booth.boothId)}
                                    className="ml-2 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded"
                                    title="Copy Booth ID"
                                >
                                    Copy
                                </button>
                            </p>
                            <p className="mt-2 text-2xl font-semibold text-blue-600">₹{booth.tollAmount}</p>
                            <p className="text-xs text-gray-400 mt-1">
                                Coords: {booth.location.coordinates.join(', ')}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Toll Booth">
                <form onSubmit={handleSubmit}>
                    {formError && <ErrorMessage message={formError} />}
                    <FormInput label="Booth ID" id="boothId" name="boothId" type="text" value={formData.boothId} onChange={handleInputChangeFormatted} required />
                    <FormInput label="Booth Name" id="name" name="name" type="text" value={formData.name} onChange={handleInputChangeFormatted} required />
                    <FormInput label="Toll Amount" id="tollAmount" name="tollAmount" type="number" value={formData.tollAmount} onChange={handleInputChangeFormatted} required />
                    <FormInput label="Location Coordinates (lon, lat)" id="coordinates" name="coordinates" type="text" placeholder="e.g., 73.349, 18.784" value={formData.coordinates} onChange={handleInputChangeFormatted} required />
                    <div className="mt-6 flex justify-end space-x-3">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300">
                            {isSubmitting ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default TollBooths;