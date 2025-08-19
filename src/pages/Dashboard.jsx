import React, { useMemo } from 'react';
import { useFetch } from '../hooks/useFetch';
import { StatCard } from '../components/UtilityComponents';
import { VehicleIcon, TollBoothIcon, IotDeviceIcon } from '../components/Icons';
import { Spinner } from '../components/UtilityComponents';
import { ErrorMessage } from '../components/UtilityComponents';

/**
 * Dashboard Page Component
 * Displays summary statistics of the toll system.
 * @returns {JSX.Element}
 */
const Dashboard = () => {
    const { data: vehiclesData, loading: vehiclesLoading, error: vehiclesError } = useFetch('/vehicles');
    const { data: boothsData, loading: boothsLoading, error: boothsError } = useFetch('/booths');
    const { data: iotData, loading: iotLoading, error: iotError } = useFetch('/iot');

    const totalVehicles = useMemo(() => vehiclesData?.length || 0, [vehiclesData]);
    const totalBooths = useMemo(() => boothsData?.length || 0, [boothsData]);
    const totalIotDevices = useMemo(() => iotData?.length || 0, [iotData]);
    
    // Calculate total revenue from transactions (assuming an endpoint exists)
    // For now, we'll use a mock value.
    const totalRevenue = 125000;

    if (vehiclesLoading || boothsLoading || iotLoading) return <Spinner />;
    
    const anyError = vehiclesError || boothsError || iotError;
    if (anyError) return <ErrorMessage message={anyError} />;

    return (
        <div className="p-4 md:p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Vehicles" value={totalVehicles}>
                    <VehicleIcon />
                </StatCard>
                <StatCard title="Active Toll Booths" value={totalBooths}>
                    <TollBoothIcon />
                </StatCard>
                <StatCard title="Registered IoT Devices" value={totalIotDevices}>
                    <IotDeviceIcon />
                </StatCard>
                <StatCard title="Total Revenue (Mock)" value={`₹${totalRevenue.toLocaleString('en-IN')}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </StatCard>
            </div>
            {/* Further sections for charts or recent activity can be added here */}
        </div>
    );
};

export default Dashboard;