import { Link } from "react-router-dom";
import "./Header.css";

const Header = ({ loggedInUser, onLogout }) => {
  return (
    <header>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          {/* Titlul header-ului */}
          <h1 data-aos="fade-down">Cabinet Stomatologic</h1>
          <nav>
            <ul className="nav">
              {/* Link-ul pentru "Acasă" */}
              <li className="nav-item">
                <Link className="nav-link-custom" to="/" data-aos="zoom-in">
                  Acasă
                </Link>
              </li>
              {loggedInUser ? (
                <>
                  {/* Opțiunile pentru DOCTOR */}
                  {loggedInUser.role === "DOCTOR" && (
                    <>
                      <li className="nav-item">
                        <Link
                          className="nav-link-custom"
                          to="/doctor/add-patient"
                          data-aos="slide-right"
                          data-aos-delay="100"
                        >
                          Adaugă Pacient
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link
                          className="nav-link-custom"
                          to="/doctor/delete-patient"
                          data-aos="slide-right"
                          data-aos-delay="200"
                        >
                          Șterge Pacient
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link
                          className="nav-link-custom"
                          to="/doctor/appointments"
                          data-aos="slide-right"
                          data-aos-delay="300"
                        >
                          Programări
                        </Link>
                      </li>
                    </>
                  )}
                  {/* Opțiunile pentru PATIENT */}
                  {loggedInUser.role === "PATIENT" && (
                    <>
                        <li className="nav-item">
      <Link
        className="nav-link-custom"
        to="/patient/review-doctor"
        data-aos="slide-right"
        data-aos-delay="300"
      >
        Evaluează Doctor
      </Link>
    </li>
                      <li className="nav-item">
                        <Link
                          className="nav-link-custom"
                          to="/patient/show-prescription"
                          data-aos="slide-right"
                          data-aos-delay="100"
                        >
                          Afișează Rețeta
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link
                          className="nav-link-custom"
                          to="/patient/add-appointment"
                          data-aos="slide-right"
                          data-aos-delay="200"
                        >
                          Adaugă Programare
                        </Link>
                      </li>
                    </>
                  )}
                  {/* Butonul de Logout */}
                  <li className="nav-item">
                    <button
                      className="btn-danger-custom"
                      onClick={onLogout}
                      data-aos="zoom-in"
                      data-aos-delay="300"
                    >
                      Log Out
                    </button>
                  </li>
                </>
              ) : (
                <>
                  {/* Link-urile pentru utilizatorii neautentificați */}
                  <li className="nav-item">
                    <Link
                      className="nav-link-custom"
                      to="/login"
                      data-aos="zoom-in"
                      data-aos-delay="100"
                    >
                      Autentificare
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link-custom"
                      to="/register"
                      data-aos="zoom-in"
                      data-aos-delay="200"
                    >
                      Înregistrare
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
