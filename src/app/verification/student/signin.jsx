import React, { useState } from "react";
import FrontLayout from "../../../layouts/front.layout";
import Link from "next/link";
const SignIn = () => {
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
                <div className="signin_inner">
                    <div className="signin_inner_header">
                        <div className="header_top">
                            <Link href="/discover"><i className="fas fa-chevron-left"></i></Link>
                        </div>
                        <div className="header_middle">
                            <div>      <img src={"/images/Vector.png"} alt="mmm" />
                                <h1>Lodger</h1></div>
                            <p>Welcome Back, Please Login</p>
                        </div>
                    </div>
                    <div className="form">
                        <form>
                            <div className="form_inner">
                                <div>
                                    <input type="email" required placeholder="email" />
                                </div>
                                <div className="password">
                                    <input type={`${password ? "password" : "text"}`} required placeholder="password" />
                                    {password ? (
                                        <i className="far fa-eye-slash" onClick={showPassword}> </i>
                                    ) : (
                                        <i className="far fa-eye" onClick={hidePassword}> </i>
                                    )
                                    }
                                </div>
                                <div><Link href="./forget" className="link p">Forgot Password?</Link></div>
                            </div>
                            <button>Register</button>
                        </form>
                        <div className="form_middle">
                            <div className="line"></div>
                            <div><p>or</p></div>
                            <div className="line"></div>
                        </div>
                        <div className="form_bottom">
                            <div className="form_bottom_inner">
                                <a href=""><i className="fab fa-google"></i>Login with Google</a>
                                <a href=""><i className="fab fa-google"></i>Login with Google</a>
                            </div>
                            <p>{`Don't have an account`}? <Link href="./signup" className="link">Click here</Link></p>
                        </div>
                    </div>
                </div>
            </FrontLayout>
        </div>
    )
}
export default SignIn