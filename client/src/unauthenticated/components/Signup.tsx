import { Clock, EyeOff, Info } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { guestLogin, signup } from "../../api/auth";
import { useAuth } from "../../hooks/use-auth";

type Inputs = { email: string; password: string; username: string };

export const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setSubmitError] = useState<string>("");
  const { setUser } = useAuth();

  async function onSubmit(values: Inputs) {
    setSubmitError("");

    console.log(values);
    try {
      const user = await signup(values.email, values.password, values.username);
      setUser(user);
      localStorage.setItem("chat_user", JSON.stringify(user));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      let errorMessage = "Signup Failed";
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = "Invalid email or password";
        } else if (error.response.status >= 500) {
          errorMessage = "Server error. Please try again later.";
        } else {
          errorMessage =
            error.response.data?.error ||
            `Signup failed: ${error.response.status}`;
        }
      } else if (error.request) {
        errorMessage = "Cannot reach server. Please check your connection.";
      } else {
        errorMessage = error.message || "An unexpected error occurred";
      }

      setSubmitError(errorMessage);
    }
  }

  async function loginAsGuest() {
    setSubmitError("");
    console.log("Logging in as guest");
    try {
      const guest = await guestLogin();
      setUser(guest);
      localStorage.setItem("chat_user", JSON.stringify(guest));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      let message = "Guest login failed";
      if (error.response) {
        message = error.response?.error || message;
      } else if (error.request) {
        message = "Network issue, please try again.";
      } else {
        message = error.message;
      }
      setSubmitError(message);
    }
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-teal-200">
        <div className="w-full max-w-4xl flex flex-col items-center gap-2.5 justify-center lg:flex-row">
          <div className="w-full max-w-sm rounded-2xl">
            <div className="text-2xl mb-2 font-bold">Join the Conversation</div>
            <div className="flex gap-3 mt-4">
              <EyeOff className="text-teal-700" />
              <div>
                <h3 className="font-bold">Stay Anonymous</h3>
                <p className="text-sm">
                  Chat freely without revealing your identity. Create an account
                  or join as a guest
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <Clock className="text-teal-700" />
              <div>
                <h3 className="font-bold">24-Hour Rooms</h3>
                <p className="text-sm">
                  All conversations are temporary - rooms reset daily with fresh
                  topics and clean slates
                </p>
              </div>
            </div>
          </div>
          {/* Login Form */}
          <div className="w-full max-w-sm rounded-2xl bg-white backdrop-blur-2xl p-8 shadow-xl">
            <div className="text-2xl font-bold text-center">
              Join Anonmyously!
            </div>
            <h3 className="text-center">
              Join others in daily topic discussions
            </h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-8">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  {...register("username", {
                    required: "Username is required",
                    pattern: {
                      value:
                        /^(?!.*[._]{2})(?![._])[a-zA-Z0-9._]{3,20}(?<![._])$/,
                      message:
                        "Username must be 3-20 characters and cannot start/end with dot/underscore or have them twice in a row",
                    },
                  })}
                  className="shadow-sm block w-full mt-2 rounded-md py-2 px-3 border-gray-300"
                />
                {errors.username && (
                  <p className="text-red-600 mt-1 text-xs">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="flex gap-2 text-sm font-medium text-gray-700"
                >
                  Email
                  <div className="relative group inline-block">
                    <Info height={18} width={18} className="cursor-pointer" />
                    <div className="absolute left-6 top-0 z-10 hidden w-64 text-xs text-white bg-gray-800 p-2 rounded-md shadow-md group-hover:block">
                      This email will be used only for password resets. Remember
                      your username!
                    </div>
                  </div>
                </label>
                <input
                  type="email"
                  id="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className="shadow-sm block w-full mt-2 rounded-md py-2 px-3 border-gray-300"
                />
                {errors.email && (
                  <p className="text-red-600 mt-1 text-xs">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                onClick={handleSubmit(onSubmit)}
                className="w-full bg-teal-600 font-bold cursor-pointer text-white rounded-md py-2 px-3"
              >
                {isSubmitting ? "Submitting..." : "Signup"}
              </button>
            </form>

            <button
              type="submit"
              disabled={isSubmitting}
              onClick={loginAsGuest}
              className="w-full bg-yellow-600 font-bold cursor-pointer mt-2 text-white rounded-md py-2 px-3"
            >
              Continue as Guest
            </button>

            <p className="mt-4 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-teal-600 hover:underline hover:text-teal-800"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
