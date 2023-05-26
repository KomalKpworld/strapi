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
  Segmented,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  fetchSubCategoryData,
  fetchCategoriesName,
  createSubCategoryData,
  updateSubCategoryData,
  deleteSubCategoryData,
} from "../../api";

const SubCategory = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createFormData, setCreateFormData] = useState({});
  const [categoriesName, setCategoriesName] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [selectedValue, setSelectedValue] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteFormData, setDeleteFormData] = useState({});
  const [files, setFiles] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const token = localStorage.getItem("token");
  const [isNew, setIsNew] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const initialColumns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "sub_category_name",
      headerName: "Sub Category Name",
      width: 100,
      renderCell: (params) =>
        params.row.sub_category_name ? (
          params.row.sub_category_name
        ) : (
          <span style={{ color: "green" }}>Empty</span>
        ),
    },
    {
      field: "category_name",
      name: "Category Name",
      width: 100,
      renderCell: ({ row }) =>
        row.category_id?.category_name ? (
          row.category_id?.category_name
        ) : (
          <span style={{ color: "green" }}>Empty</span>
        ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      renderCell: (params) =>
        params.row.status ? (
          params.row.status
        ) : (
          <span style={{ color: "green" }}>Empty</span>
        ),
    },
    {
      field: "move",
      headerName: "Move",
      width: 100,
      renderCell: (params) =>
        params.row.move ? (
          params.row.move
        ) : (
          <span style={{ color: "green" }}>Empty</span>
        ),
    },
    {
      field: "is_new",
      headerName: "Is New",
      width: 100,
      renderCell: (params) =>
        params.row.is_new ? (
          params.row.is_new.toString()
        ) : (
          <span style={{ color: "green" }}>Empty</span>
        ),
    },
    {
      field: "display_date",
      headerName: "Display Date",
      width: 100,
      renderCell: (params) =>
        params.row.display_date ? (
          params.row.display_date
        ) : (
          <span style={{ color: "green" }}>Empty</span>
        ),
    },
    {
      field: "slider",
      headerName: "Slider",
      width: 100,
      renderCell: (params) =>
        params.row.slider ? (
          params.row.slider
        ) : (
          <span style={{ color: "green" }}>Empty</span>
        ),
    },
    {
      field: "url",
      headerName: "URL",
      width: 100,
      renderCell: (params) =>
        params.row.url ? (
          params.row.url
        ) : (
          <span style={{ color: "green" }}>Empty</span>
        ),
    },
    {
      field: "sub_category_image",
      headerName: "Sub Category Image",
      width: 250,
      renderCell: (params) =>
        params.row.sub_category_image ? (
          params.row.sub_category_image
        ) : (
          <span style={{ color: "green" }}>Empty</span>
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
          return <span style={{ color: "green" }}>Empty</span>;
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

  const handleCategoryApi = async (searchQuery = "") => {
    try {
      const data = await fetchSubCategoryData(searchQuery);
      setData(data);
      console.log(data, "data");
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = (row) => {
    console.log("Select for Delete", row);
    setDeleteFormData({ ...row });
    setIsDeleteModalOpen(true);
  };

  const handleEdit = (row) => {
    console.log("Select for Edit", row);
    setEditFormData(row);
    setIsEditModalOpen(true);
  };

  const handleCreate = () => {
    setCreateFormData({});
    setIsCreateModalOpen(true);
  };

  const handleCreateForm = async (values) => {
    try {
      console.log("Form values After Create:", values);

      if (isCreateModalOpen) {
        if (currentUser && currentUser.id) {
          const formData = new FormData();
          formData.append("category_id", values.category_id);
          formData.append("sub_category_name", values.sub_category_name);
          formData.append("display_date", values.display_date);
          formData.append("status", values.status);
          formData.append("move", values.move);
          formData.append("url", values.url);
          formData.append("is_new", values.is_new);
          formData.append("slider", values.slider);
          for (let i = 0; i < files.length; i++) {
            formData.append("file", files[i]);
          }

          const success = await createSubCategoryData(formData, token);

          if (success) {
            console.log("Creating Successfull");
            setIsCreateModalOpen(false);
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
  };

  const handleEditForm = async (values) => {
    try {
      console.log("Form values After Edit:", values);
      if (
        currentUser &&
        currentUser.id &&
        values.addedBy &&
        values.addedBy.id === currentUser.id
      ) {
        if (isEditModalOpen) {
          const formData = new FormData();

          formData.append("category_id", values.category_id);
          formData.append("sub_category_name", values.sub_category_name);
          formData.append("display_date", values.display_date);
          formData.append("status", values.status);
          formData.append("move", values.move);
          formData.append("url", values.url);
          formData.append("is_new", values.is_new);
          formData.append("slider", values.slider);
          for (let i = 0; i < files.length; i++) {
            formData.append("file", files[i]);
          }

          const success = await updateSubCategoryData(
            values.id,
            formData,
            token
          );

          if (success) {
            console.log("Updating Successfull");
            setIsEditModalOpen(false);
            setData((prevData) =>
              prevData.map((row) =>
                row.id === values.id ? { ...row, ...values } : row
              )
            );
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
  };

  const handleModalCancel = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
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

  const handleSelectChange = (value) => {
    console.log("Selected value:", value);
    setSelectedValue(value);
  };

  const handleDeleteForm = async (values) => {
    try {
      console.log("Form values:", values);
      if (currentUser && currentUser.id) {
        if (values.addedBy && values.addedBy.id === currentUser.id) {
          const success = await deleteSubCategoryData(values.id, token);

          if (success) {
            console.log("Deleting Successfull");
            setIsDeleteModalOpen(false);
            setData((prevData) =>
              prevData.filter((row) => row.id !== values.id)
            );
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
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    const fileNames = selectedFiles.map((file) => file.name);
    setFileNames(fileNames);
  };
  const handleIsNewChange = (value) => {
    console.log(value, "IsNew");
    setIsNew(value);
  };

  return (
    <div>
      {/* CreateModal */}
      <Modal
        open={isCreateModalOpen}
        title="Create Modal"
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form
          onFinish={handleCreateForm}
          initialValues={createFormData}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Sub Category Name"
                name="sub_category_name"
                rules={[
                  {
                    required: true,
                    message: "Please enter a sub category name",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Category Id"
                name="category_id"
                rules={[
                  {
                    required: true,
                    message: "Please enter a category id",
                  },
                ]}
              >
                <Select onChange={handleSelectChange} value={selectedValue}>
                  {categoriesName.length === 0 ? (
                    <Select.Option value={null}>
                      No available category name
                    </Select.Option>
                  ) : (
                    categoriesName.map((category) => (
                      <Select.Option key={category.id} value={category.id}>
                        {category.category_name || (
                          <span style={{ color: "green" }}>
                            Name is not available
                          </span>
                        )}
                        ({category.id})
                      </Select.Option>
                    ))
                  )}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Display Date"
                name="display_date"
                rules={[
                  { required: true, message: "Please enter a display_date" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Status"
                name="status"
                rules={[{ required: true, message: "Please enter a Status" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Move"
                name="move"
                rules={[{ required: true, message: "Please enter a Move" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="URL"
                name="url"
                rules={[{ required: true, message: "Please enter a URL" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="is_new"
                name="is_new"
                rules={[{ required: true, message: "Please enter a is_new" }]}
              >
                <Segmented
                  options={[
                    {
                      value: "true",
                      label: "True",
                    },
                    {
                      value: "false",
                      label: "False",
                    },
                  ]}
                  value={isNew ? "true" : "false"}
                  onChange={handleIsNewChange}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="slider"
                name="slider"
                rules={[{ required: true, message: "Please enter a slider" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
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
            </Col>
            <Col span={12}>
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

          <Form.Item>
            <Button type="primary" htmltype="submit">
              Create
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={handleModalCancel}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* EditModal */}
      <Modal
        title="Update Modal"
        onOk={handleEditForm}
        open={isEditModalOpen}
        onCancel={handleModalCancel}
        centered
        footer={null}
      >
        <Form
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
              <Form.Item label="addedBy" name="addedBy" hidden>
                <Input value={editFormData?.addedBy?.id || ""} disabled />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Sub Category Name" name="sub_category_name">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Category Id" name="category_id">
                <Select onChange={handleSelectChange} value={selectedValue}>
                  {categoriesName.length === 0 ? (
                    <Select.Option value={null}>
                      No available category name
                    </Select.Option>
                  ) : (
                    categoriesName.map((category) => (
                      <Select.Option key={category.id} value={category.id}>
                        {category.category_name || (
                          <span style={{ color: "green" }}>
                            Name is not available
                          </span>
                        )}
                        ({category.id})
                      </Select.Option>
                    ))
                  )}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Display Date" name="display_date">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Status" name="status">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Move" name="move">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="URL" name="url">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="is_new" name="is_new">
                <Segmented
                  options={[
                    {
                      value: "true",
                      label: "True",
                    },
                    {
                      value: "false",
                      label: "False",
                    },
                  ]}
                  value={isNew ? "true" : "false"}
                  onChange={handleIsNewChange}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="slider" name="slider">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="File"
                name="files"
                rules={[
                  { required: true, message: "Please upload a category image" },
                ]}
              >
                <input type="file" multiple onChange={handleFileChange} />
              </Form.Item>
            </Col>
            <Col span={12}>
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

          <Form.Item>
            <Button type="primary" htmltype="submit">
              Update
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={handleModalCancel}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* DeleteModal */}
      <Modal
        title="Delete Modal"
        onOk={handleDeleteForm}
        open={isDeleteModalOpen}
        onCancel={handleModalCancel}
        centered
        footer={null}
      >
        <Form
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
              <Form.Item label="addedBy" name="addedBy" hidden>
                <Input value={deleteFormData?.addedBy?.id || ""} disabled />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmltype="submit">
              Delete
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={handleModalCancel}>
              Cancel
            </Button>
          </Form.Item>
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
        Create New SubCategory
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

export default SubCategory;
