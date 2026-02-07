import { useState } from 'react';
import axios from 'axios';
import './ImageUpload.css';

const ImageUpload = ({ onUploadComplete, currentImage }) => {
    const [preview, setPreview] = useState(currentImage || null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image size should be less than 5MB');
            return;
        }

        setError('');

        // Show preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);

        // Upload to server
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:3000/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const imagePath = response.data;
            onUploadComplete(`http://localhost:3000${imagePath}`);
        } catch (err) {
            setError('Upload failed. Please try again.');
            console.error('Upload error:', err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="image-upload">
            <div className="upload-preview">
                {preview ? (
                    <img src={preview} alt="Preview" />
                ) : (
                    <div className="upload-placeholder">
                        <span>📷</span>
                        <p>No image selected</p>
                    </div>
                )}
            </div>
            <div className="upload-controls">
                <label htmlFor="file-input" className="upload-btn">
                    {uploading ? 'Uploading...' : 'Choose Image'}
                </label>
                <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={uploading}
                    style={{ display: 'none' }}
                />
            </div>
            {error && <p className="upload-error">{error}</p>}
        </div>
    );
};

export default ImageUpload;
