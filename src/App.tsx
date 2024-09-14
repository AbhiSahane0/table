import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProductService } from "./service/ProductService";
import SelectCard from "./components/SelectCard";
import { InputNumberValueChangeEvent } from "primereact/inputnumber";
import "primereact/resources/themes/lara-light-indigo/theme.css";

interface Product {
  id?: string;
  code?: string;
  name?: string;
  description?: string;
  image?: string;
  price?: number;
  category?: string;
  quantity?: number;
  inventoryStatus?: string;
  rating?: number;
}

export default function CheckboxRowSelectionDemo() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [rowClick] = useState<boolean>(true);
  const [value, setValue] = useState<number | null>(0);
  const [showSelect, handleShowSelect] = useState<boolean>(false);

  const handleValueChange = (e: InputNumberValueChangeEvent) => {
    setValue(e.value ?? null);
  };

  const handleIconClick = () => {
    handleShowSelect((prev) => !prev);
    console.log(showSelect);
  };

  useEffect(() => {
    ProductService.getProductsSmall().then((data) => setProducts(data));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".select-card-container") && showSelect) {
        handleShowSelect(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSelect]);

  return (
    <>
      <div className="card">
        <DataTable
          value={products}
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25, 50]}
          selectionMode={rowClick ? null : "checkbox"}
          selection={selectedProducts}
          onSelectionChange={(e: { value: Product[] | null }) =>
            setSelectedProducts(e.value || [])
          }
          dataKey="id"
          tableStyle={{ minWidth: "50rem" }}
        >
          <Column
            selectionMode="multiple"
            headerStyle={{ width: "3rem" }}
          ></Column>
          <Column
            field="code"
            header={() => (
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ cursor: "pointer" }} onClick={handleIconClick}>
                  Code
                </span>

                <SelectCard
                  value={value}
                  handleValueChange={handleValueChange}
                  showCard={showSelect}
                  handleIconClick={handleIconClick}
                />
                <span style={{ cursor: "pointer" }} onClick={handleIconClick}>
                  ⌄
                </span>
              </div>
            )}
          />
          <Column field="name" header="Name"></Column>
          <Column field="category" header="Category"></Column>
          <Column field="quantity" header="Quantity"></Column>
        </DataTable>
      </div>
    </>
  );
}
