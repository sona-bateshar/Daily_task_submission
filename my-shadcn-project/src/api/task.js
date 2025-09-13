import API from "./AxiosInstance";

//Task apis
export const postTask = (FormData) => API.post("/api/task/task/", FormData);

export const patchTask = (id, FormData) =>
  API.patch(`/api/task/task/${id}/`, FormData);

export const getTaskDetails = (id) => API.get(`/api/task/task/${id}/`);

export const getTaskList = () => API.get("/api/task/task");

// Comment apis
export const postComment = (FormData) =>
  API.post("/api/task/comment/", FormData);

export const patchComment = (id, FormData) =>
  API.patch(`/api/task/comment/${id}/`, FormData);

export const getCommentDetails = (id) => API.get(`/api/task/comment/${id}/`);

export const getCommentList = (task_id) =>
  API.get("/api/task/comment/", {
    params: {
      task__id: task_id,
    },
  });
