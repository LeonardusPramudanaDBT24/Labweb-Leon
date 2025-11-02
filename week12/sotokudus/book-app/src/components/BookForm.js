import React, { useState, useEffect } from "react";

function BookForm({ onSubmit, bookToEdit, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    author: "",
    rating: "average",
  });
  const [ImageFile, setImageFile] = useState(null);
  const [ImagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (bookToEdit) {
      setFormData({
        name: bookToEdit.name || "",
        author: bookToEdit.author || "",
        rating: bookToEdit.rating || "average",
      });
      setImagePreview(bookToEdit.Image || bookToEdit.ImageUrl || null);
      setImageFile(null);
    } else {
      setFormData({ name: "", author: "", rating: "average" });
      setImageFile(null);
      setImagePreview(null);
    }
  }, [bookToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0] || null;
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(bookToEdit?.Image || null);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("author", formData.author);
    payload.append("rating", formData.rating);
    if (ImageFile) {

      payload.append("Image", ImageFile);
    }

    try {
    
      await onSubmit(payload);

      setFormData({ name: "", author: "", rating: "average" });
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      // keep state for user to retry; show minimal console for debugging
      console.error("submit error:", err.response?.data || err.message || err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-2xl mb-4">{bookToEdit ? "Edit Buku" : "Tambah Buku Baru"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Judul</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Author</label>
          <input
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Rating</label>
          <select name="rating" value={formData.rating} onChange={handleChange} className="w-full px-3 py-2 border rounded">
            <option value="excellent">⭐⭐⭐ Keren</option>
            <option value="average">⭐⭐ B aja</option>
            <option value="bad">⭐ kureng</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Cover / Image</label>
          <input type="file" accept="Image/*" onChange={handleImageChange} />
          {ImagePreview && (
            <div className="mt-2">
              <img src={ImagePreview} alt="preview" className="h-40 object-cover rounded" />
              <div>
                <button type="button" onClick={removeImage} className="bg-red-500 text-white px-2 py-1 rounded">Delete image</button>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button type="submit" disabled={submitting} className="bg-blue-500 text-white px-4 py-2 rounded">
            {submitting ? "Menyimpan..." : bookToEdit ? "Update" : "Tambah"}
          </button>
          {bookToEdit && (
            <button type="button" onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded">
              Batal
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default BookForm;