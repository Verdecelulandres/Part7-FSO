const User = ({ name, handleLogout }) => {
  return (
    <p>
      <span>
        {name} logged in
      </span>
      <button onClick={handleLogout}>logout</button>
    </p>
  );
}

export default User;