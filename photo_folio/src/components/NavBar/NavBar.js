import gallary from "./images/gallary.jpg";
import NavBarCss from "./NavBar.module.css";

const NavBar = () => {
  return (
    <div className={NavBarCss.header}>
        <img src={gallary} alt="navbar" />
        <span>PhotoFolio </span>
    </div>
  );
};

export default NavBar;
