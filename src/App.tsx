import { useState, useEffect } from "react";
import {
  DataTable,
  DataTablePageEvent,
  DataTableSelectAllChangeEvent,
} from "primereact/datatable";
import { Column } from "primereact/column";
import SelectCard from "./components/SelectCard";
import { InputNumberValueChangeEvent } from "primereact/inputnumber";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
//Favicon

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
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSelectAllChecked, setIsSelectAllChecked] = useState<boolean>(false);

  //Log in to the console that how many products are being fetched
  console.log(products);

  // Handle value changes in the SelectCard component
  const handleValueChange = (e: InputNumberValueChangeEvent) => {
    setValue(e.value ?? null);
  };

  //Overlay panal
  const handleIconClick = () => {
    handleShowSelect((prev) => !prev);
    setValue(0);
  };

  //Handle button submit
  const handleSubmit = async () => {
    if (value !== null && value > 0) {
      const totalRowsNeeded = Math.min(value, totalRecords);
      const pagesNeeded = Math.ceil(totalRowsNeeded / rowsPerPage);
      const allSelectedProducts: Product[] = [];
      for (let page = currentPage; page < currentPage + pagesNeeded; page++) {
        try {
          const res = await fetch(
            `https://api.artic.edu/api/v1/artworks?page=${page}&limit=${rowsPerPage}`
          );
          const json = await res.json();
          const pageProducts = json.data;
          allSelectedProducts.push(...pageProducts);
          if (allSelectedProducts.length >= totalRowsNeeded) {
            break;
          }
        } catch (error) {
          console.error("Error fetching data for custom selection:", error);
          break;
        }
      }
      const selectedProductsToAdd = allSelectedProducts.slice(
        0,
        totalRowsNeeded
      );
      setSelectedProducts((prev) => [
        ...prev,
        ...selectedProductsToAdd.filter((product) => !prev.includes(product)),
      ]);
    }
  };

  const handleSelectAllChange = (e: DataTableSelectAllChangeEvent) => {
    setIsSelectAllChecked(e.checked);
    if (e.checked) {
      // Select all products on the current page, without duplicating already selected items
      setSelectedProducts((prevSelected) => {
        const newSelections = products.filter(
          (product) => !prevSelected.some((p) => p.id === product.id)
        );
        return [...prevSelected, ...newSelections];
      });
    } else {
      // Deselect only the products on the current page, preserving the previously selected items
      setSelectedProducts((prevSelected) =>
        prevSelected.filter(
          (product) => !products.some((p) => p.id === product.id)
        )
      );
    }
  };

  //Effect to selsect all rows
  useEffect(() => {
    if (isSelectAllChecked) {
      setSelectedProducts(products);
    } else {
      return;
    }
  }, [isSelectAllChecked, products]);

  // Fetch data when currentPage or rowsPerPage changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.artic.edu/api/v1/artworks?page=${currentPage}&limit=${rowsPerPage}`
        );
        const json = await res.json();
        const data = json.data;
        setProducts(data);
        setTotalRecords(json.pagination.total);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, rowsPerPage]);

  const onPageChange = (event: DataTablePageEvent) => {
    setCurrentPage(event.page !== undefined ? event.page + 1 : 1);
    setRowsPerPage(event.rows || rowsPerPage);
  };

  return (
    <>
      <div className="card">
        <DataTable
          value={products}
          paginator
          first={(currentPage - 1) * rowsPerPage}
          rows={rowsPerPage}
          totalRecords={totalRecords}
          rowsPerPageOptions={[5, 10, 25, 50]}
          lazy
          onPage={onPageChange}
          selectionMode={rowClick ? null : "checkbox"}
          selection={selectedProducts}
          onSelectionChange={(e: { value: Product[] | null }) => {
            const newSelection = e.value || [];
            const updatedSelection = selectedProducts.filter((product) =>
              newSelection.some((p) => p.id === product.id)
            );
            const newlySelected = newSelection.filter(
              (product) => !selectedProducts.some((p) => p.id === product.id)
            );
            setSelectedProducts([...updatedSelection, ...newlySelected]);
          }}
          dataKey="id"
          tableStyle={{ minWidth: "50rem" }}
          loading={loading}
          onSelectAllChange={handleSelectAllChange}
          selectAll={isSelectAllChecked}
        >
          <Column
            selectionMode="multiple"
            headerStyle={{ width: "3rem" }}
          ></Column>
          <Column
            field="id"
            header={() => (
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ cursor: "pointer" }} onClick={handleIconClick}>
                  <FontAwesomeIcon icon={faChevronDown} />
                </span>
                <SelectCard
                  value={value}
                  handleValueChange={handleValueChange}
                  showCard={showSelect}
                  handleIconClick={handleIconClick}
                  handleSubmit={handleSubmit}
                />
                <span style={{ cursor: "pointer" }} onClick={handleIconClick}>
                  Code
                </span>
              </div>
            )}
          />
          <Column field="title" header="Name"></Column>
          <Column field="place_of_origin" header="Place"></Column>
          <Column field="artist_display" header="Artist"></Column>
          <Column
            body={(rowData) => rowData?.inscriptions || "NA"}
            header="Inscriptions"
          ></Column>
          <Column field="date_start" header="Start"></Column>
          <Column field="date_end" header="End"></Column>
          <Column field="category_titles" header="Category"></Column>
        </DataTable>
      </div>
    </>
  );
}
