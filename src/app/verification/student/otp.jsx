import React from "react";
import FrontLayout from "../../../layouts/front.layout";
import Link from "next/link";
const Otp = () => {
    return (
        <div className="verify">
            <div className="verify">
                <FrontLayout>
                    <div className="otp_inner">
                        <div className="otp_inner_header">
                            <div className="header_top">
                                <Link href="./forget"><i className="fas fa-chevron-left"></i></Link>
                            </div>
                            <div className="header_middle">
                                <div>
                                    <header><h1>OTP Verification</h1></header></div>
                                <p>{`Enter the verification code we just sent on your email address.`}</p>
                            </div>
                        </div>
                        <div id="form">
                            <form>
                                <div id="form_inner" >
                                    <div>
                                        <input type="number" required id="input"/>
                                    </div>
                                    <div>
                                        <input type="number" required id="input"/>
                                    </div>
                                    <div>
                                        <input type="number" required id="input"/>
                                    </div>
                                    <div>
                                        <input type="number" required id="input"/>
                                    </div>
                                </div>
                                <Link href="./cnp"><button>Send Code</button></Link>
                            </form>
                            <div className="form_bottom">
                                <p>Remenber Password <Link href="./signin" className="link">Login</Link></p>
                            </div>
                        </div>
                    </div>
                </FrontLayout>
            </div>
        </div>
    )
}
export default Otp