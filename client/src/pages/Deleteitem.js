"use client";
import "./App.css";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";
import Layout from "./../components/Layout/Layout";
import { useAuth } from '../context/auth';
//import Layout from "../components/Layout/Layout"

export default function Additem() {
  const [result, setResult] = useState(null);
  const [productDetails, setProductDetails] = useState(null);
  const [manualEan, setManualEan] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [auth, setAuth] = useAuth();

  useEffect(() => {
    console.log("Auth state:", auth); // Debugging log
    let html5QrcodeScanner = null;

    function onScanSuccess(decodedText, decodedResult) {
      setResult(decodedText);
      fetchProductDetails(decodedText);
      console.log(`Code matched = ${decodedText}`, decodedResult);
    }

    function onScanFailure(error) {
      console.warn(`Code scan error = ${error}`);
    }

    if (typeof window !== "undefined") {
      html5QrcodeScanner = new Html5QrcodeScanner(
        "reader",
        {
          fps: 10,
          qrbox: { width: 300, height: 100 },
          rememberLastUsedCamera: true,
        },
        /* verbose= */ false
      );
      html5QrcodeScanner.render(onScanSuccess, onScanFailure);
    }

    return () => {
      if (html5QrcodeScanner) {
        html5QrcodeScanner.clear().catch((error) => {
          console.error("Failed to clear html5QrcodeScanner. ", error);
        });
      }
    };
  }, [auth]);
  
//   const fetchProductDetails = async (eanCode) => {
//     setIsLoading(true);
//     setError("");
//     try {
//       const response = await fetch(
//         `https://barcodes-lookup.p.rapidapi.com/?query=${eanCode}`,
//         {
//           method: "GET",
//           headers: {
//             "x-rapidapi-host": "barcodes-lookup.p.rapidapi.com",
//             "x-rapidapi-key": "51844c0660msh331b495f8d6eee1p1dfb86jsn504b3f66fdeb",
//           },
//         }
//       );
  
//       if (response.ok) {
//         const data = await response.json();
//         setProductDetails(data.product);
//         console.log("Product details:", data.product);
  
//         // Call function to save product details to the database
//         await saveProductToDatabase(data.product,eanCode);
//       } else {
//         throw new Error("Error fetching product details");
//       }
//     } catch (error) {
//       console.error("Fetch error:", error);
//      // setError("Failed to fetch product details. Please try again.");
//       setProductDetails(null);
//     } finally {
//       setIsLoading(false);
//     }
//   };
  
  // Function to save product details to database
  const saveProductToDatabase = async (product,eanCode) => {
    console.log("Attempting to save product. Auth state:", auth);
    if (!auth || !auth.user) {
      console.error("User not authenticated. Auth state:", auth);
      setError("You must be logged in to add items.");
      return;
    }
    try { console.log("Result (scanned):", result); // Debug log
      console.log("Manual EAN:", manualEan);
      // Define default values for missing fields
      const defaultProduct = {
        title: product.title || null,
        brand: product.brand || null,
        category: product.category || null,
        description: product.description || null,
        manufacturer: product.manufacturer || null,
        ingredients: product.ingredients || null,
        nutritionFacts: product.nutrition_facts || null,
        features: product.features || null,
        attributes: product.attributes || null,
        barcode: eanCode || result || manualEan || null, // Use a specific barcode format if available, else set to null    product.barcode_formats?.EAN_13
        images: product.images || null,
        currentStock: 1, // Default stock, can be adjusted
        userId: auth.user._id,
      };
  
      // Post request to save the product to the database
      const response = await fetch("http://localhost:3000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(defaultProduct),
      });
/*      
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(defaultProduct),
      });
  */
      if (response.ok) {
        console.log("Product saved to database successfully.");
      } else {
        throw new Error("Failed to save product to database.");
      }
    } catch (error) {
      console.error("Database save error:", error);
      setError("Failed to save product to database. Please try again.");
    }
  };
  const fetchProductDetails = async (eanCode) => {
    setIsLoading(true);
    setError("");
    try {
      // Fetch product details from the external API
      const response = await fetch(
        `https://barcodes-lookup.p.rapidapi.com/?query=${eanCode}`,
        {
          method: "GET",
          headers: {
            "x-rapidapi-host": "barcodes-lookup.p.rapidapi.com",
            "x-rapidapi-key": "51844c0660msh331b495f8d6eee1p1dfb86jsn504b3f66fdeb",
          },
        }
      );
  
      if (response.ok) {
        const data = await response.json();
        setProductDetails(data.product);
        console.log("Product details fetched successfully:", data.product);
  
        // Attempt to delete or decrease the quantity of the product
        console.log("Attempting to delete product with barcode:", eanCode);
        await decreaseProductQuantity(eanCode);
        console.log("Product deletion process completed successfully.");
      } else {
        throw new Error("Failed to fetch product details from the external API.");
      }
    } catch (error) {
      console.error("Error during product fetch or deletion:", error);
      setError(error.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  
  // Function to decrease product quantity in the database
const decreaseProductQuantity = async (eanCode) => {
    console.log("Attempting to decrease product quantity. Auth state:", auth);
    
    if (!auth || !auth.user) {
      console.error("User not authenticated. Auth state:", auth);
      setError("You must be logged in to modify items.");
      return;
    }
  
    try {
      // Make a POST request to the server to decrease stock
      const response = await fetch("http://localhost:3000/api/delete/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          barcode: eanCode,
          userId: auth.user._id,
        }),
      });
  
      // Handle response
      const result = await response.json();
  
      if (response.ok) {
        console.log("Product quantity decreased successfully:", result.product);
      } else if (response.status === 404) {
        console.warn("Product not found for the given barcode.");
        setError(result.message || "Product not found.");
      } else if (response.status === 400) {
        console.warn("Unable to decrease stock:", result.message);
        setError(result.message || "Invalid operation.");
      } else {
        throw new Error(result.message || "Failed to update product in database.");
      }
    } catch (error) {
      console.error("Error while decreasing product quantity:", error);
      setError("Failed to update product quantity. Please try again.");
    }
  };
  
  
  /*
  const fetchProductDetails = async (eanCode) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(
        `https://barcodes-lookup.p.rapidapi.com/?query=${eanCode}`,
        {
          method: "GET",
          headers: {
            "x-rapidapi-host": "barcodes-lookup.p.rapidapi.com",
            "x-rapidapi-key":
              "51844c0660msh331b495f8d6eee1p1dfb86jsn504b3f66fdeb",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProductDetails(data.product);
        console.log("Product details:", data.product);
      } else {
        throw new Error("Error fetching product details");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setError("Failed to fetch product details. Please try again.");
      setProductDetails(null);
    } finally {
      setIsLoading(false);
    }
  };
*/
  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualEan) {
      setResult(manualEan);
      fetchProductDetails(manualEan);
    }
  };

  const renderProductDetails = () => {
    if (!productDetails) return null;

    const relevantFields = [
      { key: "title", label: "Product Name" },
      { key: "description", label: "Description" },
      { key: "brand", label: "Brand" },
      { key: "manufacturer", label: "Manufacturer" },
      { key: "category", label: "Category" },
      { key: "nutrition_facts", label: "Nutrition Facts" },
      { key: "ingredients", label: "Ingredients" },
      { key: "features", label: "Features" },
      { key: "attributes", label: "Attributes" },
      { key: "barcode_formats", label: "Barcode" },
    ];

    const availableFields = relevantFields.filter(
      (field) =>
        productDetails[field.key] &&
        (typeof productDetails[field.key] === "string" ||
          Array.isArray(productDetails[field.key]) ||
          (typeof productDetails[field.key] === "object" &&
            Object.keys(productDetails[field.key]).length > 0))
    );

    return (
      <div>
        {productDetails.images && productDetails.images.length > 0 && (
          <div>
            <img
              src={productDetails.images[0]}
              alt={productDetails.title || "Product image"}
              style={{
                maxWidth: "200px",
                maxHeight: "200px",
                objectFit: "contain",
                display: "block",
                margin: "0 auto",
              }}
            />
          </div>
        )}
        <table
          style={{
            width: "80%",
            margin: "20px auto",
            borderCollapse: "collapse",
            textAlign: "center",
            borderRadius: "10px",
            overflow: "hidden",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "#007bff",
                color: "white",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              <th style={{ padding: "10px" }}>Field</th>
              <th style={{ padding: "10px" }}>Value</th>
            </tr>
          </thead>
          <tbody>
            {availableFields.map(({ key, label }) => (
              <tr key={key} style={{ backgroundColor: "#f9f9f9" }}>
                <td
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #ddd",
                    fontSize: "14px",
                  }}
                >
                  {label}
                </td>
                <td
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #ddd",
                    fontSize: "14px",
                  }}
                >
                  {typeof productDetails[key] === "object"
                    ? key === "barcode_formats"
                      ? Object.entries(productDetails[key])
                          .map(([format, code]) => `${format}: ${code}`)
                          .join(", ")
                      : JSON.stringify(productDetails[key])
                    : Array.isArray(productDetails[key])
                    ? productDetails[key].join(", ")
                    : productDetails[key].toString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <Layout title="Add item">
    <h3
  style={{
    textAlign: 'center', // Centers the text horizontally
    color: '#f03838', // Apply color (change as per your preference)
    fontSize: '45px', // Adjust the font size
    fontWeight: 'bold', // Make the text bold
    marginBottom: '20px', // Add some space below the title
  }}
>
  Scan Barcode
</h3>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px 20px", // Added top padding (40px)
          marginTop: "20px", // Added space from navbar
        }}
      >
        <div id="reader" style={{ marginBottom: "20px" }}></div>
        <form
          onSubmit={handleManualSubmit}
          className="mb-4"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            maxWidth: "500px",
            marginBottom: "20px",
          }}
        >
          <input
            type="text"
            value={manualEan}
            onChange={(e) => setManualEan(e.target.value)}
            placeholder="Enter EAN manually"
            className="mr-2 p-2 border rounded"
            style={{
              marginBottom: "10px",
              padding: "10px",
              width: "100%",
              maxWidth: "400px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded"
            style={{
              width: "100%",
              maxWidth: "400px",
              padding: "10px",
              backgroundColor: "#007bff",
              borderRadius: "4px",
              border: "none",
              color: "#fff",
            }}
          >
            Submit
          </button>
        </form>
        <h1>{result && `Scanned Code: ${result}`}</h1>
        {isLoading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {productDetails && (
          <div>
            <h2>Product Details:</h2>
            {renderProductDetails()}
          </div>
        )}
      </div>
    </Layout>
  );
}
