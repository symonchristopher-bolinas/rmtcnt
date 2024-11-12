import React, { useState } from 'react';
import '../styles/login-register.css';

const AdminSmspin = () => {
  return (
    <section className="wrapper" id='emailveri'>
      <div className="container">
        <div className="col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 col-xl-6 offset-xl-3 text-center">
          <div className="logo">
            <img src="#" className="img-fluid" alt="logo" />
          </div>
          <form className="rounded bg-white shadow p-5">
            <h3 className="text-dark fw-bolder fs-4 mb-2">Two Step Verification</h3>

            <div className="fw-normal text-muted mb-4">
              Enter the verification code we sent to
            </div>

            <div className="d-flex align-items-center justify-content-center fw-bold mb-4">
              {[...Array(6)].map((_, index) => (
                <svg
                  key={index}
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  fill="currentColor"
                  className="bi bi-asterisk"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M8 0a1 1 0 0 1 1 1v5.268l4.562-2.634a1 1 0 1 1 1 1.732L10 8l4.562 2.634a1 1 0 1 1-1 1.732L9 9.732V15a1 1 0 1 1-2 0V9.732l-4.562 2.634a1 1 0 1 1-1-1.732L6 8 1.438 5.366a1 1 0 0 1 1-1.732L7 6.268V1a1 1 0 0 1 1-1z"
                  />
                </svg>
              ))}
              <span>8459</span>
            </div>

            <div className="otp_input text-start mb-2">
              <label htmlFor="digit">Type your 6 digit security code</label>
              <div className="d-flex align-items-center justify-content-between mt-2">
                {[...Array(6)].map((_, index) => (
                  <input key={index} type="text" className="form-control" placeholder="" />
                ))}
              </div>
            </div>

            <a href="./AddTree" class="btn btn-primary submit_btn my-4">
              Submit
            </a>

            <div className="fw-normal text-muted mb-2">
              Didn’t get the code ?{' '}
              <a href="#" className="text-primary fw-bold text-decoration-none">
                Resend
              </a>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AdminSmspin;
