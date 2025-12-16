import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAuction } from '../../services/auctionService';
import './CreateAuctionPage.css';

const CreateAuctionPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startingPrice: '',
    currentBid: '',
    endDate: '',
    imageUrl: '',
    category: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({
          ...prev,
          imageUrl: reader.result // Store base64 in imageUrl
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData(prev => ({
      ...prev,
      imageUrl: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Prepare the auction data
      // Convert datetime-local format to ISO format for backend
      const endTimeISO = formData.endDate ? new Date(formData.endDate).toISOString() : null;
      
      const auctionData = {
        title: formData.title,
        description: formData.description,
        startingPrice: parseFloat(formData.startingPrice),
        currentPrice: parseFloat(formData.currentBid || formData.startingPrice),
        status: 'OPEN',
        endTime: endTimeISO,
        imageUrl: formData.imageUrl || '',
        category: formData.category || '',
        bids: 0
      };

      await createAuction(auctionData);

      setSuccess(true);
      // Reset form
      setFormData({
        title: '',
        description: '',
        startingPrice: '',
        currentBid: '',
        endDate: '',
        imageUrl: '',
        category: ''
      });
      setImageFile(null);
      setImagePreview(null);

      // Redirect after successful creation
      setTimeout(() => navigate('/dashboard/auctions'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create auction. Please make sure the server is running.');
      console.error('Error creating auction:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-auction-page">
      <div className="create-auction-container">
        <h1>Create New Auction</h1>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            Auction created successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="auction-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter auction title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Enter detailed description"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startingPrice">Starting Price ($) *</label>
              <input
                type="number"
                id="startingPrice"
                name="startingPrice"
                value={formData.startingPrice}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label htmlFor="currentBid">Current Bid ($)</label>
              <input
                type="number"
                id="currentBid"
                name="currentBid"
                value={formData.currentBid}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="Same as starting price"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="endDate">End Date & Time *</label>
              <input
                type="datetime-local"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g., Electronics, Art, Collectibles"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="imageFile">Auction Image</label>
            <div className="file-upload-container">
              <input
                type="file"
                id="imageFile"
                name="imageFile"
                onChange={handleImageChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <label htmlFor="imageFile" className="file-upload-label">
                <span className="upload-icon">📷</span>
                <span>{imageFile ? imageFile.name : 'Click to upload image'}</span>
                <span className="upload-hint">PNG, JPG, GIF up to 5MB</span>
              </label>
            </div>
          </div>

          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
              <button
                type="button"
                className="remove-image-btn"
                onClick={handleRemoveImage}
              >
                ✕ Remove
              </button>
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setFormData({
                  title: '',
                  description: '',
                  startingPrice: '',
                  currentBid: '',
                  endDate: '',
                  imageUrl: '',
                  category: ''
                });
                setImageFile(null);
                setImagePreview(null);
              }}
            >
              Reset
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Auction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAuctionPage;
