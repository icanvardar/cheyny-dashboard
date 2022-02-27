const Container = ({ children }) => {
  return (
    <div className="container flex flex-col mx-auto items-center">
      <div className="w-2/3">{children}</div>
    </div>
  );
};

export default Container;
