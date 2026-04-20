import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UploadCloud, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { useReportContext } from '../../context/ReportContext';
import IncidentMap from '../Map/IncidentMap';
import toast from 'react-hot-toast';

const ReportingModal = ({ isOpen, onClose, editMode = false, initialData = null }) => {
  const { submitIssue, updateIssue } = useReportContext();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    type: '',
    severity: 'Medium',
    description: '',
    location: '',
    image: null,
    imagePreview: null,
    lat: null,
    lng: null
  });

  useEffect(() => {
    if (isOpen) {
      if (editMode && initialData) {
        setFormData({
          type: initialData.type || '',
          severity: initialData.severity || 'Medium',
          description: initialData.description || '',
          location: initialData.location || '',
          image: null,
          imagePreview: initialData.imageUrl || null,
          lat: initialData.latitude || null,
          lng: initialData.longitude || null
        });
      } else {
        setFormData({
          type: '', severity: 'Medium', description: '', location: '', image: null, imagePreview: null, lat: null, lng: null
        });
      }
      setStep(1);
      setError(null);
    }
  }, [isOpen, editMode, initialData]);

  const uploadImageToCloudinary = async (file) => {
    const url = `https://api.cloudinary.com/v1_1/dd9tcqfqp/image/upload`;
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "unsigned_preset");
    const res = await fetch(url, { method: "POST", body: data });
    const result = await res.json();
    return result.secure_url;
  };

  const handleChange = useCallback((key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleChange('image', file);
      handleChange('imagePreview', URL.createObjectURL(file));
    }
  };

  const handleMapClick = (latlng) => {
    handleChange('lat', latlng.lat);
    handleChange('lng', latlng.lng);
  };

  const handleSubmit = async () => {
    if (!formData.type || !formData.description || !formData.location || (!formData.image && !formData.imagePreview) || !formData.lat) {
      setError('Please fill in all required fields and select a location on the map.');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      let imageUrl = formData.imagePreview; 
      
      if (formData.image) {
        imageUrl = await uploadImageToCloudinary(formData.image);
        console.log("(A) Checkpoint: Image uploaded to Cloudinary:", imageUrl);
      } else {
        console.log("(A) Checkpoint: Image unchanged, skipping Cloudinary upload.");
      }

      const payload = {
        type: formData.type,
        severity: formData.severity,
        description: formData.description,
        location: formData.location,
        imageUrl,
        latitude: formData.lat,
        longitude: formData.lng
      };

      console.log("(B) Checkpoint: Initiating Firestore document creation/update...");

      if (editMode) {
        await updateIssue(initialData.id, payload);
      } else {
        await submitIssue(payload);
      }
      
      console.log("(C) Checkpoint: Success callback reached");
      toast.success(editMode ? 'Report updated successfully!' : 'Report submitted successfully!', {
        style: {
          background: 'rgba(30, 41, 59, 0.9)',
          backdropFilter: 'blur(12px)',
          color: '#fff',
          border: '1px solid rgba(16, 185, 129, 0.3)',
        },
      });
      setStep(4);
    } catch (err) {
      console.error("Error during submission:", err);
      setError(err.message);
      toast.error('Submission failed. Please try again.', {
        style: {
          background: 'rgba(30, 41, 59, 0.9)',
          backdropFilter: 'blur(12px)',
          color: '#fff',
          border: '1px solid rgba(239, 68, 68, 0.3)',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="glass-panel bg-white/5 backdrop-blur-lg w-full max-w-lg rounded-3xl overflow-hidden relative shadow-[0_0_30px_rgba(255,255,255,0.05)] border-white/10"
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white z-10 transition-colors">
          <X size={20} />
        </button>

        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white">{editMode ? 'Edit Issue' : 'Report an Issue'}</h2>
            <div className="flex gap-2 mt-4">
              {[1, 2, 3].map(i => (
                <div key={i} className={`h-2 flex-1 rounded-full ${step >= i ? 'bg-primary' : 'bg-surface border border-cardBorder'}`} />
              ))}
            </div>
            {error && (
              <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center gap-2 text-red-200 text-sm">
                <AlertCircle size={16} /> {error}
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300">Category</label>
                      <select 
                        className="w-full bg-surface border border-cardBorder text-white p-4 rounded-xl focus:outline-none focus:border-primary transition-colors"
                        value={formData.type}
                        onChange={(e) => handleChange('type', e.target.value)}
                      >
                        <option value="">Select category</option>
                        <option value="Garbage">Garbage</option>
                        <option value="Road Damage">Road Damage</option>
                        <option value="Street Light">Street Light</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300">Severity</label>
                      <select 
                        className="w-full bg-surface border border-cardBorder text-white p-4 rounded-xl focus:outline-none focus:border-primary transition-colors"
                        value={formData.severity}
                        onChange={(e) => handleChange('severity', e.target.value)}
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                  </div>

                  <label className="block text-sm font-medium text-gray-300 mt-4">Description</label>
                  <textarea 
                    className="w-full bg-surface border border-cardBorder text-white p-4 rounded-xl focus:outline-none focus:border-primary transition-colors min-h-[120px]"
                    placeholder="Describe the issue in detail..."
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                  />
                  <button 
                    onClick={() => setStep(2)}
                    disabled={!formData.type || !formData.description}
                    className="w-full mt-6 bg-primary text-[#0F172A] font-bold p-4 rounded-xl hover:bg-emerald-400 transition-colors disabled:opacity-50"
                  >
                    Next Step
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-300">Image Evidence</label>
                  <div className="border-2 border-dashed border-cardBorder rounded-2xl p-8 flex flex-col items-center justify-center relative cursor-pointer hover:border-primary/50 transition-colors bg-surface overflow-hidden">
                    {formData.imagePreview ? (
                      <div className="w-full h-48 relative">
                        <img src={formData.imagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <span className="text-white font-medium">Change Image</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="w-12 h-12 text-gray-400 mb-4" />
                        <p className="text-gray-300 font-medium font-sm text-center">Click or drag image to upload</p>
                      </>
                    )}
                    <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  </div>

                  <label className="block text-sm font-medium text-gray-300 mt-4">Landmark / Specific Location</label>
                  <input 
                    type="text" 
                    className="w-full bg-surface border border-cardBorder text-white p-4 rounded-xl focus:outline-none focus:border-primary transition-colors"
                    placeholder="e.g. Near Central Park entrance"
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                  />
                  
                  <div className="flex gap-4 mt-6">
                    <button onClick={() => setStep(1)} className="flex-1 bg-surface border border-cardBorder text-white font-bold p-4 rounded-xl hover:bg-white/5 transition-colors">
                      Back
                    </button>
                    <button 
                      onClick={() => setStep(3)}
                      disabled={!formData.imagePreview || !formData.location}
                      className="flex-1 bg-primary text-[#0F172A] font-bold p-4 rounded-xl hover:bg-emerald-400 transition-colors disabled:opacity-50"
                    >
                      Next Step
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-300 flex items-center gap-2">
                    <MapPin size={16} className="text-primary"/> Pin Precisely on Map
                  </label>
                  <div className="relative rounded-2xl overflow-hidden border border-cardBorder">
                    <IncidentMap isModal={true} onMapClick={handleMapClick} />
                    {(!formData.lat) && (
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#0F172A]/80 backdrop-blur block text-white text-xs px-3 py-1.5 rounded-full z-[1000] border border-cardBorder pointer-events-none">
                        Click on the map to place a pin
                      </div>
                    )}
                    {(formData.lat) && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-emerald-500/90 backdrop-blur text-white text-xs px-3 py-1.5 rounded-full z-[1000] border border-emerald-400 font-semibold shadow-lg shadow-emerald-500/20 pointer-events-none">
                        Location Pinned!
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-4 mt-6">
                    <button onClick={() => setStep(2)} className="flex-1 bg-surface border border-cardBorder text-white font-bold p-4 rounded-xl hover:bg-white/5 transition-colors">
                      Back
                    </button>
                    <button 
                      onClick={handleSubmit}
                      disabled={loading || !formData.lat}
                      className="flex-1 bg-primary text-[#0F172A] font-bold p-4 rounded-xl hover:bg-emerald-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? <span className="animate-pulse">{editMode ? 'Updating...' : 'Submitting...'}</span> : (editMode ? 'Save Changes' : 'Submit Report')}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
                  <CheckCircle className="w-10 h-10 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {editMode ? 'Report Updated!' : 'Report Submitted!'}
                </h3>
                <p className="text-gray-400 mb-8">
                  {editMode ? 'Your changes have been saved.' : 'Thank you. Your civic report is now live.'}
                </p>
                <button 
                  onClick={onClose}
                  className="w-full bg-surface border border-cardBorder text-white font-bold p-4 rounded-xl hover:bg-white/5 transition-colors"
                >
                  Close Window
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ReportingModal;
