import React, { useState, useEffect } from "react";
import { Button, TextField, Grid } from "@mui/material";
// import { Form, Input, Row, Col } from "antd";

const Profile = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const currentIdentifier = localStorage.getItem("currentIdentifier");
    const currentPassword = localStorage.getItem("currentPassword");

    setUserData({
      currentUser,
      currentIdentifier,
      currentPassword,
    });
  }, []);

  console.log(userData, "userData");

  const handleProfile = () => {
    console.log("handleProfile");
  };
  if (!userData) {
    return <div>Loading...</div>; // or any loading state component
  }
  return (
    <>
      <h5>Your Info</h5>
      {/* <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Form
          onFinish={handleProfile}
          initialValues={userData}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="ID" name={["currentUser", "id"]}>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Username" name={["currentUser", "username"]}>
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Email" name={["currentUser", "email"]}>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Provider" name={["currentUser", "provider"]}>
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="currentIdentifier" name="currentIdentifier">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Set New Password" name="currentPassword">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form>
      </div>
      <div>
        <Button variant="contained">Change Password</Button>
      </div> */}
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={6}>
          <form onSubmit={handleProfile}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="ID"
                  fullWidth
                  disabled
                  value={userData.currentUser.id}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Username"
                  fullWidth
                  disabled
                  value={userData.currentUser.username}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  fullWidth
                  disabled
                  value={userData.currentUser.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Provider"
                  fullWidth
                  disabled
                  value={userData.currentUser.provider}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Current Identifier"
                  fullWidth
                  disabled
                  value={userData.currentIdentifier}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Set New Password"
                  fullWidth
                  name="currentPassword"
                  value={userData.currentPassword}
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </>
  );
};

export default Profile;
