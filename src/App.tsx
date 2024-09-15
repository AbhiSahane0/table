import { useState, useEffect } from "react";
import { DataTable, DataTablePageEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import SelectCard from "./components/SelectCard";
import { InputNumberValueChangeEvent } from "primereact/inputnumber";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRecords, setTotalRecords] = useState(0);

  const handleValueChange = (e: InputNumberValueChangeEvent) => {
    setValue(e.value ?? null);
  };

  const handleIconClick = () => {
    handleShowSelect((prev) => !prev);
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
      try {
        const res = await fetch(
          `https://api.artic.edu/api/v1/artworks?page=${currentPage}&limit=${rowsPerPage}`
        );
        const json = await res.json();
        const data = json.data;
        setProducts(data);
        setTotalRecords(json.pagination.total); // Set total records for pagination
      } catch (error) {
        console.error("Error fetching data: ", error);
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
