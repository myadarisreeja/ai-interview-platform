import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DescriptionIcon from '@mui/icons-material/Description';
import { uploadResume } from '../api/resumeApi';

export default function ResumeUploadPage() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadedResume, setUploadedResume] = useState(null);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type !== 'application/pdf') {
      setError('Only PDF files are supported');
      setFile(null);
      return;
    }
    setError('');
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a PDF file first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await uploadResume(file);
      setUploadedResume(response.data);
    } catch (err) {
      const message = err.response?.data?.message || 'Upload failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 3, md: 5 }, maxWidth: 640, mx: 'auto' }}>
      <Typography variant="h4" fontWeight={700} mb={1}>
        Upload Your Resume
      </Typography>
      <Typography color="text.secondary" mb={4}>
        We'll use it to generate interview questions tailored to your experience
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {uploadedResume ? (
        <Paper elevation={0} sx={{ p: 4, border: '1px solid #E2E8F0' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                bgcolor: '#ECFDF5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CheckCircleIcon sx={{ color: '#10B981' }} />
            </Box>
            <Box>
              <Typography fontWeight={700}>Resume uploaded successfully</Typography>
              <Typography variant="body2" color="text.secondary">
                {uploadedResume.fileName}
              </Typography>
            </Box>
          </Box>

          <Typography variant="subtitle2" fontWeight={700} mb={1}>
            Extracted text preview
          </Typography>
          <Box
            sx={{
              p: 2.5,
              bgcolor: '#F8FAFC',
              borderRadius: 2,
              maxHeight: 220,
              overflow: 'auto',
              fontSize: 14,
              color: 'text.secondary',
              lineHeight: 1.6,
              mb: 3,
            }}
          >
            {uploadedResume.extractedText?.slice(0, 600)}...
          </Box>

          <Button
            variant="contained"
            size="large"
            fullWidth
            sx={{ py: 1.3 }}
            onClick={() => navigate('/generate-questions', { state: { resumeId: uploadedResume.id } })}
          >
            Continue to Question Generation
          </Button>
        </Paper>
      ) : (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: 'center',
            border: '2px dashed #CBD5E1',
            bgcolor: file ? '#F8FAFC' : 'transparent',
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              bgcolor: '#EEF2FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
            }}
          >
            {file ? (
              <DescriptionIcon sx={{ fontSize: 28, color: 'primary.main' }} />
            ) : (
              <UploadFileIcon sx={{ fontSize: 28, color: 'primary.main' }} />
            )}
          </Box>

          {!file ? (
            <>
              <Typography fontWeight={700} mb={0.5}>
                Drop your resume here
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                PDF format, up to 3MB
              </Typography>
              <Button variant="outlined" component="label">
                Choose File
                <input type="file" accept=".pdf" hidden onChange={handleFileChange} />
              </Button>
            </>
          ) : (
            <>
              <Typography fontWeight={700} mb={0.5}>
                {file.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Ready to upload
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center' }}>
                <Button variant="outlined" component="label">
                  Change File
                  <input type="file" accept=".pdf" hidden onChange={handleFileChange} />
                </Button>
                <Button
                  variant="contained"
                  onClick={handleUpload}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={22} sx={{ color: 'white' }} /> : 'Upload Resume'}
                </Button>
              </Box>
            </>
          )}
        </Paper>
      )}
    </Box>
  );
}