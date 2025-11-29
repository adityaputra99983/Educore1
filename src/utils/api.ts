// Utility functions for API operations

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const baseUrl = '/api';
  const url = `${baseUrl}${endpoint}`;
  
  // Log the request for debugging
  console.log(`API Request: ${options.method || 'GET'} ${url}`);
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };
  
  try {
    const response = await fetch(url, config);
    
    // Log the response for debugging
    console.log(`API Response: ${response.status} ${response.statusText} for ${url}`);
    
    // Handle case where response is not JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      
      if (!response.ok) {
        const errorMessage = data.message || data.error || `API request failed with status ${response.status}`;
        console.error('API Error:', errorMessage);
        throw new Error(`API request failed: ${errorMessage}`);
      }
      
      return data;
    } else {
      // Handle non-JSON responses
      const text = await response.text();
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}: ${text}`);
      }
      return text;
    }
  } catch (error: any) {
    console.error('API request error for', url, ':', error);
    // Provide more detailed error information
    if (error instanceof TypeError && error.message === 'fetch failed') {
      throw new Error('Failed to connect to the API. Please make sure the development server is running.');
    }
    throw error;
  }
}

export async function getStudents(filters: { class?: string; search?: string; type?: string; promotionStatus?: string } = {}) {
  const params = new URLSearchParams();
  
  if (filters.class) params.append('class', filters.class);
  if (filters.search) params.append('search', filters.search);
  if (filters.type) params.append('type', filters.type);
  if (filters.promotionStatus) params.append('promotionStatus', filters.promotionStatus);
  
  const queryString = params.toString() ? `?${params.toString()}` : '';
  
  return fetchAPI(`/students${queryString}`);
}

export async function updateAttendance(studentId: number, newStatus: string) {
  // Validate inputs
  if (!studentId || typeof studentId !== 'number' || studentId <= 0) {
    throw new Error('Invalid student ID. Student ID must be a positive number.');
  }
  
  // Validate status values
  const validStatuses = ['hadir', 'terlambat', 'tidak-hadir', 'izin', 'sakit'];
  if (!validStatuses.includes(newStatus)) {
    throw new Error('Invalid status value. Must be one of: hadir, terlambat, tidak-hadir, izin, sakit');
  }
  
  try {
    // Dispatch event before updating to ensure UI updates immediately
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('attendanceUpdating', { detail: { studentId, newStatus } }));
    }
    
    const result = await fetchAPI('/attendance', {
      method: 'PUT',
      body: JSON.stringify({ studentId, newStatus }),
    });
    
    // Dispatch event after successful update
    if (result.success && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('attendanceUpdated', { 
        detail: { 
          studentId, 
          newStatus, 
          result,
          updatedStudent: result.student,
          updatedStats: result.stats,
          studentCategories: result.categories
        } 
      }));
    }
    
    return result;
  } catch (error) {
    // Dispatch error event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('attendanceUpdateError', { 
        detail: { 
          studentId, 
          newStatus, 
          error 
        } 
      }));
    }
    throw error;
  }
}

export async function addStudent(studentData: any) {
  // Validate required fields
  if (!studentData.nis || !studentData.name || !studentData.class) {
    throw new Error('NIS, name, and class are required fields');
  }
  
  return fetchAPI('/students', {
    method: 'POST',
    body: JSON.stringify(studentData),
  });
}

export async function getSettings() {
  return fetchAPI('/settings');
}

export async function updateSettings(settings: any) {
  return fetchAPI('/settings', {
    method: 'PUT',
    body: JSON.stringify(settings),
  });
}

export async function getReports(type: string, params: Record<string, string> = {}) {
  // Validate report type
  const validTypes = ['summary', 'class', 'promotion', 'detailed', 'performance', 'attendance', 'all'];
  if (!validTypes.includes(type)) {
    throw new Error(`Invalid report type. Must be one of: ${validTypes.join(', ')}`);
  }
  
  // Create a new URLSearchParams object with the type parameter
  const searchParams = new URLSearchParams();
  searchParams.append('type', type);
  
  // Add any additional parameters
  Object.entries(params).forEach(([key, value]) => {
    searchParams.append(key, value);
  });
  
  // Construct the full URL with query parameters
  const queryString = searchParams.toString();
  const url = queryString ? `/reports?${queryString}` : '/reports';
  
  return fetchAPI(url);
}

export async function exportReport(format: string, reportType: string, data: any): Promise<{ success: true; message: string } | { success: false; error: string; message: string }> {
  try {
    // Validate inputs
    if (!format || !['pdf', 'excel'].includes(format)) {
      throw new Error('Invalid format. Must be either "pdf" or "excel"');
    }
    
    if (!reportType) {
      throw new Error('Report type is required');
    }
    
    if (!data) {
      throw new Error('Report data is required');
    }
    
    // For PDF format, use the generatePDFReport function
    if (format === 'pdf') {
      const { generatePDFReport } = await import('./pdfGenerator');
      try {
        const blob = await generatePDFReport(data, reportType);
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `laporan-kehadiran-${reportType}-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        return { success: true, message: 'PDF report exported successfully!' };
      } catch (pdfError: any) {
        console.error('Error generating PDF:', pdfError);
        return { success: false, error: pdfError.message || 'Unknown error', message: 'Error generating PDF: ' + (pdfError.message || 'Unknown error') };
      }
    } else {
      // For Excel export, use the generateExcelReport function
      const { generateExcelReport } = await import('./excelGenerator');
      try {
        const blob = await generateExcelReport(data, reportType);
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `laporan-kehadiran-${reportType}-${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        return { success: true, message: 'Excel report exported successfully!' };
      } catch (excelError: any) {
        console.error('Error generating Excel:', excelError);
        return { success: false, error: excelError.message || 'Unknown error', message: 'Error generating Excel: ' + (excelError.message || 'Unknown error') };
      }
    }
  } catch (error) {
    console.error('Export report error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error', message: 'Failed to export report' };
  }
}

// Add function to fetch student details by ID
export async function getStudentById(id: number) {
  // Validate input
  if (!id || typeof id !== 'number' || id <= 0) {
    throw new Error('Invalid student ID. Student ID must be a positive number.');
  }
  
  return fetchAPI(`/students/${id}`);
}

export async function updateStudentPromotionStatus(studentId: number, promotionStatus: 'naik' | 'tinggal' | 'lulus' | 'belum-ditetapkan', nextClass?: string) {
  // Validate inputs
  if (!studentId || typeof studentId !== 'number' || studentId <= 0) {
    throw new Error('Invalid student ID. Student ID must be a positive number.');
  }
  
  const validStatuses = ['naik', 'tinggal', 'lulus', 'belum-ditetapkan'];
  if (!validStatuses.includes(promotionStatus)) {
    throw new Error(`Invalid promotion status. Must be one of: ${validStatuses.join(', ')}`);
  }
  
  return fetchAPI('/students/promotion', {
    method: 'PUT',
    body: JSON.stringify({ studentId, promotionStatus, nextClass }),
  });
}

export async function updateStudentClass(studentId: number, newClass: string) {
  // Validate inputs
  if (!studentId || typeof studentId !== 'number' || studentId <= 0) {
    throw new Error('Invalid student ID. Student ID must be a positive number.');
  }
  
  if (!newClass || typeof newClass !== 'string') {
    throw new Error('New class must be a non-empty string.');
  }
  
  return fetchAPI('/students/class', {
    method: 'PUT',
    body: JSON.stringify({ studentId, class: newClass }),
  });
}

// Teacher schedule functions
export async function getTeachers() {
  return fetchAPI('/teachers');
}

export async function getTeacherSchedule(teacherId: number) {
  // Validate input
  if (!teacherId || typeof teacherId !== 'number' || teacherId <= 0) {
    throw new Error('Invalid teacher ID. Teacher ID must be a positive number.');
  }
  
  return fetchAPI(`/teachers/${teacherId}/schedule`);
}

export async function addTeacher(teacherData: any) {
  // Validate required fields
  if (!teacherData.name || !teacherData.subject) {
    throw new Error('Name and subject are required fields for teachers');
  }
  
  return fetchAPI('/teachers', {
    method: 'POST',
    body: JSON.stringify(teacherData),
  });
}

export async function updateTeacherSchedule(teacherId: number, scheduleData: any) {
  // Validate inputs
  if (!teacherId || typeof teacherId !== 'number' || teacherId <= 0) {
    throw new Error(`Invalid teacher ID: ${teacherId}. Teacher ID must be a positive number.`);
  }
  
  if (!Array.isArray(scheduleData)) {
    throw new Error('Schedule data must be an array.');
  }
  
  return fetchAPI(`/teachers/${teacherId}/schedule`, {
    method: 'PUT',
    body: JSON.stringify(scheduleData),
  });
}

// Function to remove a teacher
export async function removeTeacher(teacherId: number) {
  // Validate input
  if (!teacherId || typeof teacherId !== 'number' || teacherId <= 0) {
    throw new Error('Invalid teacher ID. Teacher ID must be a positive number.');
  }
  
  return fetchAPI(`/teachers/${teacherId}`, {
    method: 'DELETE',
  });
}

// Function to remove a student
export async function removeStudent(studentId: number) {
  // Validate input
  if (!studentId || typeof studentId !== 'number' || studentId <= 0) {
    throw new Error('Invalid student ID. Student ID must be a positive number.');
  }
  
  return fetchAPI(`/students/${studentId}`, {
    method: 'DELETE',
  });
}