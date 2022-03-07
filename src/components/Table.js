import MaterialTable from "@material-table/core";
import { ExportCsv, ExportPdf } from "@material-table/exporters";
import classes from "./Table.module.css";
import { useEffect, useState, useCallback } from "react";
import useHttp from "../hooks/useHttp";
import LoadingSpinner from "../ui/LoadingSpinner";
import { columns, FIREBASE_DOMAIN } from "../models/data";

const Table = () => {
  const [tableData, setTableData] = useState([]);
  const { sendRequest, error, isLoading } = useHttp();

  // FUNKCE PRO TRANSFORMOVANI DAT
  const transformData = useCallback((items) => {
    const loadedItems = [];
    for (const key in items) {
      const item = {
        id: key,
        ...items[key],
      };
      loadedItems.push(item);
    }
    setTableData(loadedItems);
  }, []);

  // FETCHOVANI AKTUALNICH DAT
  const fetchData = useCallback(async () => {
    sendRequest(
      {
        url: `${FIREBASE_DOMAIN}/astronauts/.json`,
      },
      transformData
    );
  }, []);

  // PRIDANI ASTRONAUTA
  const rowAddHandler = async (newData) => {
    sendRequest(
      {
        url: `${FIREBASE_DOMAIN}/astronauts.json`,
        method: "POST",
        body: newData,
        headers: {
          "Content-Type": "application/json",
        },
      },
      fetchData
    );
  };

  // SMAZANI ASTRONAUTA
  const deleteHandler = async (row) => {
    sendRequest(
      {
        url: `${FIREBASE_DOMAIN}/astronauts/${row.id}.json`,
        method: "DELETE",
      },
      fetchData
    );
  };

  // EDITOVANI ASTRONAUTA
  const editHandler = async (editedData) => {
    sendRequest(
      {
        url: `${FIREBASE_DOMAIN}/astronauts/${editedData.id}.json`,
        method: "PUT",
        body: {
          firstName: editedData.firstName,
          lastName: editedData.lastName,
          birthday: editedData.birthday,
          superability: editedData.superability,
        },
        headers: {
          "Content-Type": "application/json",
        },
      },
      fetchData
    );
  };

  // PRI PRVNIM RENDERU
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // LOADING
  if (isLoading) {
    return (
      <div style={{ textAlign: "center" }}>
        <LoadingSpinner />
      </div>
    );
  }

  // ERROR
  if (error) {
    return <p className={classes.error}>{error}</p>;
  }

  return (
    <div className={classes.section}>
      <MaterialTable
        data={tableData}
        columns={columns}
        title="Astronaut Information"
        options={{
          sorting: true,
          /*filtering: true,*/
          paging: true,
          pageSizeOptions: [2, 5, 10, 15],
          pageSize: 5,
          paginationType: "stepped",
          rowStyle: (data, index) =>
            index % 2 === 0 ? { background: "#f5f5f5" } : null,
          headerStyle: { background: "teal", color: "#fff", fontSize: "1rem" },
          exportMenu: [
            {
              label: "Export PDF",
              exportFunc: (cols, datas) => ExportPdf(cols, datas, "Astronauts"),
            },
            {
              label: "Export CSV",
              exportFunc: (cols, datas) => ExportCsv(cols, datas, "Astronauts"),
            },
          ],
          actionsColumnIndex: -1,
        }}
        editable={{
          onRowAdd: (newRow) => rowAddHandler(newRow),
          onRowUpdate: (editedRow) => editHandler(editedRow),
          onRowDelete: (selectedRow) => deleteHandler(selectedRow),
        }}
      />
    </div>
  );
};

export default Table;