
import { useAuthStore } from '../store/useAuthStore';
import { Link } from 'react-router-dom';
import { LogOut, MessageCircleCode, Settings, User, Users } from 'lucide-react';

const Navbar = () => {
  const { logout, authUser, onlineUsers, socket } = useAuthStore();

  const isConnected = !!socket?.connected;
  const initials = authUser?.fullName?.[0]?.toUpperCase?.() || 'U';
  return (
    <header className='bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80'>
      <div className='container mx-auto px-4 h-16'>
        <div className='flex items-center justify-between h-full'>
          <div className='flex items-center gap-8'>
            <Link to='/' className='flex items-center gap-2.5 hover:opacity-80 transition-all'>
            <div className='size-9 rounded-lg bg-primary/10 flex items-center justify-center'>
            <MessageCircleCode className='h-5 w-5 text-primary'/>
            </div>
            <h1 className='text-lg font-bold'>Ch4t</h1>
            </Link>
          </div>
          <div className='flex items-center gap-2'>
            {/* Online users + connection indicator */}
            {authUser && (
              <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-base-200 text-sm text-base-content/70">
                <Users size={16} />
                <span>{onlineUsers?.length || 0} online</span>
                <span className={`ml-1 inline-block size-2 rounded-full ${isConnected ? 'bg-success' : 'bg-error'}`} aria-label={isConnected ? 'Connected' : 'Disconnected'} />
              </div>
            )}

            {/* Settings shortcut */}
            <Link to={"/settings"} className={`btn btn-sm gap-2 transition-colors`}>
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Themes</span>
            </Link>

            {authUser && (
              <>
                {/* Avatar to profile */}
                <Link to={"/profile"} className="btn btn-ghost btn-circle avatar">
                  <div className="w-8 rounded-full">
                    {authUser?.profilePic ? (
                      <img src={authUser.profilePic} alt={authUser.fullName || 'Profile'} />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-medium">
                        {initials}
                      </div>
                    )}
                  </div>
                </Link>

                {/* Logout */}
                <button className="btn btn-sm" onClick={logout} title="Logout">
                  <LogOut className="size-5" />
                  <span className="inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar