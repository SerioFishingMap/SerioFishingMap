import "./app-header.css";

type User = {
  name: string;
};

export type HeaderProps = {
  user?: User;
};

const AppHeader = ({ user }: HeaderProps) => (
  <header className="app-header">
    <div className="brand">
      <div className="brand__icon" aria-hidden="true" />
      <div className="brand__text">
        <span className="brand__title">Serio Fishing Map</span>
        <span className="brand__subtitle">スポットを探す・残す・共有する</span>
      </div>
    </div>
    {user && (
      <div className="header-user" aria-label="current user">
        <span className="header-user__welcome">Welcome</span>
        <span className="header-user__name">{user.name}</span>
      </div>
    )}
  </header>
);

export default AppHeader;
