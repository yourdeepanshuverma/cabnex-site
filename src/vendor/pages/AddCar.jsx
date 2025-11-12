import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight, FaPlus } from 'react-icons/fa';
import { api } from '../../api/api-config';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';

const VendorAddCar = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    category: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    registrationNumber: '',
    registerationType: 'Private',
    colour: '',
    status: 'available',
    seatingCapacity: 5,
    fuelType: 'Petrol',
    airConditioning: 'AC',
    features: [
      { key: 'ac', label: 'Air Conditioning', enabled: true },
      { key: 'gps', label: 'GPS Navigation', enabled: false },
      { key: 'wifi', label: 'Wi-Fi', enabled: false },
      { key: 'pet_friendly', label: 'Pet Friendly', enabled: false },
    ],
    insuranceExpiry: '',
    pollutionExpiry: '',
    images: [],
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/api/v1/admin/car-categories');
        if (response.data.success && response.data.data?.categories) {
          setCategories(response.data.data.categories.map((cat) => cat.category));
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        toast.error('Failed to load categories. Please try again.');
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeatureChange = (key) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.map((f) =>
        f.key === key ? { ...f, enabled: !f.enabled } : f
      ),
    }));
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Clear input so same file can be re-selected
    e.target.value = null;

    setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    const urlToRevoke = imagePreviews[index];
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(urlToRevoke);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('make', formData.make);
    data.append('model', formData.model);
    data.append('category', formData.category);
    data.append('year', formData.year.toString());
    data.append('registrationNumber', formData.registrationNumber);
    data.append('registerationType', formData.registerationType);
    data.append('colour', formData.colour);
    data.append('status', formData.status);
    data.append('seatingCapacity', formData.seatingCapacity.toString());
    data.append('fuelType', formData.fuelType.toLowerCase());
    data.append('airConditioning', formData.airConditioning === 'AC' ? 'true' : 'false');

    const enabledFeatures = formData.features.filter(f => f.enabled).map(f => f.key);
    data.append('features', JSON.stringify(enabledFeatures));

    data.append('insuranceExpiry', formData.insuranceExpiry);
    data.append('pollutionExpiry', formData.pollutionExpiry);

    formData.images.forEach((file) => {
      data.append('images', file);
    });

    try {
      const response = await api.post('/api/v1/vendor/cars', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log('API Success:', response.data);
      toast.success('Car added successfully! Redirecting to car list...');
      resetForm();
      setTimeout(() => {
        navigate('/vendor/car-list');
      }, 2000);
    } catch (err) {
      console.error('API Error:', err);
      const errorMsg = err.response?.data?.message || 'Failed to add car. Please try again.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      category: '',
      make: '',
      model: '',
      year: new Date().getFullYear(),
      registrationNumber: '',
      registerationType: 'Private',
      colour: '',
      status: 'available',
      seatingCapacity: 5,
      fuelType: 'Petrol',
      airConditioning: 'AC',
      features: [
        { key: 'ac', label: 'Air Conditioning', enabled: true },
        { key: 'gps', label: 'GPS Navigation', enabled: false },
        { key: 'wifi', label: 'Wi-Fi', enabled: false },
        { key: 'pet_friendly', label: 'Pet Friendly', enabled: false },
      ],
      insuranceExpiry: '',
      pollutionExpiry: '',
      images: [],
    });
    setImagePreviews([]);
    setCurrentStep(1);
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const validateStep = (step) => {
    if (step === 1) {
      return formData.category && formData.make && formData.model && formData.year;
    }
    if (step === 2) {
      return (
        formData.registrationNumber &&
        formData.registerationType &&
        formData.colour &&
        formData.status &&
        formData.seatingCapacity &&
        formData.fuelType &&
        formData.airConditioning
      );
    }
    return formData.insuranceExpiry && formData.pollutionExpiry && formData.images.length > 0;
  };

  const ProgressBar = () => (
    <div className="flex items-center justify-between mb-6">
      {[1, 2, 3].map((step, index) => (
        <React.Fragment key={step}>
          {index > 0 && (
            <div className="flex-1 h-1 bg-gray-300 dark:bg-gray-600 mx-2">
              <div
                className={`h-full transition-all duration-300 ${
                  currentStep > step - 1 ? 'bg-[#2563EB]' : 'bg-gray-300 dark:bg-gray-600'
                }`}
                style={{ width: currentStep > step ? '100%' : '0%' }}
              />
            </div>
          )}
          <div className="text-center">
            <div
              className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center text-white ${
                currentStep >= step ? 'bg-[#2563EB]' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              {step}
            </div>
            <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">
              {step === 1 ? 'Basic Details' : step === 2 ? 'Specifications' : 'Features & Expiry Dates'}
            </p>
          </div>
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="space-y-8 dark:bg-gray-900">
      <style>
        {`
          .form-container {
            background: linear-gradient(135deg, #ffffff, #f8f9fa);
            border-radius: 1.5rem;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
          }
          .dark .form-container {
            background: linear-gradient(135deg, #1f2937, #374151);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          }
          .input-field {
            border-radius: 2rem;
            padding: 0.75rem 1rem;
            border: 1px solid #d1d5db;
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
          }
          .dark .input-field {
            border-color: #4b5563;
            background-color: #374151;
            color: #ffffff;
          }
          .input-field:focus {
            border-color: #2563EB;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
          }
          .btn-primary {
            background-color: #2563EB;
            border-radius: 0.75rem;
            padding: 0.5rem 1.5rem;
            color: white;
            transition: background-color 0.2s ease;
          }
          .btn-primary:hover {
            background-color: #1E40AF;
          }
          .btn-secondary {
            background-color: #6b7280;
            border-radius: 0.75rem;
            padding: 0.5rem 1.5rem;
            color: white;
            transition: background-color 0.2s ease;
          }
          .btn-secondary:hover {
            background-color: #4b5563;
          }
        `}
      </style>

      <div className="form-container p-6">
        <h3 className="text-2xl font-grotesk font-bold text-gray-800 dark:text-gray-200 mb-6">Add New Car</h3>

        <ProgressBar />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* STEP 1 */}
          {currentStep === 1 && (
            <div>
              <div className="mb-6">
                <h4 className="text-lg font-grotesk font-medium text-gray-700 dark:text-gray-300">
                  <span className="text-[#2563EB]"> Step 1:</span> Basic Details
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Provide the core information about your vehicle to help customers identify it easily.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="input-field block w-full" required>
                    <option value="">Select Category</option>
                    {categories.map((cat, idx) => (
                      <option key={idx} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Make / Brand</label>
                  <input type="text" name="make" value={formData.make} onChange={handleChange} className="input-field block w-full" required />
                </div>
                <div>
                  <label className="block text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Model</label>
                  <input type="text" name="model" value={formData.model} onChange={handleChange} className="input-field block w-full" required />
                </div>
                <div>
                  <label className="block text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Year of Manufacture</label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="input-field block w-full"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {currentStep === 2 && (
            <div>
              <div className="mb-6">
                <h4 className="text-lg font-grotesk font-medium text-gray-700 dark:text-gray-300">
                  <span className="text-[#2563EB]"> Step 2:</span> Vehicle Specifications
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Specify the vehicle's characteristics to ensure it meets customer preferences.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Registration Number</label>
                  <input type="text" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} className="input-field block w-full" required />
                </div>
                <div>
                  <label className="block text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Registration Type</label>
                  <select name="registerationType" value={formData.registerationType} onChange={handleChange} className="input-field block w-full" required>
                    <option value="Private">Private</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Temporary">Temporary</option>
                  </select>
                </div>
                <div>
                  <label className="block text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Vehicle Color</label>
                  <input type="text" name="colour" value={formData.colour} onChange={handleChange} className="input-field block w-full" required />
                </div>
                <div>
                  <label className="block text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="input-field block w-full" required>
                    <option value="available">Available</option>
                    <option value="rented">Rented</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>
                <div>
                  <label className="block text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Seating Capacity</label>
                  <input type="number" name="seatingCapacity" value={formData.seatingCapacity} onChange={handleChange} className="input-field block w-full" min="1" required />
                </div>
                <div>
                  <label className="block text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Fuel Type</label>
                  <select name="fuelType" value={formData.fuelType} onChange={handleChange} className="input-field block w-full" required>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-md font-medium text-gray-700 dark:text-gray-300 mb-2">AC / Non-AC</label>
                  <select name="airConditioning" value={formData.airConditioning} onChange={handleChange} className="input-field block w-full" required>
                    <option value="AC">AC</option>
                    <option value="Non-AC">Non-AC</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {currentStep === 3 && (
            <div>
              <div className="mb-6">
                <h4 className="text-lg font-grotesk font-medium text-gray-700 dark:text-gray-300">
                  <span className="text-[#2563EB]"> Step 3:</span> Features & Expiry Dates
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Select features and provide expiry dates to enhance your vehicle's appeal.
                </p>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Features</label>
                  <div className="grid grid-cols-2 gap-2">
                    {formData.features.map((feature) => (
                      <div key={feature.key} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={feature.enabled}
                          onChange={() => handleFeatureChange(feature.key)}
                          className="h-4 w-4 text-[#2563EB] focus:ring-[#2563EB] border-gray-300 rounded"
                        />
                        <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">{feature.label}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between gap-4">
                  <div className="w-full">
                    <label className="block text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Insurance Expiry Date</label>
                    <input type="date" name="insuranceExpiry" value={formData.insuranceExpiry} onChange={handleChange} className="input-field block w-full" required />
                  </div>
                  <div className="w-full">
                    <label className="block text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Pollution Certification Expiry</label>
                    <input type="date" name="pollutionExpiry" value={formData.pollutionExpiry} onChange={handleChange} className="input-field block w-full" required />
                  </div>
                </div>

                {/* IMAGES WITH REMOVE BUTTON */}
                <div>
                  <label className="block text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Vehicle Images {formData.images.length > 0 && `(${formData.images.length})`}
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImagesChange}
                    className="input-field block w-full"
                    // required REMOVED — validation via state
                  />
                  {imagePreviews.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-4">
                      {imagePreviews.map((preview, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${idx + 1}`}
                            className="w-full h-32 object-cover rounded-md shadow-md"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            title="Remove image"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* NAVIGATION BUTTONS */}
          <div className="flex justify-between mt-6">
            {currentStep > 1 && (
              <button type="button" onClick={prevStep} className="btn-secondary inline-flex items-center">
                <FaArrowLeft className="mr-2 w-4 h-4" /> Previous
              </button>
            )}
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!validateStep(currentStep)}
                className="btn-primary inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
              >
                Next <FaArrowRight className="ml-2 w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!validateStep(currentStep) || loading}
                className="btn-primary inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
              >
                {loading ? <>Adding...</> : <><FaPlus className="mr-2 w-4 h-4" /> Add Car</>}
              </button>
            )}
          </div>
        </form>
      </div>

      <Toaster position="top-center" richColors closeButton />
    </div>
  );
};

export default VendorAddCar;