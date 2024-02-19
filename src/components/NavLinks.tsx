const links = [
  { href: "/chat", label: "chat" },
  { href: "/tours", label: "tours" },
  { href: "/tours/new-tour", label: "new tour" },
  { href: "/profile", label: "profile" },
];

const NavLinks = () => {
  return (
    <div className="menu text-base-content">
      <ul>
        {links.map(({ href, label }) => (
          <li
            key={`${label}`}
            className="capitalize"
          >
            <a href={href}>{label}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NavLinks;
