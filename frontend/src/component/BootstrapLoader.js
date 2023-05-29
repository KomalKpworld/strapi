import "bootstrap/dist/css/bootstrap.min.css";
const BootstrapLoader = () => {
  return (
    <>
      {" "}
      <div
        class="spinner-border spinner-border-sm "
        role="status"
        aria-hidden="true"
        style={{ marginLeft: "5px" }}
      ></div>
    </>
  );
};

export default BootstrapLoader;
