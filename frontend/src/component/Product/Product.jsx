import React, { useState, useEffect } from "react";
import { Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button as AntButton,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Select,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import {
  fetchProductData,
  fetchCategoriesName,
  fetchSubCategoriesName,
  createProductData,
  updateProductData,
  deleteProductData,
} from "../../api";
import BootstrapLoader from "../BootstrapLoader";


const Product = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [categoriesName, setCategoriesName] = useState([]);
  const [subCategoriesName, setSubCategoriesName] = useState([]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [selectedValue, setSelectedValue] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createFormData, setCreateFormData] = useState({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteFormData, setDeleteFormData] = useState({});
  const [files, setFiles] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const token = localStorage.getItem("token");
  const [searchQuery, setSearchQuery] = useState("");
  // eslint-disable-next-line
  const [selectedRows, setSelectedRows] = useState([]);
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);


  const initialColumns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "category_name",
      headerName: "Category Name",
      width: 150,
      renderCell: ({ row }) =>
        row.category_id?.category_name ? (
          row.category_id?.category_name
        ) : (
          <span style={{ color: "green" }}>No Available</span>
        ),
    },
    {
      field: "sub_category_name",
      headerName: "Sub Category Name",
      width: 150,
      renderCell: ({ row }) =>
        row.sub_category_id?.sub_category_name ? (
          row.sub_category_id?.sub_category_name
        ) : (
          <span style={{ color: "green" }}>No Available</span>
        ),
    },
    { field: "frame_type", headerName: "Frame Type", width: 80 },
    {
      field: "image",
      headerName: "image",
      width: 150,
      renderCell: (params) =>
        params.row.image ? (
          params.row.image
        ) : (
          <span style={{ color: "green" }}>No Available</span>
        ),
    },
    {
      field: "file",
      headerName: "File",
      width: 150,
      renderCell: (params) => {
        const file = params.row.file ? params.row.file[0] : null;
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
      field: "edit",
      headerName: " ",
      width: 70,
      renderCell: (params) => (
        <AntButton
          type="text"
          danger
          onClick={() => handleEdit(params.row)}
          icon={<EditOutlined />}
          style={{
            color: "#25805b",
            background: "#def7ec",
            borderRadius: "13px",
          }}
        />
      ),
    },
    {
      field: "delete",
      headerName: " ",
      width: 70,
      renderCell: (params) => (
        <AntButton
          type="text"
          danger
          onClick={() => handleDelete(params.row)}
          icon={<DeleteOutlined />}
          style={{
            color: "#b34c4c",
            background: "#f6cccc",
            borderRadius: "13px",
          }}
        />
      ),
    },
  ];
  // eslint-disable-next-line
  const [columns, setColumns] = useState(initialColumns);

  useEffect(() => {
    fetchDataCategoryName();
    handleCategoryApi();
    // eslint-disable-next-line
  }, []);

  const fetchDataSubCategoryName = async (selectedValue) => {
    try {
      const data = await fetchSubCategoriesName(selectedValue);
      setSubCategoriesName(data);
      console.log(data, "Subname");
    } catch (error) {
      console.error("Error fetching sub-categories:", error);
    }
  };

  const fetchDataCategoryName = async () => {
    try {
      const data = await fetchCategoriesName(token);
      setCategoriesName(data);
      console.log(data, "name");
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCategoryApi = async (searchQuery = "") => {
    try {
      const data = await fetchProductData(searchQuery);
      setData(data);
      console.log(data, "data");
    } catch (err) {
      console.log(err);
    }
  };

  const handleSelectChange = (value) => {
    console.log("Selected value:", value);
    setSelectedValue(value);
    fetchDataSubCategoryName(value);
  };

  const handleDelete = (row) => {
    console.log("Select for Delete", row);
    setDeleteFormData({ ...row });
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

  const handleEdit = (row) => {
    console.log("Select for Edit", row);
    setEditFormData(row);
    setIsEditModalOpen(true);
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
    }
    finally {
      setIsLoading(false);
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
    }
    finally {
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
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleChange = (value) => {
    // Handle the change event here
    console.log(value);
  };

  const handleCreate = () => {
    setCreateFormData({});
    setIsCreateModalOpen(true);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    const fileNames = selectedFiles.map((file) => file.name);
    setFileNames(fileNames);
  };

  const handleCellClick = (params) => {
    const selectedRow = params.row;
    console.log("Selected Row:", selectedRow);
    setSelectedRows(selectedRow);
    // Perform any additional actions with the selected row
  };

  return (
    <div>
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

      <AntButton
        type="text"
        danger
        onClick={handleCreate}
        icon={<PlusOutlined />}
        style={{
          color: "#5250e6",
          backgroundColor: "#f0f0ff",
          border: "1px solid #ddddfe",
        }}
      >
        Create New Product
      </AntButton>

      <br />
      <br />

      <Input
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ width: 200 }}
        suffix={<SearchOutlined />}
      />

      <br />
      <br />

      <DataGrid
        // rows={data}

        // rows={data.filter((row) =>
        //   row.category_name.toLowerCase().includes(searchQuery.toLowerCase())
        // )}

        // rows={data.filter((row) =>
        //   Object.values(row).some(
        //     (value) =>
        //       value &&
        //       value
        //         .toString()
        //         .toLowerCase()
        //         .includes(searchQuery.toLowerCase())
        //   )
        // )}

        rows={data.filter((row) =>
          Object.keys(row).some(
            (key) =>
              row[key] &&
              row[key]
                .toString()
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
          )
        )}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[2, 3, 5, 10, 20, 30, 50, 100]}
        checkboxSelection
        onCellClick={handleCellClick}
        style={{
          boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.1)",
          marginTop: "5px",
        }}
      />

      <Button mt="xl" onClick={() => navigate("/homepage")}>
        Go Back HomePage
      </Button>
    </div>
  );
};

export default Product;
