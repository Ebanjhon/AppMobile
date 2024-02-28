import axios from "axios";

export const HOST = "https://nmau4669.pythonanywhere.com";

export const endpoints = {
    'login': '/o/token/',
    'current_user': '/User/current_user/',
    'study_class': (userId) => `/User/${userId}/get_studyclass/`,// có thể đặt tên khác với api đan g được gọi nhưng, chú ý đối số
    'scores': (resultId) => `/StudyClass/${resultId}/get_student_results/`,
    'post': (classId) => `/StudyClass/${classId}/get_post/`,
    'postDetail': (postId) => `/Post/${postId}/get_comments/`,
    'cmt_add': (postId) => `/Post/${postId}/add_comment/`,
    'reply_add': (cmtPrent) => `/Comments/${cmtPrent}/add_reply/`,
    'add_post': (classId) => `/StudyClass/${classId}/add_post/`,
    'get_list_student': (classId) => `/StudyClass/${classId}/get_list_student_results/`,
    'add_scores': (classId) => `/StudyClass/${classId}/input_scores/`,
    'lock_scores': (classId) => `/StudyClass/${classId}/finalize_scores/`,
    'get_scores': (classId) => `/StudyClass/${classId}/get_result_learning/`,
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

