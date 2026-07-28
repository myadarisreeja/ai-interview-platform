import axiosInstance from './axiosInstance';

export const generateQuestions = (resumeId, jobRole, count = 10) => {
  return axiosInstance.post(
    `/questions/generate?resumeId=${resumeId}&jobRole=${encodeURIComponent(jobRole)}&count=${count}`
  );
};

export const generateMoreQuestions = (questionSetId, count = 10) => {
  return axiosInstance.post(
    `/questions/${questionSetId}/generate-more?count=${count}`
  );
};