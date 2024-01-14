"use client";
import Container from "@/components/Container";
import { useRouter } from "next/navigation";
import React, { ReactComponentElement, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { StateProps } from "../../type";
import AdminProducts from "./AdminProducts";
import Print3DComponent from "./Admin3DComponent";
import AdminCourses from "./AdminCourses";
import Admin3DComponent from "./Admin3DComponent";
import AdminAbout from "./AdminAbout";
import AdminFaq from "./AdminFaq";
import AdminSlides from "./AdminSlides";

const AdminComponent = () => {
  const userInfo = useSelector((state: StateProps) => state.pro.userInfo);
  const router = useRouter();
  interface SidebarItem {
    id: number;
    label: string;
    content: any;
  }
  const [selectedItem, setSelectedItem] = useState<SidebarItem | null>(null);

  const sidebarItems: SidebarItem[] = [
    { id: 1, label: "Products", content: <AdminProducts /> },
    { id: 2, label: "3D", content: <Admin3DComponent /> },
    { id: 3, label: "Courses", content: <AdminCourses /> },
    { id: 4, label: "About", content: <AdminAbout /> },
    { id: 5, label: "Faq", content: <AdminFaq /> },
    { id: 6, label: "Slides", content: <AdminSlides /> },
    // Add more items as needed
  ];

  const handleItemClick = (item: SidebarItem) => {
    setSelectedItem(item);
  };

  useEffect(() => {
    if (!userInfo) {
      router.push("/login"); // Update the route to your login page
    } else {
      // Check if the user has the right authorization (you might need to customize this)
      if (
        userInfo.email === "ibrahem" &&
        userInfo.password === process.env.NEXT_PUBLIC_AUTH_TOKEN
      ) {
        // The user is authorized, continue rendering the admin page
      } else {
        // If the user is not authorized, redirect to the login page
        router.push("/login"); // Update the route to your login page
      }
    }
    console.log(sidebarItems)
  }, [userInfo, router]);

  return (
      <>
        {/* Sidebar */}
        <div className="lg:w-1/4 border-r border-gray-200 p-4">
          <h2 className="text-2xl font-bold mb-4">Pages</h2>

          <ul className="flex items-center bg-white py-2 px-5 font-bold justify-between overflow-x-auto gap-x-3 lg:flex-col lg:bg-transparent lg:items-start">
            {sidebarItems.map((item) => (
              <li
                key={item.id}
                className={`cursor-pointer ${
                  selectedItem === item ? "text-blue-400" : ""
                } my-0`}
                onClick={() => handleItemClick(item)}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>

        {/* Main content */}
        <div className="flex-1 p-4 relative">
          <header className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Robotech Panel</h2>
          </header>

          {selectedItem ? (
            <div className="">
              <h3 className="text-xl font-bold mb-2">
                {selectedItem.label} Page
              </h3>
              <p className="text-gray-600">{selectedItem.content}</p>
            </div>
          ) : (
            <p className="font-bold text-lg flex items-center justify-center bg-white h-[500px] mb-5 text-gray-600">
              Select Page from the sidebar.
            </p>
          )}
        </div>
      </>
  );
};

export default AdminComponent;