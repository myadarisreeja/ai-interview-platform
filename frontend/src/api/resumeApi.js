import axiosInstance from './axiosInstance';

export const uploadResume = (file) => {
  const formData = new FormData();
  formData.append('file', file);

  return axiosInstance.post('/resumes/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};