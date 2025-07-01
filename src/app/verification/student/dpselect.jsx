import React from "react";
import FrontLayout from "../../../layouts/front.layout";
import Link from "next/link";
const DpSelect=()=>{
return(
    <div className="verify">
    <FrontLayout>
                <div className="forget_inner">
                    <div className="forget_inner_header">
                        <div className="header_top">
                            <Link href="./signin"><i className="fas fa-chevron-left"></i></Link>
                        </div>
                        <div className="header_middle">
                        <div>
                            <i className="fas fa-user"></i>
                        </div>
                            <div>
                                <header><h1>your dp <i className="fas fa-camera"></i></h1></header></div>
                            <p>{`Since you would be visiting the property to confirm, the owner needs to know who's coming`}</p>
                        </div>
                    </div>
                    <div className="form">
                        <form>
                            <div className="form_inner">
                                <div>
                                <input type="file" src="ifiufrh" alt="Please Select a Picture of you or take one"/>
                                </div>
                            </div>
                           <button>You Look Great</button>
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
export default DpSelect