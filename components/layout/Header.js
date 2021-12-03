import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "../../redux/actions/userActions";
import { signOut } from "next-auth/client";
import { toast } from "react-toastify";

const Header = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.loadedUser);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  const handleLogout = () => {
    signOut();
    toast.success("Logged out Successfully");
  };
  return (
    <nav className="navbar row justify-content-center sticky-top">
      <div className="container">
        <div className="col-3 p-0">
          <div className="navbar-brand">
            <Link href="/" passHref>
              <a>
                <Image
                  // style={{ cursor: "pointer" }}
                  src="/images/booking.png"
                  alt="BookIT"
                  width="100%"
                  height="100%"
                />
              </a>
            </Link>
          </div>
        </div>

        <div className="col-3 mt-3 mt-md-0 text-center">
          {user ? (
            <div className="ml-4 dropdown d-line">
              <a
                className="btn dropdown-toggle mr-4"
                id="dropDownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <figure className="avatar avatar-nav">
                  <Image
                    src={
                      user.avatar
                        ? user.avatar.url
                        : "/images/default_avatar.jpg"
                    }
                    alt={user && user.name}
                    className="rounded-circle"
                    height={50}
                    width={50}
                  />
                </figure>
                <span>{user && user.name}</span>
              </a>
              <div
                className="dropdown-menu"
                aria-labelledby="dropDownMenuButton"
              >
                {user.role === "admin" && (
                  <>
                    <Link href="/admin/rooms">
                      <a className="dropdown-item">Rooms</a>
                    </Link>

                    <Link href="/admin/bookings">
                      <a className="dropdown-item">Bookings</a>
                    </Link>
                    <Link href="/admin/users">
                      <a className="dropdown-item">Users</a>
                    </Link>
                    <Link href="/admin/reviews">
                      <a className="dropdown-item">Reviews</a>
                    </Link>
                    <hr />
                  </>
                )}
                <Link href="/bookings/me">
                  <a className="dropdown-item">My Bookings</a>
                </Link>
                <Link href="/me/update">
                  <a className="dropdown-item">Profile</a>
                </Link>
                <Link href="/">
                  <a
                    className="dropdown-item text-danger"
                    onClick={handleLogout}
                  >
                    Logout
                  </a>
                </Link>
              </div>
            </div>
          ) : (
            !loading && (
              <Link href="/login">
                <a className="btn btn-danger px-4 text-white login-header-btn float-right">
                  Login
                </a>
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
