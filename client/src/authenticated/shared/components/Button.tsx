import clsx from "clsx";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  variant?: "default" | "black" | "themed"; 
};

export const Button = ({
  children,
  variant = "default",
  className,
  ...props
}: ButtonProps) => {
  const baseStyles =
    "flex items-center justify-center gap-3 rounded-xl transition-all duration-300 cursor-pointer font-semibold";

  const variants: Record<typeof variant, string> = {
    default:
      "px-6 py-3 bg-white bg-opacity-30 hover:bg-opacity-40 font-medium backdrop-blur-sm border border-gray-300 hover:-translate-y-1  border-opacity-30",
    black:
      "px-8 py-4 bg-white bg-opacity-25 hover:bg-opacity-35 backdrop-blur-md border border-white border-opacity-40 shadow-lg hover:shadow-xl transform hover:-translate-y-1",
    themed: "px-8 py-4 bg-white text-teal-600 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:bg-opacity-95",
  };

  return (
    <button
      {...props}
      className={clsx(baseStyles, variants[variant], className)}
    >
      {children}
    </button>
  );
};
