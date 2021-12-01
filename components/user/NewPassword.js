import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword, clearErrors } from "../../redux/actions/userActions";
import ButtonLoader from "../layout/ButtonLoader";

const NewPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const { error, success, loading } = useSelector(
    (state) => state.forgotPassword
  );

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (success) {
      toast.success(success);
      setTimeout(() => router.push("/login"), 5000);
    }
  }, [dispatch, success, error, router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const passwords = {
      password,
      confirmPassword,
    };
    dispatch(resetPassword(router.query.token, passwords));
  };

  return (
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form className="shadow-lg" onSubmit={handleSubmit}>
          <h1 className="mb-3">New Password</h1>

          <div className="form-group">
            <label htmlFor="password_field">Password</label>
            <input
              type="password"
              id="password_field"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm_password_field">Confirm Password</label>
            <input
              type="password"
              id="confirm_password_field"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            id="new_password_button"
            type="submit"
            className="btn btn-block py-3"
            disabled={loading ? true : false}
          >
            {loading ? <ButtonLoader /> : "Set Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewPassword;
