import { useEffect, useState } from 'react';
import API from '../api';
import './AdminProduct.css';
import { Link } from 'react-router-dom';

import sneakers from '../assets/sneakers.jpg';
import watch from '../assets/watch.jpg';
import headphones from '../assets/headphones.jpg';
import backpack from '../assets/backpack.jpg';
import tshirt from '../assets/cotton tshirt.jpg';

const localImages = {
sneakers,
watch,
headphones,
backpack,
tshirt,
};

const imageOptions = [
{ value: 'sneakers', label: 'Classic Sneakers', image: sneakers },
{ value: 'watch', label: 'Minimal Watch', image: watch },
{ value: 'headphones', label: 'Wireless Headphones', image: headphones },
{ value: 'backpack', label: 'Everyday Backpack', image: backpack },
{ value: 'tshirt', label: 'Cotton T-Shirt'},
];

const getImageKey = (product) => {
if (localImages[product.imageKey]) return product.imageKey;

const name = (product.name || '').toLowerCase();

if (name.includes('sneaker')) return 'sneakers';
if (name.includes('watch')) return 'watch';
if (name.includes('headphone')) return 'headphones';
if (name.includes('backpack')) return 'backpack';

return 'backpack';
};

const emptyForm = {
name: '',
price: '',
category: '',
imageKey: 'sneakers',
};

function AdminProducts() {
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');
const [editingId, setEditingId] = useState(null);
const [form, setForm] = useState({ ...emptyForm });

const fetchProducts = async () => {
try {
setLoading(true);
setError('');
const response = await API.get('/products');
setProducts(response.data);
} catch (err) {
setError('Unable to load products. Please try again.');
} finally {
setLoading(false);
}
};

useEffect(() => {
fetchProducts();
}, []);

const handleChange = (event) => {
setForm((current) => ({
...current,
[event.target.name]: event.target.value,
}));
};

const resetForm = () => {
setForm({ ...emptyForm });
setEditingId(null);
};

const handleSubmit = async (event) => {
event.preventDefault();

const product = {
  name: form.name.trim(),
  price: Number(form.price),
  category: form.category.trim(),
  imageKey: form.imageKey,
};

if (!product.name || !product.category || form.price === '') {
  alert('Please fill in all fields.');
  return;
}

if (!Number.isFinite(product.price) || product.price < 0) {
  alert('Please enter a valid price.');
  return;
}

try {
  if (editingId !== null) {
    await API.put(`/products/${editingId}`, product);
    alert('Product updated successfully!');
  } else {
    await API.post('/products', product);
    alert('Product added successfully!');
  }

  resetForm();
  await fetchProducts();
} catch (err) {
  alert('Unable to save product. Please try again.');
}

};

const handleEdit = (product) => {
setEditingId(product.id);
setForm({
name: product.name || '',
price: String(product.price ?? ''),
category: product.category || '',
imageKey: getImageKey(product),
});

window.scrollTo({ top: 0, behavior: 'smooth' });

};

const handleDelete = async (id) => {
const confirmed = window.confirm(
'Are you sure you want to delete this product?'
);

if (!confirmed) return;

try {
  await API.delete(`/products/${id}`);

  setProducts((current) =>
    current.filter((product) => String(product.id) !== String(id))
  );

  if (String(editingId) === String(id)) resetForm();

  alert('Product deleted successfully!');
} catch (err) {
  alert('Unable to delete product. Please try again.');
}

};

return (
<main className="admin-products">
<Link to="/admin" className="back-dashboard-link">
← Back to Dashboard
</Link>

  <header className="products-page-header">
    <div>
      <h1>Product Management</h1>
      <p>Manage your ShopSphere products here.</p>
    </div>
    <span>Total: {products.length}</span>
  </header>

  <form className="product-form" onSubmit={handleSubmit}>
    <h2>{editingId !== null ? 'Edit Product' : 'Add New Product'}</h2>

    <label htmlFor="product-name">Product Name</label>
    <input
      id="product-name"
      name="name"
      value={form.name}
      onChange={handleChange}
      placeholder="Enter product name"
      required
    />

    <label htmlFor="product-price">Price (₹)</label>
    <input
      id="product-price"
      name="price"
      type="number"
      min="0"
      step="0.01"
      value={form.price}
      onChange={handleChange}
      placeholder="Enter price"
      required
    />

    <label htmlFor="product-category">Category</label>
    <input
      id="product-category"
      name="category"
      value={form.category}
      onChange={handleChange}
      placeholder="Enter category"
      required
    />

    <label htmlFor="product-image">Product Image</label>
    <select
      id="product-image"
      name="imageKey"
      value={form.imageKey}
      onChange={handleChange}
      required
    >
      {imageOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>

    <div className="admin-image-preview">
      <img src={localImages[form.imageKey]} alt="Selected product preview" />
      <span>Preview: {imageOptions.find((option) => option.value === form.imageKey)?.label}</span>
    </div>

    <div className="product-form-actions">
      <button type="submit">
        {editingId !== null ? 'Update Product' : 'Add Product'}
      </button>

      {editingId !== null && (
        <button type="button" className="cancel-btn" onClick={resetForm}>
          Cancel
        </button>
      )}
    </div>
  </form>

  <section className="product-table-section">
    <h2>All Products</h2>

    {loading && <p>Loading products...</p>}
    {error && <p role="alert">{error}</p>}

    {!loading && !error && (
      <div className="product-table-wrapper">
        <table className="admin-product-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => {
              const imageKey = getImageKey(product);

              return (
                <tr key={product.id}>
                  <td>
                    <img
                      className="admin-product-thumbnail"
                      src={localImages[imageKey]}
                      alt={product.name}
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>
                    ₹{Number(product.price).toLocaleString('en-IN')}
                  </td>
                  <td className="product-actions">
                    <button type="button" onClick={() => handleEdit(product)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}

            {products.length === 0 && (
              <tr>
                <td colSpan="5">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    )}
  </section>
</main>

);
}

export default AdminProducts;