import React, { useState, useRef } from 'react';
import './QRGenerator.css'; // Import the CSS for styling
import { FaLink, FaFilePdf, FaTextHeight, FaAddressCard, FaEnvelope, FaPhone } from 'react-icons/fa'; // Importing icons
import { QRCodeSVG } from 'qrcode.react'; // Import QRCodeSVG

const QRGenerator = () => {
  const [qrData, setQrData] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [qrType, setQrType] = useState('url'); // Track the selected QR type
  const [qrCodeElement, setQrCodeElement] = useState(null); // State to hold QR code element
  const [qrImageType, setQrImageType] = useState('normal'); // Track the selected QR image type
  const fileInputRef = useRef(null); // Create a ref for the file input

  // Handle input value change
  const handleInputChange = (e) => {
    setQrData(e.target.value);
  };

  // Handle image file upload
  const handleImageUpload = (e) => {
    if (e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
      e.target.value = ''; // Reset the file input value
    }
  };

  // Trigger file input when the upload button is clicked
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Function to remove the uploaded image
  const handleRemoveImage = () => {
    setImageFile(null);
    setQrCodeElement(null); // Reset the generated QR code when removing the image
  };

  // Function to generate the QR code with or without an image
  const generateStyledQRCode = () => {
    if (!qrData) {
      alert('Please enter data to generate the QR code.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target.result;

      if (imageFile && qrImageType === 'image') {
        // Generate styled QR code with the uploaded image
        const qr = new window.QArt({
          value: qrData,
          imagePath: imageUrl,
          filter: 'color',
          size: 1000,
          version: 20,
        });

        // Clear previous QR code and create a new one
        const qrContainer = document.getElementById('qr-container');
        qrContainer.innerHTML = ''; // Clear previous QR
        qr.make(qrContainer);
        setQrCodeElement(null); // Reset the normal QR code
      } else {
        // Generate a normal QR code if no image is uploaded
        setQrCodeElement(
          <QRCodeSVG
            value={qrData}
            size={256}
            fgColor="#000000" // Default color
            style={{ margin: '20px auto' }}
          />
        );
      }
    };

    if (imageFile) {
      reader.readAsDataURL(imageFile);
    } else {
      // Directly set QR code without reading an image
      setQrCodeElement(
        <QRCodeSVG
          value={qrData}
          size={256}
          fgColor="#000000" // Default color
          style={{ margin: '20px auto' }}
        />
      );
    }
  };

  // Function to handle QR type button clicks
  const handleQRTypeClick = (type) => {
    setQrType(type);
    setQrData(''); // Clear previous data when changing type
    setImageFile(null); // Clear the uploaded image
    setQrCodeElement(null); // Clear the displayed QR code
  };

  // Handle QR image type change
  const handleQRImageTypeChange = (e) => {
    const selectedType = e.target.value;
    setQrImageType(selectedType);
    setQrCodeElement(null); // Clear the displayed QR code when changing QR type

    // Reset the image file when switching to Normal QR
    if (selectedType === 'normal') {
      setImageFile(null); // Clear the uploaded image when changing to normal QR
    }
  };

  // Function to download the generated QR code
  const downloadQRCode = () => {
    const svgElement = document.getElementById('qr-container').querySelector('svg');
    if (!svgElement) {
      alert('Please generate a QR code before downloading.');
      return;
    }

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'qr_code.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Clean up
  };

  return (
    <div className="qr-generator-container">
      {/* Left Side Input Area with Vertical Icon Buttons */}
      <div className="input-section">
        <h2>Enter your text</h2>
        <div className="qr-type-buttons">
          <button onClick={() => handleQRTypeClick('url')} className={`qr-button ${qrType === 'url' ? 'active' : ''}`}>
            <FaLink /> URL
          </button>
          <button onClick={() => handleQRTypeClick('pdf')} className={`qr-button ${qrType === 'pdf' ? 'active' : ''}`}>
            <FaFilePdf /> PDF
          </button>
          <button onClick={() => handleQRTypeClick('text')} className={`qr-button ${qrType === 'text' ? 'active' : ''}`}>
            <FaTextHeight /> Text
          </button>
          <button onClick={() => handleQRTypeClick('contact')} className={`qr-button ${qrType === 'contact' ? 'active' : ''}`}>
            <FaAddressCard /> Contact
          </button>
          <button onClick={() => handleQRTypeClick('email')} className={`qr-button ${qrType === 'email' ? 'active' : ''}`}>
            <FaEnvelope /> Email
          </button>
          <button onClick={() => handleQRTypeClick('call')} className={`qr-button ${qrType === 'call' ? 'active' : ''}`}>
            <FaPhone /> Call
          </button>
        </div>
        <input
          type="text"
          placeholder={`Enter ${qrType} data`}
          value={qrData}
          onChange={handleInputChange}
        />

        {/* Radio buttons for selecting QR type in card view */}
        <div className="qr-image-type">
          <label className={`qr-card ${qrImageType === 'normal' ? 'active' : ''}`}>
            <input
              type="radio"
              value="normal"
              checked={qrImageType === 'normal'}
              onChange={handleQRImageTypeChange}
            />
            Basic QR
          </label>
          <label className={`qr-card ${qrImageType === 'image' ? 'active' : ''}`}>
            <input
              type="radio"
              value="image"
              checked={qrImageType === 'image'}
              onChange={handleQRImageTypeChange}
            />
            Image QR
          </label>
        </div>

        {/* Image upload section */}
        {/* Image upload section */}
        {qrImageType === 'image' && (
          <div className="upload-section-horizontal">
            <div className="upload-section">
              <input
                type="file"
                id="imageUpload"
                accept=".jpg,.png,.svg"
                onChange={handleImageUpload}
                style={{ display: 'none' }} // Hide the file input
                ref={fileInputRef} // Attach ref to the file input
              />
              <button className="upload-btn" onClick={handleUploadClick}>
                Upload Image
              </button>
            </div>
            {/* <div className="logo-upload">
              <input
                type="file"
                accept="image/*"
                id="logoUpload"
                onChange={handleImageUpload}
                style={{ display: 'none' }} // Hide the file input
              />
              <button className="upload-btn" onClick={() => document.getElementById('logoUpload').click()}>
                Upload Logo
              </button>
            </div> */}
          </div>
        )}


        {imageFile && (
          <div className="uploaded-image-info">
            <span>{imageFile.name}</span>
            <button onClick={handleRemoveImage} className="remove-btn">REMOVE</button>
          </div>
        )}

        <button className="generate-btn" onClick={generateStyledQRCode}>
          GENERATE QR
        </button>
      </div>

      {/* Right Side QR Code and Customization Section */}
      <div className="qr-section">
        <div className="qr-display">
          <div id="qr-container">{qrCodeElement}</div> {/* Render the QR code here */}
        </div>
        <div className="customization-panel">
        

          <button className="generate-btn" onClick={downloadQRCode}>
            DOWNLOAD QR
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;
