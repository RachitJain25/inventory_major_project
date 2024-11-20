// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Layout from "./../components/Layout/Layout";
// import "../styles/Homepage.css";
// import { useAuth } from '../context/auth';

// const HomePage = () => {
//   const [products, setProducts] = useState([]);
//   const [editingProduct, setEditingProduct] = useState(null);
//   const [auth, setAuth] = useAuth(); // State for the product being edited
//   const [formData, setFormData] = useState({
//     title: "",
//     brand: "",
//     category: [],
//     currentStock: 0,
//   });

//   // Fetch products when the component loads
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const { data } = await axios.get("/api/products/user-products");
//         setProducts(data);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       }
//     };

//     fetchProducts();
//   }, []);

//   const handleEdit = (product) => {
//     setEditingProduct(product._id); // Set the current product ID being edited
//     setFormData({ ...product }); // Populate form with product data
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`/api/products/${id}`);
//       setProducts(products.filter((product) => product._id !== id));
//     } catch (error) {
//       console.error("Error deleting product:", error);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     try {
//       const { data } = await axios.put(`/api/products/${editingProduct}`, formData);
//       setProducts(products.map((product) => (product._id === editingProduct ? data.product : product)));
//       setEditingProduct(null); // Exit edit mode
//     } catch (error) {
//       console.error("Error updating product:", error);
//     }
//   };

//   return (
//     <Layout title={"HomeCart"}>
//       <h1>User Stock</h1>
//       <table className="stock-table">
//         <thead>
//           <tr>
//             <th>Title</th>
//             <th>Brand</th>
//             <th>Category</th>
//             <th>Current Stock</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {products.map((product) => (
//             <tr key={product._id}>
//               <td>{product.title}</td>
//               <td>{product.brand}</td>
//               <td>{product.category.join(", ")}</td>
//               <td>{product.currentStock}</td>
//               <td>
//                 <button onClick={() => handleEdit(product)}>Edit</button>
//                 <button onClick={() => handleDelete(product._id)}>Delete</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Edit form */}
//       {editingProduct && (
//         <div className="edit-form">
//           <h2>Edit Product</h2>
//           <form onSubmit={handleUpdate}>
//             <input
//               type="text"
//               name="title"
//               value={formData.title}
//               onChange={handleInputChange}
//               placeholder="Title"
//             />
//             <input
//               type="text"
//               name="brand"
//               value={formData.brand}
//               onChange={handleInputChange}
//               placeholder="Brand"
//             />
//             <input
//               type="text"
//               name="category"
//               value={formData.category.join(", ")}
//               onChange={(e) => setFormData({ ...formData, category: e.target.value.split(", ") })}
//               placeholder="Category (comma separated)"
//             />
//             <input
//               type="number"
//               name="currentStock"
//               value={formData.currentStock}
//               onChange={handleInputChange}
//               placeholder="Current Stock"
//             />
//             <button type="submit">Save</button>
//             <button type="button" onClick={() => setEditingProduct(null)}>Cancel</button>
//           </form>
//         </div>
//       )}
//     </Layout>
//   );
// };

// export default HomePage;



// 'use client'

// import React, { useState, useEffect } from "react"
// import axios from "axios"
// import Layout from "./../components/Layout/Layout"
// import "../styles/Homepage.css"
// import { useAuth } from '../context/auth'

// const HomePage = () => {
//   const [products, setProducts] = useState([])
//   const [editingProduct, setEditingProduct] = useState(null)
//   const [auth] = useAuth()
//   const [formData, setFormData] = useState({
//     title: "",
//     brand: "",
//     category: [],
//     currentStock: 0,
//   })

//   useEffect(() => {
//     const fetchProducts = async () => {
//       if (auth?.user?._id) {
//         try {
//           const { data } = await axios.get(`/api/products/user-products?userId=${auth.user._id}`)
//           setProducts(data)
//         } catch (error) {
//           console.error("Error fetching products:", error)
//         }
//       }
//     }

//     fetchProducts()
//   }, [auth])

//   const handleEdit = (product) => {
//     setEditingProduct(product._id)
//     setFormData({ ...product })
//   }

//   const handleDelete = async (id) => {
//     if (auth?.user?._id) {
//       try {
//         await axios.delete(`/api/products/${id}`, { data: { userId: auth.user._id } })
//         setProducts(products.filter((product) => product._id !== id))
//       } catch (error) {
//         console.error("Error deleting product:", error)
//       }
//     }
//   }

//   const handleInputChange = (e) => {
//     const { name, value } = e.target
//     setFormData({ ...formData, [name]: value })
//   }

//   const handleUpdate = async (e) => {
//     e.preventDefault()
//     if (auth?.user?._id) {
//       try {
//         const { data } = await axios.put(`/api/products/${editingProduct}`, {
//           ...formData,
//           userId: auth.user._id,
//         })
//         setProducts(products.map((product) => (product._id === editingProduct ? data.product : product)))
//         setEditingProduct(null)
//       } catch (error) {
//         console.error("Error updating product:", error)
//       }
//     }
//   }

//   return (
//     <Layout title={"HomeCart"}>
//       <h1>User Stock</h1>
//       <table className="stock-table">
//         <thead>
//           <tr>
//             <th>Title</th>
//             <th>Brand</th>
//             <th>Category</th>
//             <th>Current Stock</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {products.map((product) => (
//             <tr key={product._id}>
//               <td>{product.title}</td>
//               <td>{product.brand}</td>
//               <td>{product.category.join(", ")}</td>
//               <td>{product.currentStock}</td>
//               <td>
//                 <button onClick={() => handleEdit(product)}>Edit</button>
//                 <button onClick={() => handleDelete(product._id)}>Delete</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {editingProduct && (
//         <div className="edit-form">
//           <h2>Edit Product</h2>
//           <form onSubmit={handleUpdate}>
//             <input
//               type="text"
//               name="title"
//               value={formData.title}
//               onChange={handleInputChange}
//               placeholder="Title"
//             />
//             <input
//               type="text"
//               name="brand"
//               value={formData.brand}
//               onChange={handleInputChange}
//               placeholder="Brand"
//             />
//             <input
//               type="text"
//               name="category"
//               value={formData.category.join(", ")}
//               onChange={(e) => setFormData({ ...formData, category: e.target.value.split(", ") })}
//               placeholder="Category (comma separated)"
//             />
//             <input
//               type="number"
//               name="currentStock"
//               value={formData.currentStock}
//               onChange={handleInputChange}
//               placeholder="Current Stock"
//             />
//             <button type="submit">Save</button>
//             <button type="button" onClick={() => setEditingProduct(null)}>Cancel</button>
//           </form>
//         </div>
//       )}
//     </Layout>
//   )
// }

// export default HomePage

'use client'
import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "./../components/Layout/Layout";
import "../styles/Homepage.css";
import { useAuth } from '../context/auth';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [auth] = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    brand: "",
    category: [],
    currentStock: 0,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      if (auth?.user?._id) {
        try {
          const { data } = await axios.get(`/api/products/user-products?userId=${auth.user._id}`);
          setProducts(data);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      }
    };

    fetchProducts();
  }, [auth]);

  const handleEdit = (product) => {
    setEditingProduct(product._id);
    setFormData({ ...product });
  };

  const handleDelete = async (id) => {
    if (auth?.user?._id) {
      try {
        await axios.delete(`/api/products/${id}`, { data: { userId: auth.user._id } });
        setProducts(products.filter((product) => product._id !== id));
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (auth?.user?._id) {
      try {
        const { data } = await axios.put(`/api/products/${editingProduct}`, {
          ...formData,
          userId: auth.user._id,
        });
        setProducts(products.map((product) => (product._id === editingProduct ? data.product : product)));
        setEditingProduct(null);
      } catch (error) {
        console.error("Error updating product:", error);
      }
    }
  };

  return (
    <Layout title={"HomeCart"}>
      <h1>User Stock</h1>
      <table className="stock-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Brand</th>
            <th>Category</th>
            <th>Current Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product.title}</td>
              <td>{product.brand}</td>
              <td>{product.category?.join(", ") || ""}</td>
              <td>{product.currentStock}</td>
              <td>
                <button onClick={() => handleEdit(product)}>Edit</button>
                <button onClick={() => handleDelete(product._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingProduct && (
        <div className="edit-form">
          <h2>Edit Product</h2>
          <form onSubmit={handleUpdate}>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Title"
            />
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              placeholder="Brand"
            />
            <input
              type="text"
              name="category"
              value={(formData.category || []).join(", ")}
              onChange={(e) => setFormData({ ...formData, category: e.target.value.split(", ") })}
              placeholder="Category (comma separated)"
            />
            <input
              type="number"
              name="currentStock"
              value={formData.currentStock}
              onChange={handleInputChange}
              placeholder="Current Stock"
            />
            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditingProduct(null)}>Cancel</button>
          </form>
        </div>
      )}
    </Layout>
  );
};

export default HomePage;
