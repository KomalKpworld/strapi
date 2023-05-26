import React from "react";
import { Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Button mt="xl" onClick={() => navigate("/category")}>
        Go Category Page
      </Button>
      <br />
      <Button mt="xl" onClick={() => navigate("/subCategory")}>
        Go SubCategory Page
      </Button>
      <br />
      <Button mt="xl" onClick={() => navigate("/product")}>
        Go Product Page
      </Button>
      <br />
    </div>
  );
};

export default HomePage;
