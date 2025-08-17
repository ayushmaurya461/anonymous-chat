import { LogOut, User, UserCircle } from "lucide-react";
import { useAuth } from "../../../../hooks/use-auth";
import { useState } from "react";

export const UserFooter = () => {
  const { user } = useAuth();

  const [showOptions, setShowOptions] = useState(false);

  const logout = () => {
    setShowOptions(false);
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div
      className="p-6 pt-4 border-t border-teal-600 border-opacity-40 relative"
      onClick={() => setShowOptions(!showOptions)}
    >
      <div className="flex items-center space-x-3 p-3 rounded-xl bg-teal-600 bg-opacity-30 backdrop-blur-sm hover:bg-opacity-40 transition cursor-pointer group border border-teal-500 border-opacity-30">
        <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 border border-teal-300">
          <User className="w-6 h-6 text-teal-900" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-teal-100 font-semibold text-sm truncate">
            {user?.name}
          </p>
          <p className="text-teal-200 text-xs">Online</p>
        </div>
        <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse flex-shrink-0" />
      </div>

      {showOptions && (
        <div className="p-2 absolute w-[100%] bottom-25 d-flex justify-center flex-col left-0 ">
          <ul className="list-none py-2  bg-white rounded-xl overflow-hidden">
            <li className="py-2 flex gap-4 cursor-pointer hover:bg-gray-200 px-6">
              <UserCircle />
              Profile
            </li>
            <li
              className="py-2 flex gap-4 cursor-pointer hover:bg-gray-200 px-6"
              onClick={logout}
            >
              <LogOut />
              Logout
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
