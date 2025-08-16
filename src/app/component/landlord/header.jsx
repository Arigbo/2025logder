export default function Header({ getGreeting, user, setIsSideBarOpen }) {
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <button
        className="md:hidden p-2"
        onClick={() => setIsSideBarOpen(true)}
      >
        ☰
      </button>
      <h1 className="text-xl font-semibold">
        {getGreeting()}, {user ? user.name : 'Guest'}
      </h1>
    </header>
  );
}
