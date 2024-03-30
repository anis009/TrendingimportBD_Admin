import { FaArrowAltCircleLeft } from 'react-icons/fa';
import { useAppSelector } from '../../redux/hook';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user } = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  console.log('profile-user~~', user);
  return (
    <div className="bg-gray-200 p-10 rounded-lg shadow">
      <FaArrowAltCircleLeft
        onClick={() => navigate(-1)}
        className="w-6 h-4 mb-5 cursor-pointer"
      />
      <div className="text-lg font-bold mb-2">{user?.user.userName}</div>
      <div className="text-gray-600 mb-2">{user?.user.email}</div>
      <div className="text-gray-400">{user?.user._id}</div>
    </div>
  );
};

export default Profile;
