import React, { useState, useEffect } from "react";
import { Button } from "@themesberg/react-bootstrap";
import {
  Button as AntButton,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Select,
  Table,
  message,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import BootstrapLoader from "../BootstrapLoader";
import {
  fetchProductData,
  fetchCategoriesName,
  fetchSubCategoriesName,
  createProductData,
  updateProductData,
  deleteProductData,
} from "../../api";

const Product = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const token = localStorage.getItem("token");
  const [form] = Form.useForm();

  const [data, setData] = useState([]);
  const [categoriesName, setCategoriesName] = useState([]);
  const [subCategoriesName, setSubCategoriesName] = useState([]);

  const [createFormData, setCreateFormData] = useState({});
  const [editFormData, setEditFormData] = useState({});
  const [deleteFormData, setDeleteFormData] = useState({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [files, setFiles] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState([]);

  const columns = [
    {
      title: "No.",
      dataIndex: "rowNumber",
      width: 50,
      key: "rowNumber",
      render: (text, record, index) => index + 1,
    },
    {
      title: "ID",
      dataIndex: "id",
      width: 70,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Category Name",
      dataIndex: "category_name",
      key: "category_name",
      width: 70,
      sorter: (a, b) =>
        (a.category_id?.category_name || "").localeCompare(
          b.category_id?.category_name || ""
        ),
      render: (text, record) =>
        record.category_id?.category_name ? (
          record.category_id?.category_name
        ) : (
          <span style={{ color: "green" }}>No Available</span>
        ),
    },
    {
      title: "Sub Category Name",
      dataIndex: "sub_category_name",
      key: "sub_category_name",
      width: 70,
      sorter: (a, b) =>
        (a.sub_category_id?.sub_category_name || "").localeCompare(
          b.sub_category_id?.sub_category_name || ""
        ),
      render: (text, record) =>
        record.sub_category_id?.sub_category_name ? (
          record.sub_category_id?.sub_category_name
        ) : (
          <span style={{ color: "green" }}>No Available</span>
        ),
    },
    {
      title: "frame_type",
      dataIndex: "frame_type",
      width: 70,
      sorter: (a, b) => (a.frame_type || "").localeCompare(b.frame_type || ""),
      render: (text, record) =>
        record.frame_type ? (
          record.frame_type
        ) : (
          <span style={{ color: "green" }}>Empty</span>
        ),
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: 70,
      sorter: (a, b) => (a.image || "").localeCompare(b.image || ""),
      render: (text, record) =>
        record.image ? (
          record.image
        ) : (
          <span style={{ color: "green" }}>No Available</span>
        ),
    },
    {
      dataIndex: "file",
      title: "File",
      width: 70,
      sorter: (a, b) =>
        a.file && b.file
          ? (a.file[0]?.name || "").localeCompare(b.file[0]?.name || "")
          : 0,
      render: (text, record) => {
        const file = record.file ? record.file[0] : null;
        if (file) {
          return (
            <a href={file.url} target="_blank" rel="noopener noreferrer">
              {file.name}
            </a>
          );
        } else {
          return <span style={{ color: "green" }}>No Available</span>;
        }
      },
    },
    {
      title: "Edit",
      key: "edit",
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
      key: "delete",
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
    fetchDataCategoryName();
    handleCategoryApi();
    // eslint-disable-next-line
  }, []);

  const handleCategoryApi = async (searchQuery = "") => {
    try {
      const data = await fetchProductData(searchQuery);
      setData(data);
      console.log(data, "data");
    } catch (err) {
      console.log(err);
    }
  };

  const fetchDataCategoryName = async () => {
    try {
      const data = await fetchCategoriesName();
      setCategoriesName(data);
      console.log(data, "name");
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchDataSubCategoryName = async (selectedValue) => {
    try {
      const data = await fetchSubCategoriesName(selectedValue);
      setSubCategoriesName(data);
      console.log(data, "Subname");
    } catch (error) {
      console.error("Error fetching sub-categories:", error);
    }
  };

  const handleCreateForm = async (values, event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      console.log("Form values After Create:", values);

      if (isCreateModalOpen) {
        if (currentUser && currentUser.id) {
          const formData = new FormData();
          formData.append("category_id", values.category_id);
          formData.append("sub_category_id", values.sub_category_id);
          formData.append("frame_type", values.frame_type);
          for (let i = 0; i < files.length; i++) {
            formData.append("file", files[i]);
          }

          const success = await createProductData(formData, token);

          if (success) {
            console.log("Creating Successfull");
            setIsCreateModalOpen(false);
            form.resetFields();
            setFileNames([]);
            handleCategoryApi(searchQuery);
          } else {
            console.log("Failed to create entry");
          }
        } else {
          console.log("Invalid currentUser object. Unable to create data.");
        }
      }
    } catch (err) {
      console.log("Error:", err);
      if (err.response) {
        console.log("Error response:", err.response);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditForm = async (values, event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      console.log("Form values After Edit:", values);
      if (
        currentUser &&
        currentUser.id &&
        values.created_by_user &&
        values.created_by_user.id === currentUser.id
      ) {
        if (isEditModalOpen) {
          const formData = new FormData();

          formData.append("category_id", values.category_id);
          formData.append("sub_category_id", values.sub_category_id);
          formData.append("frame_type", values.frame_type);
          for (let i = 0; i < files.length; i++) {
            formData.append("file", files[i]);
          }

          const success = await updateProductData(values.id, formData, token);

          if (success) {
            console.log("Updating Successfull");
            setIsEditModalOpen(false);
            setData((prevData) =>
              prevData.map((row) =>
                row.id === values.id ? { ...row, ...values } : row
              )
            );
            form.resetFields();
            setFileNames([]);
            handleCategoryApi(searchQuery);
          } else {
            console.log("Failed to update entry");
          }
        }
      } else {
        console.log("User is not authorized to update this data.");
      }
    } catch (err) {
      console.log("Error:", err);
      if (err.response) {
        console.log("Error response:", err.response);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteForm = async (values, event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      console.log("Form values:", values);
      if (currentUser && currentUser.id) {
        if (
          values.created_by_user &&
          values.created_by_user.id === currentUser.id
        ) {
          const success = await deleteProductData(values.id, token);

          if (success) {
            console.log("Deleting Successfull");
            setIsDeleteModalOpen(false);
            setData((prevData) =>
              prevData.filter((row) => row.id !== values.id)
            );
            form.resetFields();
            setFileNames([]);
            handleCategoryApi(searchQuery);
          } else {
            console.log("Failed to delete entry");
          }
        } else {
          console.log("User is not authorized to delete this data.");
        }
      } else {
        console.log("Invalid currentUser object. Unable to delete data.");
      }
    } catch (err) {
      console.log("Error:", err);
      if (err.response) {
        console.log("Error response:", err.response);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMultipleCategoryData = async (selectedRecords) => {
    console.log(selectedRecords, "Delete");
    try {
      setIsLoading(true);

      for (const id of selectedRecords) {
        const success = await deleteProductData(id, token);
        handleCategoryApi(searchQuery);
        if (!success) {
          console.log(`Failed to delete category with ID ${id}.`);
          return;
        }
      }

      setIsLoading(false);
      setSelectedRecords([]);
      setData((prevData) => {
        return prevData.map((row) =>
          selectedRecords.includes(row.id) ? { ...row, status: "deleted" } : row
        );
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleCreate = () => {
    setCreateFormData({});
    setIsCreateModalOpen(true);
  };

  const handleEdit = (record) => {
    console.log("Select for Edit", record);
    setEditFormData(record);
    setIsEditModalOpen(true);
  };

  const handleDelete = (record) => {
    console.log("Select for Delete", record);
    setDeleteFormData({ ...record });
    setIsDeleteModalOpen(true);
  };

  const handleModalCancel = () => {
    form.resetFields();
    setFileNames([]);
    setCreateFormData({});
    setEditFormData({});
    setDeleteFormData({});
    setIsEditModalOpen(false);
    setIsCreateModalOpen(false);
    setIsDeleteModalOpen(false);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    const fileNames = selectedFiles.map((file) => file.name);
    setFileNames(fileNames);
  };

  const handleSelectChange = (value) => {
    console.log("Selected value:", value);
    setSelectedValue(value);
    fetchDataSubCategoryName(value);
  };

  const handleChange = (value) => {
    // Handle the change event here
    console.log(value);
  };

  const filterData = (data, searchQuery) => {
    return data.filter((row) =>
      Object.keys(row).some((key) =>
        key === "category_id" || key === "sub_category_id"
          ? row[key] &&
            row[key][
              key === "category_id" ? "category_name" : "sub_category_name"
            ] &&
            row[key][
              key === "category_id" ? "category_name" : "sub_category_name"
            ]
              .toString()
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          : row[key] &&
            row[key]
              .toString()
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
      )
    );
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
      {/* CreateModal */}
      <Modal
        title="Create Modal"
        onOk={handleCreateForm}
        open={isCreateModalOpen}
        onCancel={handleModalCancel}
        centered
        footer={[
          <div>
            <Button
              key="cancel"
              onClick={handleModalCancel}
              style={{
                border: "2px solid #d1d5db",
                backgroundColor: "transparent",
                color: "black",
                borderRadius: "10px",
              }}
            >
              Cancel
            </Button>{" "}
            <Button
              key="submit"
              type="primary"
              disabled={isLoading}
              onClick={(event) =>
                handleCreateForm(form.getFieldsValue(), event)
              }
              style={{
                borderRadius: "10px",
              }}
            >
              Create
              {isLoading && <BootstrapLoader />}
            </Button>
          </div>,
        ]}
      >
        <Form
          form={form}
          onFinish={handleCreateForm}
          initialValues={createFormData}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Category Id" name="category_id">
                <Select onChange={handleSelectChange} value={selectedValue}>
                  {categoriesName.map((category) => (
                    <Select.Option key={category.id} value={category.id}>
                      {category.category_name || (
                        <span style={{ color: "green" }}>
                          name is not available
                        </span>
                      )}
                      ({category.id})
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Sub Category Id" name="sub_category_id">
                <Select onChange={handleSelectChange} value={selectedValue}>
                  {subCategoriesName.map((category) => (
                    <Select.Option key={category.id} value={category.id}>
                      {category.sub_category_name || (
                        <span style={{ color: "green" }}>
                          name is not available
                        </span>
                      )}{" "}
                      ({category.id})
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Frame Type" name="frame_type">
                <Select onChange={handleChange}>
                  <Select.Option value="Free">Free</Select.Option>
                  <Select.Option value="Paid">Paid</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="File"
                name="file"
                rules={[
                  { required: true, message: "Please upload a category image" },
                ]}
              >
                <input type="file" multiple onChange={handleFileChange} />
              </Form.Item>
              {fileNames.length > 0 && (
                <div>
                  <strong>Selected File:</strong>
                  <ul>
                    {fileNames.map((name, index) => (
                      <li key={index}>{name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Col>
          </Row>
        </Form>
      </Modal>
      {/* EditModal */}
      <Modal
        title="Update Modal"
        onOk={handleEditForm}
        open={isEditModalOpen}
        onCancel={handleModalCancel}
        centered
        footer={[
          <div>
            <Button
              key="cancel"
              onClick={handleModalCancel}
              style={{
                border: "2px solid #d1d5db",
                backgroundColor: "transparent",
                color: "black",
                borderRadius: "10px",
              }}
            >
              Cancel
            </Button>{" "}
            <Button
              key="submit"
              type="primary"
              disabled={isLoading}
              onClick={(event) => handleEditForm(form.getFieldsValue(), event)}
              style={{
                borderRadius: "10px",
              }}
            >
              Update
              {isLoading && <BootstrapLoader />}
            </Button>
          </div>,
        ]}
      >
        <Form
          form={form}
          onFinish={handleEditForm}
          initialValues={editFormData}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="ID" name="id">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="created_by_user" name="created_by_user" hidden>
                <Input
                  value={editFormData?.created_by_user?.id || ""}
                  disabled
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Category Id" name="category_id">
                <Select onChange={handleSelectChange} value={selectedValue}>
                  {categoriesName.map((category) => (
                    <Select.Option key={category.id} value={category.id}>
                      {category.category_name || (
                        <span style={{ color: "green" }}>
                          name is not available
                        </span>
                      )}
                      ({category.id})
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Sub Category Id" name="sub_category_id">
                <Select onChange={handleSelectChange} value={selectedValue}>
                  {subCategoriesName.map((category) => (
                    <Select.Option key={category.id} value={category.id}>
                      {category.sub_category_name || (
                        <span style={{ color: "green" }}>
                          name is not available
                        </span>
                      )}{" "}
                      ({category.id})
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Frame Type" name="frame_type">
                <Select onChange={handleChange}>
                  <Select.Option value="Free">Free</Select.Option>
                  <Select.Option value="Paid">Paid</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="File-Upload"
                name="files"
                rules={[
                  { required: true, message: "Please upload a category image" },
                ]}
              >
                <input type="file" multiple onChange={handleFileChange} />
              </Form.Item>

              {fileNames.length > 0 && (
                <div>
                  <strong>Selected File:</strong>
                  <ul>
                    {fileNames.map((name, index) => (
                      <li key={index}>{name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Col>
          </Row>
        </Form>
      </Modal>
      {/* DeleteModal */}
      <Modal
        title="Delete Modal"
        onOk={handleDeleteForm}
        open={isDeleteModalOpen}
        onCancel={handleModalCancel}
        centered
        footer={[
          <div>
            <Button
              key="cancel"
              onClick={handleModalCancel}
              style={{
                border: "2px solid #d1d5db",
                backgroundColor: "transparent",
                color: "black",
                borderRadius: "10px",
              }}
            >
              Cancel
            </Button>{" "}
            <Button
              key="submit"
              type="primary"
              disabled={isLoading}
              onClick={(event) =>
                handleDeleteForm(form.getFieldsValue(), event)
              }
              style={{
                borderRadius: "10px",
              }}
            >
              Delete
              {isLoading && <BootstrapLoader />}
            </Button>
          </div>,
        ]}
      >
        <Form
          form={form}
          onFinish={handleDeleteForm}
          initialValues={{ ...deleteFormData }}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="ID" name="id">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="created_by_user" name="created_by_user" hidden>
                <Input
                  value={deleteFormData?.created_by_user?.id || ""}
                  disabled
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: "10px 0px",
        }}
      >
        <Input
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          suffix={<SearchOutlined />}
          style={{
            width: 200,
            backgroundColor: "#fff",
            border: "2px solid #e6e6e6",
            borderRadius: "15px",
            padding: "10px 20px",
          }}
        />

        {selectedRecords?.length > 0 && (
          <>
            <Button
              type="text"
              danger
              disabled={isLoading}
              onClick={() => deleteMultipleCategoryData(selectedRecords)}
              style={{
                color: "#b34c4c",
                background: "#f6cccc",
                borderRadius: "15px",
                border: "1px solid #b34c4c",
                fontWeight: "600",
                padding: "10px 30px",
              }}
            >
              Delete All {isLoading && <BootstrapLoader />}
            </Button>
          </>
        )}

        <AntButton
          type="text"
          danger
          onClick={handleCreate}
          icon={<PlusOutlined />}
          style={{
            color: "#5250e6",
            backgroundColor: "#f0f0ff",
            border: "1px solid #ddddfe",
            height: "auto",
            padding: "10px 20px",
            borderRadius: "15px",
            display: "flex",
            alignItems: "center",
            fontWeight: "700",
          }}
        >
          Create New Product
        </AntButton>
      </div>

      <Table
        rowKey="id"
        rowSelection={rowSelection}
        dataSource={filterData(data, searchQuery)}
        columns={columns}
        pagination={{
          ...pagination,
          position: ["topRight"],
        }}
        title={() => (
          <h5 style={{ textAlign: "center", color: "#2876d2" }}>
            <b>Product Data Table</b>
          </h5>
        )}
      />
    </main>
  );
};

export default Product;
