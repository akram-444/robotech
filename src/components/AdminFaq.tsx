import { useEffect, useState } from "react";
import { Check, X, Trash, Edit, Plus } from "lucide-react";
import NoContent from "./NoContent";
import toast, { Toaster } from "react-hot-toast";
import supabase from "../supabase/config"

const AdminFaq = () => {
  const [jsonArray, setJsonArray] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editedItem, setEditedItem] = useState<any>({
    question: "",
    answer: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('faq')
          .select();
        if (error) {
          throw error;
        }
        setJsonArray(data || []);
      } catch (error) {
        setError((error as Error).message);
      }
    };

    fetchData();
  }, [editedItem]);

  const handleAddItemClick = () => {
    setEditIndex(-1); // Use -1 to indicate a new item
    setEditedItem({
      question: "",
      answer: "",
    });
    setError(null); // Reset error state
  };

  const handleRemoveItem = async (id: number) => {
    try {
      await supabase
        .from('faq')
        .delete()
        .eq('id', id);
      
      setJsonArray(jsonArray.filter(item => item.id !== id));
      toast.success('Question removed successfully');
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const handleEditClick = (id: number) => {
    const edited = jsonArray.find(item => item.id === id);
    if (edited) {
      setEditIndex(id);
      setEditedItem(edited);
    }
  };

  const handleEditSubmit = async () => {
    try {
      if (
        !editedItem.question ||
        !editedItem.answer
      ) {
        toast.error("All fields are required");
        return;
      }

      if (editIndex === -1) {
        // Add the new item
        const { data, error } = await supabase
          .from("faq")
          .insert([editedItem])
          .select();
        if (error) {
          throw error;
        }
        const newItem: any = data![0];
        setJsonArray([...jsonArray, newItem]);
        toast.success("Question added successfully");
      } else {
        await supabase.from("faq").update(editedItem).eq("id", editIndex);
        setJsonArray(
          jsonArray.map((item) => (item.id === editIndex ? editedItem : item))
        );
        toast.success("Question updated successfully");
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
    <div className={`min-h-[400px] lg:p-3 w-full z-10 bottom-0 left-0 lg:relative overflow-hidden mt-5`}>

      {!jsonArray && <h2 className="font-bold mb-4">Current FAQ data:</h2>}
      <div className="mb-5 flex items-center justify-end">
        <button
          className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          onClick={handleAddItemClick}
        >
          <Plus size={18} className="mr-1" />
          Add Question
        </button>
      </div>
      {jsonArray.length !== 0 ?
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead>
              <tr className="bg-zinc-800 text-white ">
                <th className="max-w-[150px] whitespace-nowrap overflow-x-auto text-ellipses border px-4 py-2">Question</th>
                <th className="max-w-[150px] whitespace-nowrap overflow-x-auto text-ellipses border px-4 py-2">Answer</th>
                <th className="max-w-[150px] whitespace-nowrap overflow-x-auto text-ellipses border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jsonArray.map((item, index) => (
                <tr key={item.id} className="hover:bg-slate-100">
                  <td className="max-w-[150px] text-center font-semibold whitespace-nowrap overflow-x-auto text-ellipses border px-4 py-2">{item.question}</td>
                  <td className="max-w-[150px] text-center font-semibold whitespace-nowrap overflow-x-auto text-ellipses border px-4 py-2">{item.answer}</td>
                  <td className="max-w-[150px] text-center font-semibold whitespace-nowrap overflow-x-auto text-ellipses border px-2 py-2">
                    <button
                      className="mr-1"
                      onClick={() => handleEditClick(item.id)}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="mr-1"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> : <NoContent />}

      {editIndex !== null && (
        <div className="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white max-h-[700px] overflow-auto min-w-[500px] p-8 rounded-lg shadow-md">
            <h2 className="font-bold mb-2 text-center text-lg">
              {editIndex === -1 ? "Add Faq" : "Edit Faq"}
            </h2>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <div className="">
              <div className=" mb-2 lg:pr-4">
                <span className="font-bold my-2 -ml-2">Question</span>

                <input
                  type="text"
                  placeholder="Question"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={editedItem.question}
                  onChange={(e) => handleInputChange(e, "question")}
                />
              </div>
              <div className="mb-2 lg:pr-4">
                <span className="font-bold my-2 -ml-2">Answer</span>

                <input
                  type="text"
                  placeholder="Answer"
                  className="p-2 w-full border border-gray-300 rounded"
                  value={editedItem.answer}
                  onChange={(e) => handleInputChange(e, "answer")}
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

export default AdminFaq;
