// client/src/pages/catalog/index.jsx
import { ProductCard } from "@/widgets/ProductCard";
import { useEffect, useState } from "react";

export const CatalogPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  return (
    <div>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
};
