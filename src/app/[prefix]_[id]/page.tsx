'use client'
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/proSlice";
import { getOneProduct } from "@/helpers/getOneProduct";
import { ProductType } from "../../../type";
import Container from "@/components/Container";
import FormattedPrice from "@/components/FormattedPrice";
type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const Page: React.FC<Props> = ({ searchParams }: Props) => {
  const [product, setProduct] = useState<ProductType | undefined>();
  const searchPar = useSearchParams();
  const idString = searchPar.get("id");
  const id = Number(idString);
  const prefix = searchPar.get("prefix");
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const p = await getOneProduct(prefix,id);
        console.log(p)
        setProduct(p);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    if (typeof window !== "undefined") {
      fetchProduct();
    }
  }, [id, prefix]);

  const dispatch = useDispatch();

  return (
    <Container className="flex items-center flex-col md:flex-row px-4 xl:px-0">
      <div className="leaf md:bg-none rounded-[.5rem] bg-fixed w-full md:w-1/2 overflow-hidden bg-zinc-50 md:bg-transparent flex items-center justify-center p-5">
        <img
          src={product?.image}
          alt="product image"
          width={500}
          height={500}
          className="w-[250px] sm:w-[50%] md:w-[100%] lg:w-[70%] border rounded-[.5rem] transform transition-transform hover:scale-110 duration-500"
        />
      </div>
      <div className="w-full mt-5 md:w-1/2 flex flex-col gap-2">
        <h2 className="text-3xl font-semibold">{product?.title}</h2>
        <p className="flex items-center gap-10">
          <FormattedPrice
            amount={product?.price || 0}
            className="text-lg font-semibold"
          />
          <FormattedPrice
            amount={product?.previousPrice || 0}
            className="text-zinc-500 line-through"
          />
        </p>
        <p>
          You saved{" "}
          <FormattedPrice
            amount={
              (product?.previousPrice! - product?.price!) || 0
            }
            className="text-base font-semibold bg-designColor underline underline-offset-2"
          />{" "}
          from this product.
        </p>
        <button
          onClick={() => dispatch(addToCart(product))}
          className="bg-designColor/80 text-zinc-700 px-6 py-2 font-medium rounded-md hover:bg-designColor hover:text-black cursor-pointer duration-200 hover:shadow-lg w-40 my-2"
        >
          add to cart
        </button>
        {product?.isNew && (
          <p className="text-designColor font-semibold">New Arrival</p>
        )}
       
        <p>
          In stock:{" "}
          <span className="font-semibold">{product?.count} pieces</span>
        </p>
        <p className="">{ product?.description}</p>
      </div>
    </Container>
  );
};

export default Page;
