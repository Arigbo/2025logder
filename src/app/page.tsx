"use client";
import React from "react";
import { useState } from "react";
import Link from "next/link";
const Home = () => {
  const [menu, setMenu] = useState(true);
  const hideMenu = () => {
    setMenu(true);
  };
  const showMenu = () => {
    setMenu(false);
  };
  return (
    <div className="home">
           <div className="home_inner">
          <header>
            <div className="logo">
              <img src={"/images/Vector.png"} alt="mmm" />
              <h1>Lodger</h1>
            </div>
            <div className={`menu-content ${menu ? "none" : "show"}`}>
              <nav>
                <a href="">Home</a>
                <Link href="/discover">Discover</Link>
                <a href="./landlords">Agents & Landlords</a>
                <a href="">Support</a>
              </nav>
              <div className="sorl">
                <Link href="/verification/utsignup" className="button">SignUp</Link>
                <Link href="/verification/utsignin">Login</Link>
              </div>
            </div>

            <div className="menu-handle">
              {menu ? (
                <i className="fas fa-bars" onClick={showMenu}></i>
              ) : (
                <i className="fas fa-x" onClick={hideMenu}></i>
              )}
            </div>
          </header>
          <div className="home_inner_body" onClick={hideMenu}>
            <section className="hero">
              <div className="hero_left">
                <div className="hero_left_top">
                  <div className="hero_left_top_top">
                    <h1>
                      Finding <span>student</span>
                    </h1>
                    <h1>
                      space <span> made </span>
                      <span>easy</span>
                    </h1>
                  </div>
                  <div className="hero_left_top_bottom">
                    <p>
                      The platform that takes away the stress and delay of finding the right lodges for students of
                      esteemed institutions.
                    </p>
                  </div>
                </div>
                <div className="hero_left_middle">
                  <Link href="">
                    <button>Get Started</button>
                  </Link>
                </div>
                <div className="hero_left_bottom">
                  <div className="hero_left_bottom_first obj">
                    <div className="hero_left_bottom_first_top ">
                      <h1>
                        900<span>+</span>
                      </h1>
                    </div>
                    <div className="hero_left_bottom_first_bottom">
                      <h6>satisfied customers</h6>
                    </div>
                  </div>
                  <div className="hero_left_bottom_second obj">
                    <div className="hero_left_bottom_second_top ">
                      <h1>
                        900<span>+</span>
                      </h1>
                    </div>
                    <div className="hero_left_bottom_second_bottom">
                      <h6>satisfied customers</h6>
                    </div>
                  </div>
                  <div className="hero_left_bottom_third obj">
                    <div className="hero_left_bottom_third_top ">
                      <h1>
                        900<span>+</span>
                      </h1>
                    </div>
                    <div className="hero_left_bottom_third_bottom">
                      <h6>satisfied customers</h6>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hero_right"></div>
              <div className="hero_bottom">
              </div>
            </section>
            <section className="first">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </section>
            <section className="second">
              <div className="second_left">
                <img src={"/images/Frame 8.png"} />
              </div>
              <div className="second_right">
                <div className="header">
                  <h1>About Us</h1>
                </div>
                <div className="second_right_inner">
                  <div className="second_right_inner_top">
                    <h1>Why choose us?</h1>
                    <p>
                      We provide a hassle-free platform, connecting students and landlords by offering a range of
                      options that fit both their needs. Our focus is on affordability, safety, convenience, and
                      fostering a sense of community.
                    </p>
                  </div>
                  <div className="second_right_inner_bottom">
                    <div>
                      <i className="fas fa-check"></i>
                      <p>Verifed Listings</p>
                    </div>
                    <div>
                      <i className="fas fa-check"></i>
                      <p>Verifed Listings</p>
                    </div>
                    <div>
                      <i className="fas fa-check"></i>
                      <p>Verifed Listings</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="third"></section>
            <section className="fourth">
              <div>
                <div className="header">
                  <h1>
                    Meet our <span>team</span>
                  </h1>
                </div>
              </div>
              <div className="fourth_inner">
                <div className="profile">
                  <div className="profile_top">
                    <img src="/images/9334180 4.png" />
                  </div>
                  <div className="profile_bottom">
                    <div className="name">
                      <h1>
                        Arigbo <span>Jesse</span>
                      </h1>
                    </div>
                    <div className="bio">
                      <p>
                        The CEO & Co-Founder of Ancients and Lodger. A student at the University of Port Harcourt,
                        Computer Science.
                      </p>
                    </div>
                    <div className="socials">
                      <i className="fab fa-facebook"></i>
                      <i className="fab fa-facebook"></i>
                      <i className="fab fa-facebook"></i>
                      <i className="fab fa-facebook"></i>
                    </div>
                  </div>
                </div>
                <div className="profile">
                  <div className="profile_top">
                    <img src="/images/9334180 4.png" />
                  </div>
                  <div className="profile_bottom">
                    <div className="name">
                      <h1>
                        Arigbo<span> Jesse</span>
                      </h1>
                    </div>
                    <div className="bio">
                      <p>
                        The CEO & Co-Founder of Ancients and Lodger. A student at the University of Port Harcourt,
                        Computer Science.
                      </p>
                    </div>
                    <div className="socials">
                      <i className="fab fa-facebook"></i>
                      <i className="fab fa-facebook"></i>
                      <i className="fab fa-facebook"></i>
                      <i className="fab fa-facebook"></i>
                    </div>
                  </div>
                </div>
                <div className="profile">
                  <div className="profile_top">
                    <img src="/images/9334180 4.png" />
                  </div>
                  <div className="profile_bottom">
                    <div className="name">
                      <h1>
                        Arigbo <span>Jesse</span>
                      </h1>
                    </div>
                    <div className="bio">
                      <p>
                        The CEO & Co-Founder of Ancients and Lodger. A student at the University of Port Harcourt,
                        Computer Science.
                      </p>
                    </div>
                    <div className="socials">
                      <i className="fab fa-facebook"></i>
                      <i className="fab fa-facebook"></i>
                      <i className="fab fa-facebook"></i>
                      <i className="fab fa-facebook"></i>
                    </div>
                  </div>
                </div>
                <div className="profile">
                  <div className="profile_top">
                    <img src="/images/9334180 4.png" />
                  </div>
                  <div className="profile_bottom">
                    <div className="name">
                      <h1>
                        Arigbo <span>Jesse</span>
                      </h1>
                    </div>
                    <div className="bio">
                      <p>
                        The CEO & Co-Founder of Ancients and Lodger. A student at the University of Port Harcourt,
                        Computer Science.
                      </p>
                    </div>
                    <div className="socials">
                      <i className="fab fa-facebook"></i>
                      <i className="fab fa-facebook"></i>
                      <i className="fab fa-facebook"></i>
                      <i className="fab fa-facebook"></i>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="fifth">
              <div>
                <div className="header">
                  <h1>Testimonials</h1>
                </div>
              </div>
              <div className="fifth_inner"></div>
            </section>
            <section className="sixth">
              <div className="sixth_left">
                <div className="sixth_left_top">
                  <div className="header">
                    <h1>
                      General <span>FAQs</span>
                    </h1>
                  </div>
                </div>
                <div className="sixth_left_middle">
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque, cupiditate enim cum voluptatem dicta
                    debitis vel deleniti optio possimus numquam qui mollitia{" "}
                  </p>
                </div>
                <div className="sixth_left_bottom">
                  <img src={"/images/Frame 8.png"} />
                </div>
              </div>
              <div className="sixth_right">
                <div className="comment">
                  <div className="top">
                    <h6>How do i book an apartment?</h6>
                    <i className="fas fa-chevron-down"></i>
                  </div>
                  <div className="bottom">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque, cupiditate </p>
                  </div>
                </div>
                <div className="comment">
                  <div className="top">
                    <h6>How do i book an apartment?</h6>
                    <i className="fas fa-chevron-down"></i>
                  </div>
                  <div className="bottom">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque, cupiditate </p>
                  </div>
                </div>
                <div className="comment">
                  <div className="top">
                    <h6>How do i book an apartment?</h6>
                    <i className="fas fa-chevron-down"></i>
                  </div>
                  <div className="bottom">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque, cupiditate </p>
                  </div>
                </div>
                <div className="comment">
                  <div className="top">
                    <h6>How do i book an apartment?</h6>
                    <i className="fas fa-chevron-down"></i>
                  </div>
                  <div className="bottom">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque, cupiditate </p>
                  </div>
                </div>
              </div>
            </section>
            <section></section>
          </div>
          <div className="footer">
            <div className="left">
              <div className="logo">
                <img src={"/images/Vector.png"} alt="mmm" />
                <h1>Lodger</h1>
              </div>
              <div>
                <p>@ <span>2024</span> <span>All </span> <span>Rights</span><span>Reserved</span></p>
              </div>
            </div>
            <div className="right">
              <Link href="" className="Link">
                terms
              </Link>
              <Link href="" className="Link">
                privacy
              </Link>
              <Link href="" className="Link">
                support
              </Link>
              <Link href="" className="Link">
                about
              </Link>
              <Link href="" className="Link">
                resources
              </Link>
              <Link href="" className="Link">
                contact
              </Link>
            </div>
          </div>
        </div>
    </div>
  );
};
export default Home;