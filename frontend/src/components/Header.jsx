import {
  Link2,
  Sparkles
} from "lucide-react";


export default function Header() {

  return (
    <header className="topbar">

      <div className="container nav-inner">

        <div className="brand">

          <div className="brand-icon">

            <Link2 size={22} />

          </div>


          <div>

            <div className="brand-name">
              LinkLite
            </div>

            <div className="brand-subtitle">
              MERN URL Shortener
            </div>

          </div>

        </div>


        <div className="nav-badge">

          <Sparkles size={15} />

          Multiple URL Support

        </div>

      </div>

    </header>
  );
}