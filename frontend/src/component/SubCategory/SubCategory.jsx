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
  Segmented,
  Table,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import BootstrapLoader from "../BootstrapLoader";
import {
  fetchSubCategoryData,
  fetchCategoriesName,
  createSubCategoryData,
  updateSubCategoryData,
  deleteSubCategoryData,
} from "../../api";

const SubCategory = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const token = localStorage.getItem("token");
  const [form] = Form.useForm();

  const [data, setData] = useState([]);
  const [categoriesName, setCategoriesName] = useState([]);

  const [createFormData, setCreateFormData] = useState({});
  const [editFormData, setEditFormData] = useState({});
  const [deleteFormData, setDeleteFormData] = useState({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [files, setFiles] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [isNew, setIsNew] = useState(true);
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
      width: 50,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Sub Category Name",
      dataIndex: "sub_category_name",
      width: 70,
      sorter: (a, b) =>
        (a.sub_category_name || "").localeCompare(b.sub_category_name || ""),
      render: (text, record) =>
        record.sub_category_name ? (
          record.sub_category_name
        ) : (
          <span style={{ color: "green" }}>Empty</span>
        ),
    },
    {
      title: "Category Name",
      dataIndex: "category_name",
      width: 70,
      sorter: (a, b) =>
        (a.category_id?.category_name || "").localeCompare(
          b.category_id?.category_name || ""
        ),
      render: (text, record) =>
        record.category_id?.category_name ? (
          record.category_id.category_name
        ) : (
          <span style={{ color: "green" }}>Empty</span>
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 50,
      sorter: (a, b) => (a.status || "").localeCompare(b.status || ""),
      render: (text, record) =>
        record.status ? (
          record.status
        ) : (
          <span style={{ color: "green" }}>Empty</span>
        ),
    },
    {
      title: "Move",
      dataIndex: "move",
      width: 50,
      sorter: (a, b) => (a.move || "").localeCompare(b.move || ""),
      render: (text, record) =>
        record.move ? (
          record.move
        ) : (
          <span style={{ color: "green" }}>Empty</span>
        ),
    },
    {
      title: "Is New",
      dataIndex: "is_new",
      width: 50,
      sorter: (a, b) => {
        const aValue = a.is_new ? a.is_new.toString() : "";
        const bValue = b.is_new ? b.is_new.toString() : "";
        return aValue.localeCompare(bValue);
      },
      render: (text, record) =>
        record.is_new ? (
          record.is_new.toString()
        ) : (
          <span style={{ color: "green" }}>Empty</span>
        ),
    },
    {
      title: "Display Date",
      dataIndex: "display_date",
      width: 50,
      sorter: (a, b) =>
        (a.display_date || "").localeCompare(b.display_date || ""),
      render: (text, record) =>
        record.display_date ? (
          record.display_date
        ) : (
          <span style={{ color: "green" }}>Empty</span>
        ),
    },
    {
      title: "Slider",
      dataIndex: "slider",
      width: 50,
      sorter: (a, b) => (a.slider || "").localeCompare(b.slider || ""),
      render: (text, record) =>
        record.slider ? (
          record.slider
        ) : (
          <span style={{ color: "green" }}>Empty</span>
        ),
    },
    {
      title: "URL",
      dataIndex: "url",
      width: 50,
      sorter: (a, b) => (a.url || "").localeCompare(b.url || ""),
      render: (text, record) =>
        record.url ? record.url : <span style={{ color: "green" }}>Empty</span>,
    },
    {
      title: "Sub Category Image",
      dataIndex: "sub_category_image",
      width: 100,
      sorter: (a, b) =>
        (a.sub_category_image || "").localeCompare(b.sub_category_image || ""),
      render: (text, record) =>
        record.sub_category_image ? (
          record.sub_category_image
        ) : (
          <span style={{ color: "green" }}>Empty</span>
        ),
    },
    {
      title: "File",
      dataIndex: "file",
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
          return <span style={{ color: "green" }}>Empty</span>;
        }
      },
    },
    {
      title: "Edit",
      dataIndex: "edit",
      width: 50,
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
      dataIndex: "delete",
      width: 50,
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
      const data = await fetchSubCategoryData(searchQuery);
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

  const handleCreateForm = async (values, event) => {
    event.preventDefault();
    setIsLoading(true);
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
          const success = await deleteSubCategoryData(values.id, token);

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
        const success = await deleteSubCategoryData(id, token);
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
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
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
  };

  const handleIsNewChange = (value) => {
    console.log(value, "IsNew");
    setIsNew(value);
  };

  const filterData = (data, searchQuery) => {
    return data.filter((row) =>
      Object.keys(row).some((key) =>
        key === "category_id"
          ? row[key] &&
            row[key]["category_name"] &&
            row[key]["category_name"]
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
        open={isCreateModalOpen}
        title="Create Modal"
        onCancel={handleModalCancel}
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
          Create New SubCategory
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
            <b>Sub-Category Data Table</b>
          </h5>
        )}
      />
    </main>
  );
};

export default SubCategory;
