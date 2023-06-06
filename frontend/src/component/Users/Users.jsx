import React, { useState, useEffect } from "react";
import { Button as AntButton, Table } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import { fetchUsersData } from "../../api";

const Users = () => {
  const token = localStorage.getItem("token");

  const [data, setData] = useState([]);

  const [selectedRecords, setSelectedRecords] = useState([]);

  const columns = [
    {
      title: "No.",
      dataIndex: "id",
      width: 50,
      key: "rowNumber",
      render: (text, record, index) => index + 1,
    },
    {
      dataIndex: "id",
      title: "ID",
      width: 50,
      sorter: (a, b) => a.id - b.id,
    },
    {
      dataIndex: "username",
      title: "Username",
      width: 100,
      sorter: (a, b) => (a.username || "").localeCompare(b.username || ""),
      render: (text) =>
        text ? text : <span style={{ color: "green" }}>Empty</span>,
    },
    {
      dataIndex: "email",
      title: "Email",
      width: 100,
      sorter: (a, b) => (a.email || "").localeCompare(b.email || ""),
      render: (text) =>
        text ? text : <span style={{ color: "green" }}>Empty</span>,
    },
    {
      dataIndex: "confirmed",
      title: "Confirmed",
      width: 70,
      sorter: (a, b) =>
        (a.confirmed || "")
          .toString()
          .localeCompare((b.confirmed || "").toString()),
      render: (confirmed) => <span>{confirmed.toString()}</span>,
    },
    {
      dataIndex: "blocked",
      title: "Blocked",
      width: 70,
      sorter: (a, b) =>
        (a.blocked || "")
          .toString()
          .localeCompare((b.blocked || "").toString()),
      render: (blocked) => <span>{blocked.toString()}</span>,
    },
    {
      dataIndex: "createdAt",
      title: "Created At",
      width: 100,
      sorter: (a, b) => (a.createdAt || "").localeCompare(b.createdAt || ""),
      render: (text) =>
        text ? text : <span style={{ color: "green" }}>Empty</span>,
    },
    {
      dataIndex: "updatedAt",
      title: "UpdatedAt",
      width: 100,
      sorter: (a, b) => (a.updatedAt || "").localeCompare(b.updatedAt || ""),
      render: (text) =>
        text ? text : <span style={{ color: "green" }}>Empty</span>,
    },
    {
      title: "Edit",
      width: 70,
      render: (text, record) => (
        <AntButton
          type="text"
          danger
          onClick={() => handleEdit(record)}
          icon={<EditOutlined style={{ verticalAlign: "baseline" }} />}
          style={{
            color: "#25805b",
            background: "#def7ec",
            borderRadius: "13px",
          }}
        />
      ),
    },
    {
      title: "Delete",
      width: 70,
      render: (text, record) => (
        <AntButton
          type="text"
          danger
          onClick={() => handleDelete(record)}
          icon={<DeleteOutlined style={{ verticalAlign: "baseline" }} />}
          style={{
            color: "#b34c4c",
            background: "#f6cccc",
            borderRadius: "13px",
          }}
        />
      ),
    },
  ];

  useEffect(() => {
    handleUsersApi();
    // eslint-disable-next-line
  }, []);

  const handleUsersApi = async () => {
    try {
      const data = await fetchUsersData(token);
      setData(data);
      console.log(data, "data");
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (record) => {
    console.log("Select for Edit", record);
  };

  const handleDelete = (record) => {
    console.log("Select for Delete", record);
  };

  const rowSelection = {
    type: "checkbox",
    selectedRowKeys: selectedRecords,
    onChange: (selectedRows) => {
      setSelectedRecords(selectedRows);
    },
  };

  const pagination = {
    defaultPageSize: 5,
    pageSizeOptions: [1, 2, 3, 5, 10, 20, 30, 50, 100, 150, 200],
    showSizeChanger: true,
    locale: { items_per_page: "" },
    showTotal: (total, range) => (
      <span style={{ fontWeight: "600" }}>
        {`${range[0]} - ${range[1]}  of  ${total}  items`}
      </span>
    ),
  };

  return (
    <main>
      <Table
        rowKey="id"
        rowSelection={rowSelection}
        dataSource={data}
        columns={columns}
        pagination={{
          ...pagination,
          position: ["topRight"],
        }}
        title={() => (
          <h5 style={{ textAlign: "center", color: "#2876d2" }}>
            <b>Users Data Table</b>
          </h5>
        )}
      />
    </main>
  );
};

export default Users;
