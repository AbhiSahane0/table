import {
  InputNumber,
  InputNumberValueChangeEvent,
} from "primereact/inputnumber";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import "primereact/resources/themes/lara-light-indigo/theme.css";

const SelectCard: React.FC<{
  value: number | null;
  handleValueChange: (newValue: InputNumberValueChangeEvent) => void;
  showCard: boolean;
  handleIconClick: () => void;
  handleSubmit: () => void;
}> = ({
  value,
  handleValueChange,
  showCard,
  handleIconClick,
  handleSubmit,
}) => {
  const cardStyle = {
    width: "350px",
    height: "170px",
    display: showCard ? "block" : "none",
    position: "fixed" as React.CSSProperties["position"],
    top: "50px",
    left: "50px",
    backgroundColor: "white",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
    zIndex: 1000,
    padding: "10px",
    boxSizing: "border-box" as React.CSSProperties["boxSizing"],
  };

  return (
    <Card className="select-card-container" role="region" style={cardStyle}>
      <div
        className="card flex flex-wrap p-fluid"
        style={{ margin: "0", padding: "0" }}
      >
        <div className="flex-auto" style={{ margin: "0", padding: "0" }}>
          <label className="font-bold block"></label>
          <InputNumber
            placeholder="Enter no of cells."
            value={value || null}
            onValueChange={handleValueChange}
            useGrouping={false}
            style={{ width: "200px", marginLeft: "20px" }}
          />
          <br />
          <Button
            label="Submit"
            text
            raised
            style={{ width: "100px", marginLeft: "150px", marginTop: "10px" }}
            onClick={() => {
              if (value) {
                handleIconClick();
                handleSubmit();
              } else {
                alert("please Enter Value");
              }
            }}
          />
        </div>
      </div>
    </Card>
  );
};

export default SelectCard;
