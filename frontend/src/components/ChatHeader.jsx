import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { getInitials } from "../lib/utils";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar">
            {selectedUser.profilePic ? (
              <div className="size-10 rounded-full relative overflow-hidden">
                <img src={selectedUser.profilePic} alt={selectedUser.fullName} className="object-cover w-full h-full" />
              </div>
            ) : (
              <div className="size-10 rounded-full relative grid place-items-center bg-base-300 text-base-content font-semibold select-none">
                <span className="text-sm leading-none">{getInitials(selectedUser.fullName)}</span>
              </div>
            )}
          </div>
          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;