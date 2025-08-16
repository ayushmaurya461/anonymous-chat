export const BackgroundDecor = () => (
  <div className="absolute inset-0 opacity-10">
    <div className="absolute top-20 right-10 w-40 h-40 bg-teal-300 rounded-full blur-2xl animate-pulse"></div>
    <div
      className="absolute bottom-32 left-10 w-32 h-32 bg-green-300 rounded-full blur-xl animate-pulse"
      style={{ animationDelay: "1s" }}
    ></div>
    <div
      className="absolute top-1/2 left-1/3 w-24 h-24 bg-teal-400 rounded-full blur-lg animate-pulse"
      style={{ animationDelay: "2s" }}
    ></div>
  </div>
);
