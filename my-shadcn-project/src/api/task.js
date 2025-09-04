import API from './AxiosInstance';

export const postTask = (FormData) =>
  API.post('/api/task/task/', FormData);


export const patchTask = (id, FormData) => 
  API.patch(`/api/task/task/${id}/`, FormData);


export const TaskList = () =>
  API.get('/api/task/task');