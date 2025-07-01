import React, { useState } from "react";
import FrontLayout from "../../../layouts/front.layout";
import Link from "next/link";
const SignUp = () => {
    const [password, setPassword] = useState(true)
    const showPassword = () => {
        setPassword(false)
    }
    const hidePassword = () => {
        setPassword(true)
    }
    const [confirmPassword, setConfirmPassword] = useState(true)
    const showConfirmPassword = () => {
        setConfirmPassword(false)
    }
    const hideConfirmPassword = () => {
        setConfirmPassword(true)
    }
    return (
        <div className="verify">
            <FrontLayout>
                <div className="signup_inner">
                    <div className="signup_inner_header">
                        <div className="header_top">
                            <Link href="/discover"><i className="fas fa-chevron-left"></i></Link>
                        </div>
                        <div className="header_middle">
                            <div>      <img src={"/images/Vector.png"} alt="mmm" />
                                <h1>Lodger</h1></div>
                            <p >Welcome, Please create your new account</p>
                        </div>
                    </div>
                    <div className="form">
                        <form>
                            <div className="form_inner">
                                <div className="name">
                                    <input type="text" required placeholder="First Name" />
                                    <input type="text" required placeholder="Last Name" />
                                </div>
                                <div>
                                    <input type="email" required placeholder="email" />
                                </div>
                                <div>
                                    <input type="text" placeholder="School/university/college" />
                                </div>
                                <div>
                                    <input type="tel" required placeholder="phone number" />
                                </div>
                                <div className="password">
                                    <input type={`${password ? "password" : "text"}`} required placeholder="password" />
                                    {password ? (
                                        <i className="far fa-eye c-pointer" onClick={showPassword}> </i>
                                    ) : (
                                        <i className="far fa-eye-slash" onClick={hidePassword}> </i>
                                    )
                                    }
                                </div>
                                <div className="password">
                                    <input type={`${confirmPassword ? "password" : "text"}`} required placeholder="confirm password" />
                                    {confirmPassword ? (
                                        <i className="far fa-eye c-pointer" onClick={showConfirmPassword}> </i>
                                    ) : (
                                        <i className="far fa-eye-slash" onClick={hideConfirmPassword}> </i>
                                    )
                                    }
                                </div>
                            </div>
                            <Link href="./dpselect"><button>Register</button></Link>
                        </form>
                        <p>Already have an account? <Link href="./signin" className="link">Click here</Link></p>
                    </div>
                </div>
            </FrontLayout>
        </div>
    )
}
export default SignUp