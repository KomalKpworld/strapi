import React from "react";

const Welcome = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  return (
    <>
      <div>
        <h5>
          Welcome <b>{currentUser.username}</b> <u>{currentUser.role.name}</u>
        </h5>
      </div>
    </>
  );
};

export default Welcome;
