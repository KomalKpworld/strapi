import React, { useState, useEffect } from "react";
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
  Modal,
} from "@mantine/core";
import { BrowserRouter } from "react-router-dom";
import HomeApp from "../HomeApp";

const Login = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const username = event.target.username.value;
    const password = event.target.password.value;

    const data = {
      identifier: username,
      password: password,
    };

    try {
      const response = await fetch("http://localhost:1337/api/auth/local", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful");
        console.log(JSON.stringify(data));
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("token", data.jwt);
        localStorage.setItem("currentUser", JSON.stringify(data.user));

        setIsLoggedIn(true);
      } else {
        const errorData = await response.json();
        console.log("Login failed");
        console.log(JSON.stringify(errorData));
      }
    } catch (error) {
      console.log("An error occurred during login");
      console.log(error);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    localStorage.clear();
  };

  if (isLoggedIn) {
    return (
      <BrowserRouter>
        <HomeApp onLogout={handleLogout} />
      </BrowserRouter>
    );
  }

  const handleModalSubmit = async (event) => {
    event.preventDefault();

    const username = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const role = event.target.role.value;

    const data = new FormData();
    data.append("username", username);
    data.append("email", email);
    data.append("password", password);
    data.append("role", role);

    // Log the form data
    for (const [key, value] of data.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      const response = await fetch("http://localhost:1337/api/users", {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log(JSON.stringify(responseData));
        // Handle success
      } else {
        const errorData = await response.json();
        console.log(JSON.stringify(errorData));
        // Handle error
      }
    } catch (error) {
      console.log(error);
      // Handle error
    }
  };

  const handleCreateAccount = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Container size={420} my={40}>
        <Title
          align="center"
          sx={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 900,
          })}
        >
          Welcome back!
        </Title>
        <Text color="dimmed" size="sm" align="center" mt={5}>
          Do not have an account yet?{" "}
          <Anchor size="sm" component="button" onClick={handleCreateAccount}>
            Create account
          </Anchor>
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <form onSubmit={handleSubmit}>
            <TextInput
              name="username"
              label="Email"
              placeholder="you@mantine.dev"
              required
            />
            <PasswordInput
              name="password"
              label="Password"
              placeholder="Your password"
              required
              mt="md"
            />
            <Group position="apart" mt="lg">
              <Checkbox label="Remember me" />
              <Anchor component="button" size="sm">
                Forgot password?
              </Anchor>
            </Group>
            <Button fullWidth mt="xl" type="submit">
              Login
            </Button>
          </form>
        </Paper>
      </Container>

      <Modal
        opened={isModalOpen}
        onClose={handleModalClose}
        title="Create an Account"
        size="sm"
      >
        <form onSubmit={handleModalSubmit}>
          <TextInput name="username" label="Username" required />
          <TextInput name="email" type="email" label="Email" required />
          <TextInput
            name="password"
            type="password"
            label="Password"
            required
          />
          <TextInput name="role" type="role" label="role" required />
          <br />

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button type="button" onClick={handleModalClose} variant="outline">
              Cancel
            </Button>
            <Button type="submit" style={{ marginLeft: "8px" }}>
              Create Account
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default Login;
