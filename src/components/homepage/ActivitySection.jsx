import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, endpoints } from '../../api/api-config';
import { toast } from 'sonner';

const ActivitySection = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await api.get(endpoints.travelpackage); // Assuming travelpackage endpoint provides activities
        if (response.data.success) {
          setActivities(response.data.data); // Adjust based on actual API response structure
        } else {
          setError(response.data.message || 'Failed to fetch activities');
          toast.error(response.data.message || 'Failed to fetch activities');
        }
      } catch (err) {
        setError('Network error while fetching activities.');
        toast.error('Network error while fetching activities.');
        console.error('Activity fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const handleBookNow = (activity) => {
    // Navigate to booking details page with activity data
    // The item sent to booking-details expects a 'type' property to distinguish it from a car
    navigate('/booking-details', { state: { item: { type: 'activity', ...activity, data: activity } } });
  };

  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">Popular Activities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-4 w-3/4 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="mt-4 h-10 w-full bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="3xl font-extrabold text-gray-900 text-center mb-8">Popular Activities</h2>
          <p className="text-center text-red-600">{error}</p>
        </div>
      </section>
    );
  }

  if (activities.length === 0) {
    return null; // Or a message indicating no activities
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">Popular Activities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities.map((activity) => (
            <div key={activity._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img className="h-48 w-full object-cover" src={activity.images?.[0]?.url || 'https://via.placeholder.com/300x200?text=Activity'} alt={activity.title} />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{activity.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{activity.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold text-gray-900">₹{activity.pricingOptions?.[0]?.price || activity.price || 0}</span>
                  <span className="text-sm text-gray-500">per person</span>
                </div>
                <button
                  onClick={() => handleBookNow({ ...activity, _id: activity._id })}
                  className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ActivitySection;
