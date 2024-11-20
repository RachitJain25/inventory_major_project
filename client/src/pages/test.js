
'use client'

import { Html5QrcodeScanner } from 'html5-qrcode'
import './App.css'
import { useEffect, useState } from 'react'
import Layout from "./../components/Layout/Layout"

export default function Additem() {
  const [result, setResult] = useState(null)
  const [productDetails, setProductDetails] = useState(null)
  const [manualEan, setManualEan] = useState('')

  useEffect(() => {
    function onScanSuccess(decodedText, decodedResult) {
      setResult(decodedText)
      fetchProductDetails(decodedText)
      console.log(`Code matched = ${decodedText}`, decodedResult)
    }

    function onScanFailure(error) {
      console.warn(`Code scan error = ${error}`)
    }

    let html5QrcodeScanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: { width: 300, height: 150 },
        rememberLastUsedCamera: true
      },
      /* verbose= */ false
    )
    html5QrcodeScanner.render(onScanSuccess, onScanFailure)

    return () => {
      html5QrcodeScanner.clear()
    }
  }, [])

  const fetchProductDetails = async (eanCode) => {
    try {
      const response = await fetch(`https://barcodes-lookup.p.rapidapi.com/?query=${eanCode}`, {
        method: "GET",
        headers: {
          "x-rapidapi-host": "barcodes-lookup.p.rapidapi.com",
          "x-rapidapi-key": "51844c0660msh331b495f8d6eee1p1dfb86jsn504b3f66fdeb"
        }
      })

      if (response.ok) {
        const data = await response.json()
        setProductDetails(data)
        console.log("Product details:", data)
      } else {
        console.error("Error fetching product details")
        setProductDetails(null)
      }
    } catch (error) {
      console.error("Fetch error:", error)
      setProductDetails(null)
    }
  }

  const handleManualSubmit = (e) => {
    e.preventDefault()
    if (manualEan) {
      setResult(manualEan)
      fetchProductDetails(manualEan)
    }
  }

  return (
    <Layout title={"Add item"}>
      <div className="App">
        <div id="reader"></div>
        <br />
        <br />
        <form onSubmit={handleManualSubmit} className="mb-4">
          <input
            type="text"
            value={manualEan}
            onChange={(e) => setManualEan(e.target.value)}
            placeholder="Enter EAN manually"
            className="mr-2 p-2 border rounded"
          />
          <button type="submit" className="p-2 bg-blue-500 text-black rounded">Submit</button>
        </form>
        <h1>Scanned Code: {result}</h1>
        {productDetails && (
          <div>
            <h2>Product Details:</h2>
            <pre>{JSON.stringify(productDetails, null, 2)}</pre>
          </div>
        )}
      </div>
    </Layout>
  )
}
