"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CustomerPageAddProducts from "@/components/CustomerPageAddProducts";
import CustomerPageAddCourses from "@/components/CustomerPageAddCourses";
import CustomerPageAddPrintServices from "@/components/CustomerPageAddPrintServices";
import toast from "react-hot-toast";
import { Printer, ScrollText, Trash } from "lucide-react";
import Bill from "@/components/Bill";
import { ProductType } from "../../../../type";
import supabase from "@/supabase/config";
import { calculatePeriod } from "@/lib/calculatePeriod";
import CustomerOrdersList from "@/components/CustomerOrdersList";
const CustomerPage = () => {
  const router = useRouter();
  const searchPar = useSearchParams();
  const customerId = searchPar?.get("id");
  // const data = searchPar?.get("data");

  // const initialCustomerData =
  // typeof data === "string" ? JSON.parse(data) : null;
  const [customerData, setCustomerData] = useState<any>(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [currentBillId, setCurrentBillId] = useState(0);
  const [billData, setBillData] = useState<any>([]);
  const [showBill, setShowBill] = useState(false);
  const [showOrdersList, setShowOrdersList] = useState(false);
  const [currentBill, setCurrentBill] = useState<BillType>();
  interface BillType {
    data: ProductType[],
    customerData: any
  }
  const tabs = [
    {
      content: (
        <CustomerPageAddProducts
          setCustomerData={setCustomerData}
          customerData={customerData}
          billData={billData}
          setBillData={setBillData}
        />
      ),
      label: "Product",
    },
    {
      content: (
        <CustomerPageAddCourses
          setCustomerData={setCustomerData}
          customerData={customerData}
          billData={billData}
          setBillData={setBillData}
        />
      ),
      label: "Course",
    },
    {
      content: (
        <CustomerPageAddPrintServices
          setCustomerData={setCustomerData}
          customerData={customerData}
          billData={billData}
          setBillData={setBillData}
        />
      ),
      label: "Print Service",
    },
  ];

  const printBill = async () => {
    setShowBill(true);
    const bill = {
      data: billData,
      customerData: customerData
    };
    setCurrentBill(bill);
    const { data, error } = await supabase.from('bills').insert([bill]).select();
    setCurrentBillId(data![0].id)
    toast.success("When you're ready, please click CTRL + P to print.");
  };


  useEffect(() => {
    async function fetchCustomerData() {
      try {
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .eq('id', customerId!)
          .single();

        if (error) {
          throw error;
        }

        setCustomerData(data);
      } catch (error) {
        console.error('Error fetching customer data:', (error as Error).message);
      }
    }

    fetchCustomerData();
  }, [customerId]);


  const setBill = () => {
    const confirm = window.confirm('Sure To Reset Bill ?');
    if (!confirm) return;
    setBillData([])
  }


  const handleCustomerOrders = () => {
    setShowOrdersList(true)
    return;
  }




  return (
    <div className="m-8 relative">
      {customerData && (
        <div className="bg-white  p-8 rounded-lg shadow-md">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-semibold mb-8 ">
              Customer Information
            </h2>
            <button
              onClick={() => handleCustomerOrders()}
              className={`py-3 px-5 flex gap-2 items-center justify-center rounded focus:outline-none bg-indigo-500 text-white transition duration-300`}
            >
              <ScrollText size={20} /> Orders
            </button>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            <div>
              <p className="text-gray-600 mb-2">Full Name:</p>
              <p className="font-semibold">{customerData.fullName}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-2">Join Date:</p>
              <p className="font-semibold">
                {calculatePeriod(customerData.join_date) || 'today'} ago
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-2">Phone No.:</p>
              <p className="font-semibold">
                {customerData.phone || "No Phone"}
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-2">Address:</p>
              <p className="font-semibold">
                {customerData.address || "No Address"}
              </p>
            </div>

            <div>
              <p className="text-gray-600 mb-2">Education:</p>
              <p className="font-semibold">
                {customerData.faculty || "No Education"}
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-2">ID:</p>
              <p className="font-semibold text-gray-500 text-xs">
                {customerId}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-3xl font-semibold mb-8">Create a Bill</h2>

            <section className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1 px-6 bg-slate-200 h-[400px] overflow-auto mb-4 lg:mr-8">
                {tabs[currentTab].content}
              </div>

              <div className="flex flex-col  space-y-4 lg:w-1/4">

                {tabs.map((tab, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTab(index)}
                    className={`py-3 px-5 rounded focus:outline-none ${currentTab === index
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white transition duration-300"
                      }`}
                  >
                    Sell {tab.label}
                  </button>
                ))}
                {billData.length ? <>

                  <button
                    onClick={() => printBill()}
                    className={`py-3 justify-center flex items-center gap-2 mt-auto px-5 rounded focus:outline-none bg-blue-200 text-blue-700 hover:bg-blue-500 hover:text-white transition duration-300`}
                  >
                    Submit Bill
                    <Printer className="" />
                  </button>
                  <button
                    onClick={() => setBill()}
                    className={`py-3 justify-center flex items-center gap-2 mt-auto px-5 rounded focus:outline-none bg-rose-200 text-rose-700 hover:bg-rose-500 hover:text-white transition duration-300`}
                  >
                    Set Bill
                    <Trash className="" />
                  </button>
                </> : null}

              </div>
            </section>
          </div>
        </div>
      )}
      {showBill && <Bill id={currentBillId} setBillData={setBillData} setShowBill={setShowBill} transactionData={billData} />}
      {showOrdersList && <CustomerOrdersList />}
    </div>
  );
};

export default CustomerPage;
