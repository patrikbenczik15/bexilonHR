import axios from "axios";

function isLoggedIn() {
  return !!localStorage.getItem("token");
}

const Demo = () => {
  {
    if (isLoggedIn() === true)
      return (
        <div>
          <h1>Prea Baiat</h1>
        </div>
      );
    else
      return (
        <div>
          <h1>Nu esti logat</h1>
        </div>
      );
  }
};
export default Demo;
