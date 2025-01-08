import React, { useState, useRef } from "react";
import Draggable from "react-draggable";

const TShirtDesigner = () => {
  const [logo, setLogo] = useState(null);
  const [logoSize, setLogoSize] = useState({ width: 100, height: 100 });
  const [logoPosition, setLogoPosition] = useState({ x: 0, y: 0 });
  const tShirtRef = useRef(null);
  const canvasRef = useRef(null);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogo(e.target.result);
        console.log("Logo uploaded successfully:", e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

   // Function to update position when dragging stops
   const handleDragStop = (e, data) => {
    setLogoPosition({ x: data.x, y: data.y });
    console.log("Logo Drag Position:", { x: data.x, y: data.y });
  };

  const handleResize = (e) => {
    const newWidth = parseInt(e.target.value, 10);
    const aspectRatio = logoSize.width / logoSize.height;
    setLogoSize({ width: newWidth, height: newWidth / aspectRatio });
  };


  const generateFinalImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const tShirtImg = tShirtRef.current;
  
    // Set canvas size to match the T-shirt image
    canvas.width = tShirtImg.naturalWidth;
    canvas.height = tShirtImg.naturalHeight;

     // Debugging: Log canvas size
  console.log("Canvas Size:", canvas.width, canvas.height);
  
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // Load T-shirt image
    const tshirtImage = new Image();
    tshirtImage.src = tShirtImg.src;
    tshirtImage.crossOrigin = "anonymous"; // Prevent CORS issues for external images
  
    tshirtImage.onload = () => {
      ctx.drawImage(tshirtImage, 0, 0, canvas.width, canvas.height);
  
      if (logo) {
        const img = new Image();
        img.src = logo;
        img.crossOrigin = "anonymous"; // Prevent CORS issues for logo
  
        img.onload = () => {
          // Get T-shirt and canvas dimensions
          const tShirtRect = tShirtRef.current.getBoundingClientRect();
          // const canvasRect = canvas.getBoundingClientRect();
  
          // Debugging: Log dimensions
          console.log("T-Shirt Rect:", tShirtRect);
          // console.log("Canvas Rect:", canvasRect);
  
          // Calculate scale factors
          const scaleX = canvas.width / tShirtRect.width;
          const scaleY = canvas.height / tShirtRect.height;
  
          // Debugging: Log scale factors
          console.log("Scale Factors:", { scaleX, scaleY });
  
          // Map draggable position to canvas coordinates
          const offsetX = logoPosition.x - tShirtRect.left;
          const offsetY = logoPosition.y - tShirtRect.top;
  
          const mappedX = offsetX * scaleX;
          const mappedY = offsetY * scaleY;
  
          // Debugging: Log mapped coordinates
          console.log("Mapped Coordinates:", { mappedX, mappedY });
  
          // Draw the logo on the canvas
          ctx.drawImage(
            img,
            mappedX,
            mappedY,
            logoSize.width * scaleX,
            logoSize.height * scaleY
          );
  
          // Generate the final image
          const finalImage = canvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.href = finalImage;
          link.download = "tshirt-design.png";
          link.click();
        };
  
        img.onerror = () => console.error("Failed to load logo image:", img.src);
      } else {
        console.warn("No logo to draw!");
      }
    };
  
    tshirtImage.onerror = () => console.error("Failed to load T-shirt image.");
  };
  
  
  
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">T-Shirt Designer</h1>
      <div className="relative">
        <img
          ref={tShirtRef}
          src="https://media.istockphoto.com/id/1021952552/vector/white-empty-mens-t-shirt-template.jpg?s=612x612&w=0&k=20&c=_TjY64_D64PEriMEvr23-Lc3pVtdxBGV9u0c3Jh9fUM="
          alt="T-Shirt"
          className="border"
          crossOrigin="anonymous"
        />
        {logo && (
          <Draggable onStop={handleDragStop}
            position={logoPosition}
            onDrag={(e, data) => {
              setLogoPosition({ x: data.x, y: data.y });
              console.log("Logo position updated:", data.x, data.y);
            }}
          >
            <img
              src={logo}
              alt="Logo"
              style={{
                width: logoSize.width,
                height: logoSize.height,
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 10,
              }}
            />
          </Draggable>
        )}
      </div>
      <div className="mt-4 flex flex-col items-center">
        <label className="mb-2">
          Upload Logo:
          <input type="file" accept="image/*" onChange={handleLogoUpload} className="ml-2" />
        </label>
        {logo && (
          <label className="mb-2">
            Resize Logo (Width):
            <input
              type="range"
              min="50"
              max="300"
              value={logoSize.width}
              onChange={handleResize}
              className="ml-2"
            />
          </label>
        )}
        <button
          onClick={generateFinalImage}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        >
          Generate Final Image
        </button>
      </div>
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default TShirtDesigner;
