import React from "react";
import FrontLayout from "../../../layouts/front.layout";
import Link from "next/link";
const ForgetPass = () => {
    return (
        <div className="verify">
            <FrontLayout>
                <div className="forget_inner">
                    <div className="forget_inner_header">
                        <div className="header_top">
                            <Link href="./signin"><i className="fas fa-chevron-left"></i></Link>
                        </div>
                        <div className="header_middle">
                            <div>
                                <header><h1>Forgot Password?</h1></header></div>
                            <p>{`Don't worry! It occurs. Please enter the email address linked with your account.`}</p>
                        </div>
                    </div>
                    <div className="form">
                        <form>
                            <div className="form_inner">
                                <div>
                                    <input type="email" required placeholder="email" />
                                </div>
                            </div>
                            <Link href="./otp"><button>Send Code</button></Link>
                        </form>
                        <div className="form_bottom">
                            <p>Remenber Password <Link href="./signin" className="link">Login</Link></p>
                        </div>
                    </div>
                </div>
            </FrontLayout>
        </div>
    )
}
export default ForgetPass