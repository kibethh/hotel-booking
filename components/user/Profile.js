import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Image from "next/image";

import { useDispatch, useSelector } from "react-redux";
import { updateProfile, clearErrors } from "../../redux/actions/userActions";
import { UPDATE_PROFILE_RESET } from "../../redux/constants/userConstants";
import ButtonLoader from "../layout/ButtonLoader";
import Loader from "../layout/Loader";

const Profile = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { name, email, password } = user;
  const [avatarPreview, setAvatarPreview] = useState(
    "/images/default_avatar.jpg"
  );
  const { user: currentUser } = useSelector((state) => state.auth);
  const avatarRef = useRef();
  const [avatar, setAvatar] = useState("");
  const {
    error,
    isUpdated,
    loading: updateLoading,
  } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser) {
      setUser({
        name: currentUser.name,
        email: currentUser.email,
      });
      setAvatarPreview(
        currentUser.avatar
          ? currentUser.avatar.url
          : "/images/default_avatar.jpg"
      );
    }
    if (error) {
      toast.error(error);
      dispatch(clearErrors);
    }
    if (isUpdated) {
      toast.success("Updated Successfully");
      setTimeout(() => router.push("/"), 5000);

      dispatch({ type: UPDATE_PROFILE_RESET });
    }
  }, [dispatch, isUpdated, currentUser, error, avatarPreview, router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      name: currentUser.name !== name ? name : currentUser.name,
      email: currentUser.email !== email ? email : currentUser.email,
      avatar: currentUser.avatar !== avatar ? avatar : currentUser.avatar,
    };
    dispatch(updateProfile(userData));
  };

  const onChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          //   setAvatar(reader.result);
          //   setAvatarPreview(reader.result);
          setAvatar(reader.result);
          setAvatarPreview(reader.result);
        }
      };

      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  return (
    <React.Fragment>
      {updateLoading ? (
        <Loader />
      ) : (
        <div className="container container-fluid">
          <div className="row wrapper">
            <div className="col-10 col-lg-5">
              <form className="shadow-lg" onSubmit={handleSubmit}>
                <h1 className="mb-3">Update Profile</h1>

                <div className="form-group">
                  <label htmlFor="name_field">Name</label>
                  <input
                    type="text"
                    id="name_field"
                    name="name"
                    className="form-control"
                    value={name}
                    onChange={onChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email_field">Email</label>
                  <input
                    type="email"
                    id="email_field"
                    name="email"
                    className="form-control"
                    value={email}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password_field">Password</label>
                  <input
                    type="password"
                    id="password_field"
                    name="password"
                    className="form-control"
                    value={password}
                    onChange={onChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="avatar_upload">Avatar</label>
                  <div className="d-flex align-items-center">
                    <div>
                      <figure className="avatar mr-3 item-rtl">
                        <Image
                          src={avatarPreview}
                          className="rounded-circle"
                          alt="image"
                          height={50}
                          width={50}
                        />
                      </figure>
                    </div>
                    <div className="custom-file">
                      <input
                        type="file"
                        name="avatar"
                        className="custom-file-input"
                        id="customFile"
                        accept="images/*"
                        ref={avatarRef}
                        onChange={onChange}
                      />
                      <label className="custom-file-label" htmlFor="customFile">
                        Choose Avatar
                      </label>
                    </div>
                  </div>
                </div>

                <button
                  id="login_button"
                  type="submit"
                  className="btn btn-block py-3"
                >
                  {updateLoading ? <ButtonLoader /> : "UPDATE"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default Profile;
