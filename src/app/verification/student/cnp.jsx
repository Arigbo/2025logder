import React, { useState } from "react";
import FrontLayout from "../../../layouts/front.layout";
import Link from "next/link";
const CNP = () => {
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
    const [ccnp, setCcnp] = useState(true)
    const showCcnp = () => {
        setCcnp(false)
    }
    return (
        <div className="verify">
            <div className="verify">
                <FrontLayout>
                    <div className={`${ccnp ? "cnp" : "hide"}`}>
                        <div className="cnp_header">
                            <div className="header_top">
                                <Link href="./otp"><i className="fas fa-chevron-left"></i></Link>
                            </div>
                            <div className="header_middle">
                                <div>
                                    <header><h1>Create new password</h1></header></div>
                                <p>{`Your new password must be unique from those previously used`}</p>
                            </div>
                        </div>
                        <div className="form">
                            <form>
                                <div className="form_inner">
                                    <div className="password">
                                        <input type={`${password ? "password" : "text"}`} required placeholder="password" />
                                        {password ? (
                                            <i className="far fa-eye-slash c-pointer" onClick={showPassword}> </i>
                                        ) : (
                                            <i className="far fa-eye" onClick={hidePassword}> </i>
                                        )
                                        }
                                    </div>
                                    <div className="password">
                                        <input type={`${confirmPassword ? "password" : "text"}`} required placeholder="confirm password" />
                                        {confirmPassword ? (
                                            <i className="far fa-eye-slash c-pointer" onClick={showConfirmPassword}> </i>
                                        ) : (
                                            <i className="far fa-eye" onClick={hideConfirmPassword}> </i>
                                        )
                                        }
                                    </div>
                                </div>
                                <button onClick={showCcnp}>Reset Password</button>
                            </form>
                        </div>
                    </div>
                    <div className={`${ccnp ? "hide" : "ccnp"}`}>
                        <div className="top"><i className="fas fa-check fa-beat"></i></div>
                        <div className="middle">
                            <header><h1>password changed!</h1></header>
                            <p>
                                {`Your password has been changed successfully.`}
                            </p>
                        </div>
                        <div className="bottom"><Link href="./signin" className="link"><button>Back to Login</button></Link></div>
                    </div>
                </FrontLayout>
            </div>
        </div>
    )
}
export default CNP