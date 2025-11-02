import React from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { Camera, Mail, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import avatar from '../assets/avatar.png';

const ProfilePage = () => {
  const {updateProfile, isUpdatingProfile, authUser} = useAuthStore();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = React.useState(null);
  const handleImageUpload = async(e)=>{
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async() => {
      const base64Image = reader.result;
      setSelectedImage(base64Image);
      await updateProfile({profilePic: base64Image});
    };
  }
  const handleDone = () => {
    if (window.history.length > 2) navigate(-1);
    else navigate('/');
  };

  return (
    <div className='min-h-screen container mx-auto px-4 pt-24 pb-10'>
      {/* Page header */}
      <div className='flex items-center justify-between max-w-2xl mx-auto mb-4'>
        <h1 className='text-xl font-semibold'>Profile</h1>
        <button onClick={handleDone} className='btn btn-sm btn-primary'>Done</button>
      </div>

      <div className='max-w-2xl mx-auto p-4 py-8'>
        <div className='bg-base-300 rounded-xl p-6 space-y-8'>
          <div className='text-center'>
            <p className='mt-1 text-base-content/70'>Your profile information</p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={ selectedImage || authUser.profilePic || avatar}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 bg-green-500 border-base-200"
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>
          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.fullName}</p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
            </div>
          </div>
          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div> 

      </div>

    </div>
  )
}

export default ProfilePage