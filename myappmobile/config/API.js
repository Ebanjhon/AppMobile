import axios from "axios";

export const HOST = "https://nmau4669.pythonanywhere.com";

export const endpoints = {
    'login': '/o/token/',
    'current_user': '/User/current_user/',
    'study_class': (userId) => `/User/${userId}/get_studyclass/`,// có thể đặt tên khác với api đan g được gọi nhưng, chú ý đối số
    'scores': (resultId) => `/StudyClass/${resultId}/get_student_results/`,
    'post': (classId) => `StudyClass/${classId}/get_post/`,
    'postDetail': (postId) => `/Post/${postId}/get_comments/`

}


export const authApi = (accessToken) => axios.create({
    baseURL: HOST,
    headers: {
        "Authorization": `bearer ${accessToken}`
    }
})

export default axios.create({
    baseURL: HOST
})

