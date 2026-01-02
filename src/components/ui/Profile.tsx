import { ArrowUpRight, Crown, Phone,User } from 'lucide-react';
import { MdClose } from 'react-icons/md';
import { Link } from 'react-router-dom';

export default function ProfilePopup({ openProfile, setOpenProfile, user }: { openProfile: boolean, setOpenProfile: (openProfile: boolean) => void, user: any }) {

  return (
    <>
      <div className={`absolute right-4 top-16 w-72 rounded-lg shadow-lg border border-gray-200 bg-white p-4 z-50 ${openProfile ? 'block' : 'hidden'}`}>
        <div className="flex items-center gap-4 mb-4">
          {user?.userImageUrl ? <img src={user?.userImageUrl} loading='lazy' alt="profile" className="w-12 h-12 rounded-full" /> : <p
            className="px-3 py-1 font-bold text-2xl text-[#008888] rounded-full cursor-pointer border-2 border-[#03257e]"
          >{user?.name?.slice(0, 1)}</p>}
          <div>
            <p className="text-[#f14419] font-semibold text-sm">{user?.email?.slice(0, 6) as string}...{user?.email?.slice(-10) as string}</p>
            {/* {walletInfoData?.public_address ? <p className="font-bold text-[#f14419]">{walletInfoData.public_address.slice(0, 6)}...{walletInfoData.public_address.slice(-4)}</p> : <p className="text-sm text-gray-500">No Wallet Connected</p>} */}
          </div>
          <MdClose
            className='absolute right-0 mr-2 mb-8 size-6 cursor-pointer'
            onClick={() => setOpenProfile(false)}
          />
        </div>

        {user && <div className='relative border-t pt-3 flex flex-col gap-3'>
          {/* <div className='absolute group right-0 cursor-pointer'><Edit onClick={() => setOpenProfileEdit(true)} />
            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block 
                       bg-gray-800 text-white text-sm rounded-md px-2 py-1 whitespace-nowrap">
              Edit Profile
            </span>
          </div> */}
          <p className='flex gap-1'><User /> <span className='font-bold text-[#03257e]'>{user?.name}</span></p>
          <p className='flex gap-1'><Phone /> <span className='font-bold text-[#03257e]'>{user?.phoneNumber}</span></p>
        </div>}
        <div className="flex items-center gap-2 mt-3">
          {user?.subscriptionPlan === "pro" ? (
            <div>
              <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full">
                <Crown size={16} className="text-yellow-500" />
                <p className="text-sm font-medium">Pro Member</p>
              </div>
              <p className="text-xs text-gray-500 mt-2">Expires on: <span className="font-medium text-green-700">{user?.subscriptionExpiry ? new Date(user.subscriptionExpiry).toLocaleDateString() : 'Unknown'}</span></p>
            </div>
          ) : (
            <Link
              to="/pricing"
              className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition"
            >
              <ArrowUpRight size={16} />
              <span className="text-sm font-medium">Upgrade to Pro</span>
            </Link>
          )}
        </div>

        {/* {walletInfoData ? <div className="border-t pt-3 flex flex-col gap-3">
          <p className='flex gap-1'><Wallet /> <span className='font-bold text-[#03257e]'>{walletInfoData?.algoBalance} Algo</span></p>
          <div className='flex justify-start items-center gap-2 cursor-pointer hover:text-[#f14419]'>
            <FaCopy onClick={copyAddressToClipboard} /><p>{text}</p>
          </div>
          <div className='flex justify-start items-center gap-2 cursor-pointer hover:text-[#f14419]'>
            <MdLogout /><p>Disconnect wallet</p>
          </div>
        </div> : <div className="border-t pt-3 flex flex-col gap-3">
          <p className='text-sm text-gray-500'>Connect your wallet to see more details.</p>
        </div>} */}
      </div>
      {/* {openProfileEdit &&
      <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-30">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-80 flex flex-col items-center gap-4">
        <h2 className="text-lg font-semibold text-gray-800">Edit Profile</h2>
        <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300 flex items-center justify-center bg-gray-50 relative">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Profile"
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : 
            (loading?<span className="text-gray-400 text-sm text-center px-2">Uploading...</span>:<span className="text-gray-400 text-sm text-center px-2">No Image</span>)
          }

          <input
            id="profileImage"
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={uploadImageToDB}
          />
        </div>
            <input
              type="text"
              placeholder="Name"
              value={user?.name}
              onChange={(e) => setUserProfileData({ ...userProfileData, name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#03257e]"
            />

            <input
              type="text"
              placeholder="Phone Number"
              value={user?.phoneNumber}
              onChange={(e) => setUserProfileData({ ...userProfileData, phoneNumber: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#03257e]"
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={(e)=>profileEditHandler(e)}
                className="bg-[#03257e] text-white px-4 py-2 rounded-lg hover:bg-[#021c63] transition"
              >
                Save
              </button>
              <button
                onClick={()=>setOpenProfileEdit(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      } */}
    </>
  );
}
