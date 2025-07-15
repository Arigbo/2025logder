// import React from "react";
// import FrontLayout from "../../layouts/front.layout";
// import { useRouter } from "next/router";
// const url = ('http://localhost:3000/users')
// export const getStaticPaths = async () => {
//     const response = await fetch(url);
//     const data = await response.json()
//     console.log(data);
//     const paths = data.map(users => {
//         return {
//             params: { id: users.id.toString() }
//         }
//     })
//     return {
//         paths,
//         fallback: false
//     }
// }
// export const getStaticProps = async (context) => {
//     const id = context.params.id;
//     const response = await fetch('http://localhost:3000/users/' + id);
//     const data = await response.json();
//     console.log(data);
//     return {
//         props: { users: data }
//     }

// }

// const SingleUSer = ({ users }) => {

//     return (
//         <div>
//             <FrontLayout>
//                 <div>
//                     <h1>{user.users.firstName}</h1>
//                     <img src={users.user.dp} />
//                 </div>
//             </FrontLayout>
//         </div>
//     )
// }
// export default SingleUSer