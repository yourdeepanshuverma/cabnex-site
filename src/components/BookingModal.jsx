import React, { useState } from "react";
import { FaTimes } from 'react-icons/fa';
import { api } from '../api/api-config'; // Import from config
import { toast } from 'sonner'; // Import toast for messages

function BookingModal({ isOpen, onClose, packageTitle }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    numberOfTravelers: 1,
    preferredDate: '',
    additionalDetails: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await api.post('/api/v1/auth/travel-query', {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        numberOfTravelers: formData.numberOfTravelers,
        preferredDate: formData.preferredDate,
        additionalDetails: formData.additionalDetails,
        package: packageTitle
      });

      if (response.data.success) {
        setSuccess(true);
        toast.success('Booking request sent successfully!');
        setTimeout(() => {
          onClose();
          setSuccess(false);
          // Reset form data
          setFormData({
            fullName: '',
            email: '',
            phone: '',
            numberOfTravelers: 1,
            preferredDate: '',
            additionalDetails: ''
          });
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to submit booking. Please try again.');
        toast.error(response.data.message || 'Failed to submit booking. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit booking. Please try again.');
      toast.error(err.response?.data?.message || 'Failed to submit booking. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 relative max-h-screen overflow-y-auto"> {/* Changed max-w-md to max-w-2xl */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <FaTimes size={24} />
        </button>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Book {packageTitle}</h3>
        {success ? (
          <div className="text-green-600 text-center mb-4">Booking request sent successfully!</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Added grid layout */}
              <div> {/* Full Name */}
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div> {/* Email */}
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div> {/* Phone */}
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div> {/* Number of Travelers */}
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Travelers</label>
                <input type="number" name="numberOfTravelers" value={formData.numberOfTravelers} onChange={handleChange} min="1" required className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div className="md:col-span-2"> {/* Preferred Date - spans two columns */}
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
                <input type="date" name="preferredDate" value={formData.preferredDate} onChange={handleChange} required className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div className="md:col-span-2"> {/* Additional Message - spans two columns */}
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Details</label>
                <textarea name="additionalDetails" value={formData.additionalDetails} onChange={handleChange} rows="3" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
            </div>
            {error && <div className="text-red-500 text-sm mt-4">{error}</div>}
            <button type="submit" disabled={submitting} className="w-full bg-orange-500 text-white py-3 rounded-full font-semibold hover:bg-orange-600 transition disabled:opacity-50 mt-4">
              {submitting ? 'Submitting...' : 'Submit Booking'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default BookingModal;