import "../../styles/NavBar/profile.css";

const UserProfile = () => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  if (!userData?.email) return null;

  return (
    <div className="user-profile">
      <div className="user-circle">
        {userData.email[0].toUpperCase()}
      </div>
      <div className="user-dropdown">
        <div className="user-info">
          <strong>Signed in as</strong><br />
          <span className="user-email">{userData.email}</span>
        </div>
        <div className="dropdown-option logout-option">Sign out</div>
      </div>
    </div>
  );
};

export default UserProfile;