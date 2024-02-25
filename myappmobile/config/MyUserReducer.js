const userData = {
    id: 0,
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    avatar: null,
    birth_date: '',
    address: '',
    role: ''
};
const userReducer = (user, action) => {
    switch (action.type) {
        case "login":
            return action.payload
        case "logout":
            return user = userData
    }

    return user
}

export default userReducer