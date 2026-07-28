import axiosInstance from './axiosInstance';

export const submitAnswer = (questionId, answerText) => {
  return axiosInstance.post('/answers/submit', { questionId, answerText });
};