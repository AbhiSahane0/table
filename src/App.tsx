import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProductService } from "./service/ProductService";
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
  const [selectedProducts, setSelectedProducts] = useState<Product[] | null>(
    null
  );
  const [rowClick, setRowClick] = useState<boolean>(true);

  useEffect(() => {
    ProductService.getProductsSmall().then((data) => setProducts(data));
  }, []);

  return (
    <div className="card">
      <DataTable
        value={products}
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
        selectionMode={rowClick ? null : "checkbox"}
        selection={selectedProducts}
        onSelectionChange={(e) => setSelectedProducts(e.value)}
        dataKey="id"
        tableStyle={{ minWidth: "50rem" }}
      >
        <Column
          selectionMode="multiple"
          headerStyle={{ width: "3rem" }}
        ></Column>
        <Column field="code" header="🔽 Code"></Column>
        <Column field="name" header="Name"></Column>
        <Column field="category" header="Category"></Column>
        <Column field="quantity" header="Quantity"></Column>
      </DataTable>
    </div>
  );
}
