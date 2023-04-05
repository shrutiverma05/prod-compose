import { createContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const AuthContext = createContext()

export default AuthContext;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => sessionStorage.getItem('user') ? sessionStorage.getItem('user') : "");
    const [botProp, setBotProp] = useState(() => sessionStorage.getItem('botProp') ? JSON.parse(sessionStorage.getItem('botProp')) : "null");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false)
    let loginUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        let response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 'userID': e.target.userEmail.value, 'password': e.target.userPassword.value })
        })
        const data = await response.json();
        if (response.status === 200) {
            // console.log(data)
            setBotProp(data)
            sessionStorage.setItem("botProp", JSON.stringify(data))
            sessionStorage.setItem("user", e.target.userEmail.value);
            setUser(() => sessionStorage.getItem('user') ? sessionStorage.getItem('user') : e.target.userEmail.value);
            // console.log("userrrrrrrrr" + user)
            setError(false)
            setLoading(false)
            axios
                .post(`${process.env.REACT_APP_API_URL}/data`, {
                    userID: e.target.userEmail.value,
                    pageNumber: 1,
                    limit: 10,
                })
                .then((res) => {
                    if (res.status) {
                        sessionStorage.setItem("data", JSON.stringify(res.data));
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
            navigate("/dashboard");
        } else {
            setError(true)
            setLoading(false)
        }
    }

    let logoutUser = () => {
        setUser(null)
        setBotProp(null)
        setLoading(false);
        setError(false);
        sessionStorage.removeItem('botProp')
        sessionStorage.removeItem('user')
        navigate('/')
    }
    let contextData = {
        user: user,
        botProp: botProp,
        loading: loading,
        error: error,
        loginUser: loginUser,
        logoutUser: logoutUser,
    }
    return (
        <AuthContext.Provider value={contextData} >
            {children}
        </AuthContext.Provider>
    )
}