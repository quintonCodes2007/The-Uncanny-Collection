export const scrollToHome = (navigate, pathname) => {
  if (pathname === "/") {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  } else {
    navigate("/");
  }
};