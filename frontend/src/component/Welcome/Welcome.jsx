import React from "react";

const Welcome = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  return (
    <>
      <div>
        <h5>Welcome</h5>
        <h5>UserName : {currentUser.username}</h5>
      </div>
    </>
  );
};

export default Welcome;
