import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import useAuthStore from '../store/authStore';
import AuthModal from '../components/auth/AuthModal';

const { 
  FiUpload, FiX, FiCamera, FiChevronDown, FiPlay,
  FiAlertTriangle, FiCheck
} = FiIcons;

function UploadPage() {
  const { user } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isShort, setIsShort] = useState(false);
  const [visibility, setVisibility] = useState('public');
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  
  const fileInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);
  const navigate = useNavigate();
  
  // Redirect to login if not authenticated
  if (!user && !showAuthModal) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md p-8 bg-white rounded-lg shadow-lg"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Sign In to Upload Videos</h2>
          <p className="text-gray-600 mb-6">
            You need to sign in or create an account to upload videos.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAuthModal(true)}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Sign In
          </motion.button>
        </motion.div>
        
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </div>
    );
  }
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    
    // Create preview URL
    const url = URL.createObjectURL(selectedFile);
    setPreview(url);
    
    // Automatically set title from filename if empty
    if (!title) {
      const fileName = selectedFile.name.replace(/\.[^/.]+$/, ""); // Remove extension
      setTitle(fileName.replace(/[_-]/g, " ")); // Replace underscores and dashes with spaces
    }
  };
  
  const handleThumbnailChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    setThumbnailFile(selectedFile);
    
    // Create preview URL
    const url = URL.createObjectURL(selectedFile);
    setThumbnailPreview(url);
  };
  
  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
  };
  
  const handleRemoveThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
  };
  
  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress > 100) {
        progress = 100;
        clearInterval(interval);
        
        // Simulate processing delay
        setTimeout(() => {
          setUploadComplete(true);
          setUploading(false);
        }, 1500);
      }
      setUploadProgress(Math.floor(progress));
    }, 500);
  };
  
  const handleNewUpload = () => {
    setFile(null);
    setPreview(null);
    setTitle('');
    setDescription('');
    setCategory('');
    setIsShort(false);
    setVisibility('public');
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setUploading(false);
    setUploadProgress(0);
    setUploadComplete(false);
  };
  
  const categoryOptions = [
    { id: 'entertainment', label: 'Entertainment' },
    { id: 'music', label: 'Music' },
    { id: 'education', label: 'Education' },
    { id: 'gaming', label: 'Gaming' },
    { id: 'sports', label: 'Sports' },
    { id: 'technology', label: 'Technology' },
    { id: 'travel', label: 'Travel' },
    { id: 'comedy', label: 'Comedy' },
    { id: 'news', label: 'News & Politics' },
    { id: 'howto', label: 'Howto & Style' },
  ];
  
  if (uploadComplete) {
    return (
      <div className="max-w-3xl mx-auto pt-8">
        <motion.div
          className="bg-white p-8 rounded-lg shadow-md text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <SafeIcon icon={FiCheck} className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Upload Complete!</h2>
          <p className="text-gray-600 mb-8">
            Your video "{title}" has been successfully uploaded and is now being processed. 
            It will be available on your channel shortly.
          </p>
          <div className="flex justify-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/account')}
              className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Go to My channel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNewUpload}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Upload Another Video
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="max-w-5xl mx-auto pt-8">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Upload Video</h1>
        <p className="text-gray-600">
          Share your videos with the world
        </p>
      </motion.div>
      
      {file ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {uploading ? (
            <div className="p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Uploading "{title}"</h2>
              <div className="mb-4">
                <div className="h-4 bg-gray-200 rounded-full">
                  <div 
                    className="h-4 bg-red-600 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>{uploadProgress}% complete</span>
                  <span>Uploading... {Math.floor(file.size / 1024 / 1024 * uploadProgress / 100)} MB / {Math.floor(file.size / 1024 / 1024)} MB</span>
                </div>
              </div>
              <p className="text-gray-500 text-center">
                Please do not close this window until the upload is complete.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 p-6 border-r border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-4">Video Preview</h3>
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-4">
                  {preview && (
                    <video 
                      src={preview} 
                      className="w-full h-full object-contain"
                      controls
                    ></video>
                  )}
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleRemoveFile}
                    className="absolute top-2 right-2 p-1 bg-black bg-opacity-70 rounded-full text-white"
                  >
                    <SafeIcon icon={FiX} className="w-4 h-4" />
                  </motion.button>
                </div>
                <p className="text-sm text-gray-500 mb-2">File details:</p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Name:</span> {file.name}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Size:</span> {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Type:</span> {file.type}
                </p>
              </div>
              
              <div className="md:col-span-2 p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Add a title that describes your video"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Tell viewers about your video"
                      rows={4}
                    ></textarea>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <div className="relative">
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none"
                        >
                          <option value="">Select a category</option>
                          {categoryOptions.map(option => (
                            <option key={option.id} value={option.id}>{option.label}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <SafeIcon icon={FiChevronDown} className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Visibility
                      </label>
                      <div className="relative">
                        <select
                          value={visibility}
                          onChange={(e) => setVisibility(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none"
                        >
                          <option value="public">Public</option>
                          <option value="unlisted">Unlisted</option>
                          <option value="private">Private</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <SafeIcon icon={FiChevronDown} className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id="isShort"
                        checked={isShort}
                        onChange={(e) => setIsShort(e.target.checked)}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isShort" className="ml-2 block text-sm text-gray-700">
                        Mark as Short Video (vertical format)
                      </label>
                    </div>
                    {isShort && (
                      <p className="text-sm text-gray-500">
                        Shorts are short, vertical videos that are easy to create and fun to watch.
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Custom Thumbnail
                    </label>
                    {thumbnailPreview ? (
                      <div className="relative w-48 h-27 bg-black rounded-lg overflow-hidden mb-2">
                        <img 
                          src={thumbnailPreview} 
                          alt="Thumbnail preview" 
                          className="w-full h-full object-cover"
                        />
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={handleRemoveThumbnail}
                          className="absolute top-2 right-2 p-1 bg-black bg-opacity-70 rounded-full text-white"
                        >
                          <SafeIcon icon={FiX} className="w-4 h-4" />
                        </motion.button>
                      </div>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => thumbnailInputRef.current?.click()}
                        className="w-48 h-27 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-4 hover:border-red-500 hover:bg-red-50 transition-colors"
                      >
                        <SafeIcon icon={FiCamera} className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">Upload thumbnail</span>
                      </motion.button>
                    )}
                    <input 
                      type="file"
                      ref={thumbnailInputRef}
                      onChange={handleThumbnailChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Use a custom thumbnail to attract more viewers (JPG, PNG, GIF)
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 flex justify-end space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleRemoveFile}
                      className="px-6 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleUpload}
                      disabled={!title}
                      className={`px-6 py-2 rounded-lg ${
                        title ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      } transition-colors`}
                    >
                      Upload
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <motion.div
          className="bg-white p-12 rounded-lg shadow-md text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <SafeIcon icon={FiUpload} className="w-10 h-10 text-red-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Upload a video
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Drag and drop a video file to upload or click the button below to select a file
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Select File
          </motion.button>
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="video/*"
            className="hidden"
          />
          
          <div className="mt-8 text-sm text-gray-500">
            <p>By submitting your videos to VideoHub, you acknowledge that you agree to</p>
            <p>VideoHub's Terms of Service and Community Guidelines.</p>
            <p className="mt-2">Please be sure not to violate others' copyright or privacy rights.</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default UploadPage;