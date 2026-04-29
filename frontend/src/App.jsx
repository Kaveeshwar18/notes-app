import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);


  const fetchNotes = async () => {
    const res = await axios.get("http://127.0.0.1:8000/notes");
    setNotes(res.data);
  };

  useEffect(() => {
    fetchNotes();
  }, []);


  const createNote = async () => {
    let image_url = "";

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await axios.post(
        "http://127.0.0.1:8000/upload",
        formData
      );

      image_url = uploadRes.data.image_url;
    }

    await axios.post("http://127.0.0.1:8000/notes", {
      title,
      content,
      image_url,
    });

    setTitle("");
    setContent("");
    setFile(null);

    fetchNotes();
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600 p-6 text-white">
      
      {/* Header */}
      <h1 className="text-4xl font-bold text-center mb-6">
        ✨ Notes App
      </h1>

      {/* Input Card */}
      <div className="bg-white text-black p-6 rounded-xl shadow-lg max-w-xl mx-auto">
        
        <input
          className="w-full p-2 border rounded mb-3"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full p-2 border rounded mb-3"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <input
          type="file"
          className="mb-3"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          onClick={createNote}
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
        >
          Add Note
        </button>
      </div>

      {/* Notes List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {notes.map((note) => (
          <div
            key={note._id}
            className="bg-white text-black p-4 rounded-xl shadow-lg"
          >
            <h3 className="text-xl font-semibold mb-2">
              {note.title}
            </h3>

            <p className="mb-2">{note.content}</p>

            {note.image_url && (
              <img
                src={`http://127.0.0.1:8000/${note.image_url}`}
                className="rounded mt-2"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;