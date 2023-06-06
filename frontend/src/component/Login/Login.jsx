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
import BootstrapLoader from "../BootstrapLoader";
import HomeApp from "../HomeApp";
import { loginUser, createUser } from "../../api";

const Login = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [confirmed, setConfirmed] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);

    const storedEmail = localStorage.getItem("rememberedEmail");
    const storedPassword = localStorage.getItem("rememberedPassword");

    if (storedEmail && storedPassword) {
      setEmail(storedEmail);
      setPassword(storedPassword);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (rememberMe) {
      localStorage.setItem("rememberedEmail", email);
      localStorage.setItem("rememberedPassword", password);
    } else {
      localStorage.removeItem("rememberedEmail");
      localStorage.removeItem("rememberedPassword");
    }
  }, [rememberMe, email, password]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      const data = {
        identifier: email,
        password: password,
      };
      console.log(data);
      const responseData = await loginUser(data);

      console.log("Login successful");
      console.log(JSON.stringify(responseData));
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("token", responseData.jwt);
      localStorage.setItem("currentUser", JSON.stringify(responseData.user));
      localStorage.setItem("currentPassword", data.password);
      localStorage.setItem("currentIdentifier", data.identifier);

      setIsLoggedIn(true);
    } catch (error) {
      console.log("Login failed");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("currentPassword");
    localStorage.removeItem("currentIdentifier");
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
    setIsLoading(true);
    const username = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const role = event.target.role.value;

    try {
      setConfirmed(true);
      const data = new FormData();
      data.append("username", username);
      data.append("email", email);
      data.append("password", password);
      data.append("role", role);
      data.append("confirmed", confirmed);

      for (const [key, value] of data.entries()) {
        console.log(`${key}: ${value}`);
      }

      const responseData = await createUser(data);
      console.log(JSON.stringify(responseData));
    } catch (error) {
      console.log(JSON.stringify(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setShowModal(false);
  };

  const handleForgotPasswordClick = () => {
    setShowModal(true);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleEmailSubmit = (event) => {
    event.preventDefault();
    console.log("Reset password for email:", email);
    handleModalClose();
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
              name="email"
              label="Email"
              placeholder="you@mantine.dev"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
            <PasswordInput
              name="password"
              label="Password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              mt="md"
            />
            <Group position="apart" mt="lg">
              <Checkbox
                label="Remember me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <Anchor
                component="button"
                size="sm"
                onClick={handleForgotPasswordClick}
              >
                Forgot password?
              </Anchor>
            </Group>
            <Button fullWidth mt="xl" disabled={isLoading} type="submit">
              Login
              {isLoading && <BootstrapLoader />}
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
          <TextInput
            name="username"
            label="Username"
            placeholder="Enter Your Username"
            required
          />
          <TextInput
            name="email"
            type="email"
            label="Email"
            placeholder="Enter Your Email e.g. : you@mantine.dev"
            required
          />
          <TextInput
            name="password"
            type="password"
            label="Password"
            placeholder="Enter Your Password Use Special Character"
            required
          />
          <TextInput
            name="role"
            type="role"
            label="role"
            placeholder="Enter 1"
            required
          />
          <TextInput
            name="confirmed"
            type="confirmed"
            label="confirmed"
            value={confirmed}
            disabled
          />
          <br />

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button type="button" onClick={handleModalClose} variant="outline">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              style={{ marginLeft: "8px" }}
            >
              Create Account
              {isLoading && <BootstrapLoader />}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        title="Forgot password"
        opened={showModal}
        onClose={handleModalClose}
        size="sm"
      >
        <form onSubmit={handleEmailSubmit}>
          <TextInput
            placeholder="e.g. you@mantine.dev"
            name="email"
            label="Email"
            value={email}
            onChange={handleEmailChange}
            required
          />
          <TextInput
            placeholder="Set New Password"
            name="password"
            label="New Password"
            // value={email}
            onChange={handleEmailChange}
            required
          />

          <br />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button type="button" onClick={handleModalClose} variant="outline">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              style={{ marginLeft: "8px" }}
            >
              Submit
              {isLoading && <BootstrapLoader />}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default Login;
