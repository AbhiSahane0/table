import { useState, useEffect } from "react";
import {
  DataTable,
  DataTablePageEvent,
  DataTableSelectAllChangeEvent,
  // DataTableSelectAllChangeEvent,
} from "primereact/datatable";
import { Column } from "primereact/column";
import SelectCard from "./components/SelectCard";
import { InputNumberValueChangeEvent } from "primereact/inputnumber";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
// import React from "react";

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

  // const [, setIsSelectAllChecked] = useState<boolean>(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRecords, setTotalRecords] = useState(0);

  // Loading state
  const [loading, setLoading] = useState<boolean>(false); // Added loading state

  const handleValueChange = (e: InputNumberValueChangeEvent) => {
    setValue(e.value ?? null);
  };

  const handleIconClick = () => {
    handleShowSelect((prev) => !prev);
    setValue(0);
  };

  const handleSubmit = async () => {
    if (value !== null && value > 0) {
      // Calculate how many pages are needed to get the required number of products
      const totalRowsNeeded = Math.min(value, totalRecords); // Ensure we don't exceed the available records
      const pagesNeeded = Math.ceil(totalRowsNeeded / rowsPerPage);

      const allSelectedProducts: Product[] = [];

      // Fetch data from all necessary pages
      for (let page = currentPage; page < currentPage + pagesNeeded; page++) {
        try {
          const res = await fetch(
            `https://api.artic.edu/api/v1/artworks?page=${page}&limit=${rowsPerPage}`
          );
          const json = await res.json();
          const pageProducts = json.data;

          // Add products from the current page to the selected list
          allSelectedProducts.push(...pageProducts);

          // Stop if we have collected enough products
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

  const [isSelectAllChecked, setIsSelectAllChecked] = useState<boolean>(false);

  const handleSelectAllChange = (e: DataTableSelectAllChangeEvent) => {
    console.log("Checkbox clicked. All selected:", e.checked);
    setIsSelectAllChecked(e.checked);

    if (e.checked) {
      // Select all items
      setSelectedProducts(products);
    } else {
      // Deselect all items
      setSelectedProducts([]);
    }
  };

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

  // Fetch data when currentPage or rowsPerPage changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true when starting to fetch data
      try {
        const res = await fetch(
          `https://api.artic.edu/api/v1/artworks?page=${currentPage}&limit=${rowsPerPage}`
        );
        const json = await res.json();
        const data = json.data;
        setProducts(data);
        // console.log(data);
        setTotalRecords(json.pagination.total); // Set total records for pagination
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false); // Set loading to false when fetching is complete
      }
    };
    fetchData();
  }, [currentPage, rowsPerPage]);

  // Handle page change
  const onPageChange = (event: DataTablePageEvent) => {
    setCurrentPage(event.page !== undefined ? event.page + 1 : 1); // Adjust for zero-indexed pages
    setRowsPerPage(event.rows || rowsPerPage);
  };

  return (
    <>
      <div className="card">
        <DataTable
          value={products}
          paginator
          first={(currentPage - 1) * rowsPerPage} // Calculates the starting index for the current page
          rows={rowsPerPage}
          totalRecords={totalRecords}
          rowsPerPageOptions={[5, 10, 25, 50]}
          lazy
          onPage={onPageChange}
          selectionMode={rowClick ? null : "checkbox"}
          selection={selectedProducts}
          // onSelectionChange={(e: { value: Product[] | null }) =>
          //   setSelectedProducts(e.value || [])
          // }
          onSelectionChange={(e: { value: Product[] | null }) => {
            const allSelected = e.value?.length === rowsPerPage;
            setIsSelectAllChecked(allSelected);
            setSelectedProducts(e.value || []);
          }}
          dataKey="id"
          tableStyle={{ minWidth: "50rem" }}
          loading={loading} // Use loading prop to show loading spinner
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
