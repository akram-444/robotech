
'use client'
import { useState, useEffect, ChangeEvent } from 'react';
import Link from "next/link";
import Logo from "./Logo";
import { Heart, ShoppingBagIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { navigation } from "@/constants/data";
import { useSelector } from "react-redux";
import { ProductType, StateProps } from "../../type";
import { getProducts } from "../helpers/getProducts"; // Update the import path
import FormattedPrice from './FormattedPrice';

// Define the type for product items


const Navbar = () => {
  const pathname = usePathname();
  const { productData, favoriteData } = useSelector(
    (state: StateProps) => state.pro
  );

  const [res, setRes] = useState<ProductType[]>([]);
  const [isInput, setIsInput] = useState(false);
  const [inputQuery, setInputQuery] = useState<string>("");

  const searching = (query: string) => {
    setIsInput(true);
    setInputQuery(query);
  };

  useEffect(() => {
    const fetchData = async () => {
      let allProducts = await getProducts();
      // Perform the search operation here and update the 'res' state
      const searchResults = allProducts.filter((item: ProductType) =>
        item.title.toLowerCase().includes(inputQuery.toLowerCase())
      );

      setRes(searchResults);
    };

    fetchData();
  }, [inputQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        event.target instanceof Element &&
        event.target.closest(".search-container") === null
      ) {
        setIsInput(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full py-2 border-b-[1px] border-b-zinc-500 bg-white text-zinc-600 sticky top-0 z-50 bg-white/80 backdrop-blur-2xl">
      <div className="order-first flex-wrap max-w-screen-xl mx-auto h-full flex items-center justify-between px-4 xl:px-0">
        {/* Logo */}
        <Logo />
        {/* Navigation */}
        <ul className="order-last  md:order-none w-full md:w-fit flex py-2 items-center gap-5 text-sm uppercase font-semibold">
          {navigation.map((item) => (
            <Link href={item?.href} key={item.title}>
              <li
                className={`hover:text-black cursor-pointer duration-200 relative overflow-hidden group ${item.href === pathname && "text-designColor"
                  }`}
              >
                {item?.title}
                <span
                  className={`absolute h-[1px] w-full bg-blue-700 left-0 bottom-0 -translate-x-[100%] group-hover:translate-x-0 transition-transform duration-500 ${item.href === pathname && "translate-x-0 bg-designColor"
                    }`}
                />
              </li>
            </Link>
          ))}
        </ul>
        <div className="relative flex-1 max-w-lg mx-4 relative flex justify-center items-center">
          <input
            onInput={(e: ChangeEvent<HTMLInputElement>) =>
              searching(e.target.value)
            }
            className="outline-none bg-slate-200 rounded-md px-4 py-2 md:py-3 w-full max-width-lg"
            type="search"
            placeholder="Search..."
          />
          <ul
            className={`${isInput ? "block py-3 " : "hidden p-0 "
              } shadow-lg top-11 w-full border shadow-md border-zinc-400 absolute bg-white mt-2 rounded-sm`}
          >
            {res.length > 0 ? (
              res.map((item) => (
                <li
                  key={item.title}
                  className={`${isInput ? "py-2.5 border-b" : "p-0 border-0"} hover:bg-zinc-100 cursor-pointer hover:bg-slate-200 rounded-sm my-1`}
                >
                  <Link
                    className='flex items-center font-bold justify-between px-3'
                    href={{ pathname: `/id_${item?.id}`, query: { id: item?.id, prefix: item?.category } }}>
                    <span className='flex-col flex'>
                      <span className='text-xl  text-blue-400'>{item.title}</span>
                      <span className='text-xs font-bold'><FormattedPrice amount={item?.price} /></span>
                    </span>
                    <img className='rounded-md' src={item.image1} width={70} height={70} />
                  </Link>
                </li>
              ))
            ) : (
              <li>No results found</li>
            )}
          </ul>
        </div>
        {/* icons */}
        <div className="md:order-last flex items-center gap-x-5">
          <Link
            href={"/wishlist"}
            className="hover:text-black cursor-pointer duration-200 relative group"
          >
            <Heart className="w-7 h-7" />
            <span className="absolute top-0 -left-1 bg-zinc-800 text-zinc-200 w-4 h-4 rounded-full text-xs flex items-center justify-center group-hover:bg-black font-semibold group-hover:text-white">
              {favoriteData ? favoriteData.length : 0}
            </span>
          </Link>
          <Link
            href={"/cart"}
            className="hover:text-black cursor-pointer duration-200 relative group"
          >
            <ShoppingBagIcon className="w-7 h-7" />
            <span className="absolute top-0 -left-1 bg-zinc-800 text-zinc-200 w-4 h-4 rounded-full text-xs flex items-center justify-center group-hover:bg-black font-semibold group-hover:text-white">
              {productData ? productData.length : 0}
            </span>
          </Link>


        </div>

      </div>
    </div>
  );
};

export default Navbar;