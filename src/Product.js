import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

function Product() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);

  const [form, setForm] = useState({
    id: null,
    code: "",
    name: "",
    price: "",
    description: ""
  });

  const getToken = () => localStorage.getItem("token");

  // ✅ FETCH PRODUCTS
  const fetchProducts = useCallback(async (pageNumber) => {
    try {
      const token = getToken();

      console.log("TOKEN:", token);

      if (!token) {
        alert("No token found. Please login again.");
        return;
      }

      const url = `${BASE_URL}/products/paginated?page=${pageNumber}&size=5&sort=name&sort=asc`;

      console.log("API URL:", url);

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("FULL RESPONSE:", res.data);

      // ✅ SAFE MAPPING
      const data = res.data?.content || [];

      setProducts(data);

    } catch (err) {
      console.error("❌ FETCH ERROR:", err);

      if (err.response) {
        console.error("STATUS:", err.response.status);
        console.error("DATA:", err.response.data);
        alert(`Error ${err.response.status}: ${err.response.data?.message || "Failed"}`);
      } else {
        console.error("NO RESPONSE (CORS / NETWORK ISSUE)");
        alert("Network / CORS error");
      }
    }
  }, []);

  useEffect(() => {
    fetchProducts(page);
  }, [page, fetchProducts]);

  // ✅ FORM
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.code || !form.name || !form.price) {
      alert("Code, Name, Price required");
      return false;
    }
    return true;
  };

  // ✅ CREATE
  const handleCreate = async () => {
    if (!validate()) return;

    try {
      const token = getToken();

      await axios.post(
        `${BASE_URL}/products/create`,
        {
          code: form.code,
          name: form.name,
          price: Number(form.price),
          description: form.description
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      alert("Created");
      resetForm();
      fetchProducts(page);

    } catch (err) {
      console.error("CREATE ERROR:", err);
      alert(err.response?.data?.message || "Create failed");
    }
  };

  // ✅ UPDATE
  const handleUpdate = async () => {
    if (!validate()) return;

    try {
      const token = getToken();

      await axios.put(
        `${BASE_URL}/products/update`,
        {
          id: form.id,
          code: form.code,
          name: form.name,
          price: Number(form.price),
          description: form.description
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Updated");
      resetForm();
      fetchProducts(page);

    } catch (err) {
      console.error("UPDATE ERROR:", err);
      alert(err.response?.data?.message || "Update failed");
    }
  };

  const editProduct = (p) => {
    setForm({
      id: p.id || null,
      code: p.code,
      name: p.name,
      price: p.price,
      description: p.description
    });
  };

  const resetForm = () => {
    setForm({
      id: null,
      code: "",
      name: "",
      price: "",
      description: ""
    });
  };

  return (
    <div>
      <h3>Products</h3>

      {/* FORM */}
      <div style={{ border: "1px solid gray", padding: 10 }}>
        <input name="code" placeholder="Code" value={form.code} onChange={handleChange} /><br /><br />
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} /><br /><br />
        <input name="price" placeholder="Price" value={form.price} onChange={handleChange} /><br /><br />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} /><br /><br />

        {form.id ? (
          <>
            <button onClick={handleUpdate}>Update</button>
            <button onClick={resetForm}>Cancel</button>
          </>
        ) : (
          <button onClick={handleCreate}>Create</button>
        )}
      </div>

      <hr />

      {/* DATA */}
      {products.length === 0 ? (
        <p>No data</p>
      ) : (
        products.map((p, i) => (
          <div key={p.code || i}>
            {p.code} | {p.name} | ₹{p.price}
            <button onClick={() => editProduct(p)}>Edit</button>
          </div>
        ))
      )}

      <br />

      <button onClick={() => setPage(page - 1)} disabled={page === 0}>
        Prev
      </button>

      <button onClick={() => setPage(page + 1)}>
        Next
      </button>
    </div>
  );
}

export default Product;