import { useEffect, useState } from "react";
import { Check, X, Trash, Edit, Link, Plus } from "lucide-react";
import NoContent from "./NoContent";
import toast, { Toaster } from "react-hot-toast";
import supabase from "@/supabase/config";

const AdminAbout = () => {
  const [jsonArray, setJsonArray] = useState<any[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editedItem, setEditedItem] = useState<any>({
    title: "",
    description: "",
    link_text: "",
    link_url: "",
    image_url: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await supabase.from("news").select();
        setJsonArray(data!);
      } catch (error) {
        toast.error((error as Error).message);
      }
    };

    fetchData();
  }, []);

  const handleAddItemClick = () => {
    setEditIndex(-1); // Use -1 to indicate a new item
    setEditedItem({
      title: "",
      description: "",
      link_text: "",
      link_url: "",
      image_url: "",
    });
  };

  const handleRemoveItem = async (id: number) => {
    const confirm = window.confirm('sure to delete ?')
    if(!confirm) return;
    try {
      await supabase.from("news").delete().eq("id", id);

      setJsonArray(jsonArray.filter((item) => item.id !== id));
      toast.success("News removed successfully");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleEditClick = (id: number) => {
    const edited = jsonArray.find((item) => item.id === id);
    if (edited) {
      setEditIndex(id);
      setEditedItem(edited);
    }
  };

  const handleEditSubmit = async () => {
    try {
      if (
        !editedItem.title ||
        !editedItem.description ||
        !editedItem.link_text ||
        !editedItem.link_url ||
        !editedItem.image_url
      ) {
        toast.error("All fields are required");
        return;
      }

      if (editIndex === -1) {
        // Add the new item
        const { data, error } = await supabase
          .from("news")
          .insert([editedItem])
          .select();
        if (error) {
          throw error;
        }
        const newItem: any = data![0];
        setJsonArray([...jsonArray, newItem]);
        toast.success("News added successfully");
      } else {
        await supabase.from("news").update(editedItem).eq("id", editIndex);
        setJsonArray(
          jsonArray.map((item) => (item.id === editIndex ? editedItem : item))
        );
        toast.success("News updated successfully");
      }

      setEditIndex(null);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleEditCancel = () => {
    setEditIndex(null);
    setEditedItem({});
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    setEditedItem((prev) => ({ ...prev, [key]: e.target.value }));
  };

  return (
    <div
      className={`min-h-[400px] lg:p-3 w-full z-10 bottom-0 left-0 lg:relative overflow-hidden mt-5`}
    >
      {!jsonArray && <h2 className="font-bold mb-4">Current About data:</h2>}
      <div className="mb-5 flex items-center justify-end">
        <button
          className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          onClick={handleAddItemClick}
        >
          <Plus size={18} className="mr-1" />
          Add Data
        </button>
      </div>
      {jsonArray.length !== 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead>
              <tr className="bg-zinc-800 text-white ">
                <th className="max-w-[150px] whitespace-nowrap overflow-x-auto text-ellipses  border px-4 py-2">
                  Image
                </th>
                <th className="max-w-[150px] whitespace-nowrap overflow-x-auto text-ellipses  border px-4 py-2">
                  Title
                </th>
                <th className="max-w-[150px] whitespace-nowrap overflow-x-auto text-ellipses  border px-4 py-2">
                  URL
                </th>
                <th className="max-w-[150px] whitespace-nowrap overflow-x-auto text-ellipses  border px-2 py-2">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {jsonArray.map((item, index) => (
                <tr key={index} className="hover:bg-slate-100">
                  <td className="max-w-[150px] whitespace-nowrap overflow-x-auto text-ellipses border px-4 py-2">
                    <img className="w-10 h-10" src={item.image_url} />
                  </td>
                  <td className="max-w-[150px] whitespace-nowrap overflow-x-auto text-ellipses border px-4 py-2">
                    {item.title}
                  </td>
                  <td className="cursor-pointer max-w-[150px] whitespace-nowrap overflow-x-auto text-ellipses border px-4 py-2 flex hover:underline hover:text-blue-400 group:hover:bg-white">
                    <a
                      href={item.link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className=" hover:text-blue-400 hover:underline"
                    >
                      {item.link_text}
                    </a>
                  </td>
                  <td className="max-w-[150px] whitespace-nowrap overflow-x-auto text-ellipses border px-2 py-2">
                    <button
                      className="mr-1"
                      onClick={() => handleEditClick(+item.id!)}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="mr-1"
                      onClick={() => handleRemoveItem(+item.id!)}
                    >
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <NoContent />
      )}

      {editIndex !== null && (
        <div className="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white max-h-[700px] overflow-auto min-w-[600px] p-8 rounded-lg shadow-md">
            <h2 className="font-bold mb-2 text-center text-lg">
              {editIndex === -1 ? "Add About Data" : "Edit About Data"}
            </h2>
            <div className="">
              <div className=" mb-2 lg:pr-4">
                <span className="text-sm font-bold my-2 -ml-2">Title</span>
                <input
                  type="text"
                  placeholder="Title"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={editedItem.title}
                  onChange={(e) => handleInputChange(e, "title")}
                />
              </div>
              <div className=" mb-2 lg:pr-4">
                <span className="text-sm font-bold my-2 -ml-2">Image URL</span>
                <input
                  type="text"
                  placeholder="https://example.com/example.png"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={editedItem.image_url}
                  onChange={(e) => handleInputChange(e, "image_url")}
                />
              </div>
              <div className="mb-2 lg:pr-4">
                <span className="text-sm font-bold my-2 -ml-2">
                  Description
                </span>

                <input
                  type="text"
                  placeholder="Description"
                  className="p-2 w-full border border-gray-300 rounded"
                  value={editedItem.description}
                  onChange={(e) => handleInputChange(e, "description")}
                />
              </div>
              <div className="mb-2 lg:pr-4">
                <span className="text-sm font-bold my-2 -ml-2">Link Text</span>

                <input
                  type="text"
                  placeholder="Link Text"
                  className="p-2 w-full border border-gray-300 rounded"
                  value={editedItem.link_text}
                  onChange={(e) => handleInputChange(e, "link_text")}
                />
              </div>
              <div className=" mb-2 lg:pr-4">
                <span className="text-sm font-bold my-2 -ml-2">URL</span>

                <input
                  type="text"
                  placeholder="URL"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={editedItem.link_url}
                  onChange={(e) => handleInputChange(e, "link_url")}
                />
              </div>
            </div>
            <div className="flex mt-3">
              <button
                className="flex items-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-2"
                onClick={handleEditSubmit}
              >
                <Check size={18} className="mr-1" />
                Save
              </button>
              <button
                className="flex items-center bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                onClick={handleEditCancel}
              >
                <X size={18} className="mr-1" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* <div className="mt-5">
        <button
          className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          onClick={handleAddItemClick}
        >
          <Plus size={18} className="mr-1" />
          Add Item
        </button>
      </div> */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#000",
            color: "#fff",
          },
        }}
      />
    </div>
  );
};

export default AdminAbout;
