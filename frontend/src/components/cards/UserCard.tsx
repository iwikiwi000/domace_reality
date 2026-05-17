type UserType = {
  _id: string;
  name: string;
  email: string;
  //role: string;
};

export default function UserCard({
  user,
  onDelete,
}: {
  user: UserType;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="user-card">
      <div>
        <strong>{user.name}</strong> – {user.email}
      </div>
      {/* <div>Rola: {user.role}</div> */}
      <button onClick={() => onDelete(user._id)}>Zmazať</button>
    </div>
  );
}
