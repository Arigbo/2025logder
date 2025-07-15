import React from "react";
import Link from "next/link";
const url = 'http://localhost:3000/users'
export const getStaticProps = async () => {
    const response = await fetch(url);
    const data = await response.json()
    console.log(data);
    return {
        props: { users: data }
    }
}
const Table = ({ users }) => {
    return (
        <div className="table">
            <table className="table_inner table-striped">
                <thead>
                    <tr>
                    <th style={{ width: '20%' }}>Image</th>
                        <th style={{ width: '10%' }}>First Name</th>
                        <th style={{ width: '10%' }}>Last Name</th>
                        <th style={{ width: '10%' }}>Username</th>
                        <th style={{ width: '10%' }}>School</th>
                        <th style={{ width: '10%' }}>Apartment Used</th>
                        <th style={{ width: '10%' }}>First Name</th>
                        <th style={{ width: '20%' }}>First Name</th>
                    </tr>
                </thead>
                <tbody>
                    {users && users.map(user =>
                        <tr key={user.user.id}>
                            <td><img src={user.user.dp} /></td>
                            <td>{user.user.firstName}</td>
                            <td>{user.user.lastName}</td>
                            <td>{user.user.username}</td>
                            <td>{user.user.school}</td>
                            <td>{user.user.usedAptId}</td>
                            <td>{user.user.bookmarks.length}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                                <Link href={`/users/edit/${user.id}`} className="btn btn-sm btn-primary mr-1">Edit</Link>
                                <button onClick={() => deleteUser(user.id)} className="btn btn-sm btn-danger btn-delete-user" disabled={user.isDeleting}>
                                    {user.isDeleting
                                        ? <span className="spinner-border spinner-border-sm"></span>
                                        : <span>Delete</span>
                                    }
                                </button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
export default Table