'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface AnalyticsData {
  stateDistribution: Array<{ state: string; count: number }>;
  districtDistribution: Array<{ district: string; count: number }>;
  genderDistribution: Array<{ gender: string; count: number }>;
  classDistribution: Array<{ class: string; count: number }>;
  degreeDistribution: Array<{ degree: string; count: number }>;
  fatherOccupationDistribution: Array<{ occupation: string; count: number }>;
  fatherIncomeDistribution: Array<{ incomeRange: string; count: number }>;
  instituteTypeDistribution: Array<{ type: string; count: number }>;
}

interface ChartProps {
  title: string;
  data: Array<{ [key: string]: any; count: number }>;
  dataKey: string;
  type: 'bar' | 'pie';
  onTypeChange: (type: 'bar' | 'pie') => void;
}

const ChartComponent = ({ title, data, dataKey, type, onTypeChange }: ChartProps) => {
  const maxCount = Math.max(...data.map(d => d.count));
  const totalCount = data.reduce((sum, d) => sum + d.count, 0);

  if (data.length === 0) {
    return (
      <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-1">
            <span className="text-sm text-gray-600 px-2">Chart type:</span>
            <button
              onClick={() => onTypeChange('pie')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                type === 'pie' 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              🥧 Pie
            </button>
            <button
              onClick={() => onTypeChange('bar')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                type === 'bar' 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              📊 Bar
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-lg font-medium">No Data Available</p>
          <p className="text-sm">Try changing the filter or check back later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">Total: {totalCount.toLocaleString()} applications</p>
        </div>
        <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-1">
          <span className="text-sm text-gray-600 px-2">Chart type:</span>
          <button
            onClick={() => onTypeChange('pie')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              type === 'pie' 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            🥧 Pie
          </button>
          <button
            onClick={() => onTypeChange('bar')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              type === 'bar' 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            📊 Bar
          </button>
        </div>
      </div>
      
      {type === 'bar' ? (
        <div className="h-80 flex items-end space-x-3 bg-gray-50 rounded-lg p-4">
          {data.map((item, index) => {
            const percentage = (item.count / maxCount) * 100;
            const height = (item.count / maxCount) * 240;
            return (
              <div key={index} className="flex flex-col items-center flex-1 group">
                <div className="relative w-full">
                  <div 
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-300 hover:from-blue-600 hover:to-blue-500 shadow-lg" 
                    style={{ height: `${height}px` }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {item.count} ({percentage.toFixed(1)}%)
                    </div>
                    <div className="text-white text-sm font-bold p-2 text-center h-full flex items-center justify-center">
                      {item.count}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-700 mt-3 text-center break-words font-medium max-w-full">
                  {item[dataKey]}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg p-8">
          <div className="relative w-64 h-64">
            {data.map((item, index) => {
              const percentage = (item.count / data.reduce((sum, d) => sum + d.count, 0)) * 100;
              const angle = (data.slice(0, index).reduce((sum, d) => sum + d.count, 0) / data.reduce((sum, d) => sum + d.count, 0)) * 360;
              const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];
              return (
                <div
                  key={index}
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(from ${angle}deg, ${colors[index % colors.length]} ${percentage * 3.6}deg, transparent ${percentage * 3.6}deg)`,
                  }}
                />
              );
            })}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center bg-white rounded-full w-32 h-32 flex flex-col items-center justify-center shadow-lg">
                <div className="text-3xl font-bold text-gray-800">
                  {data.reduce((sum, d) => sum + d.count, 0)}
                </div>
                <div className="text-sm text-gray-500 font-medium">Total</div>
              </div>
            </div>
          </div>
          <div className="ml-8 space-y-2">
            {data.map((item, index) => {
              const percentage = (item.count / data.reduce((sum, d) => sum + d.count, 0)) * 100;
              const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];
              return (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: colors[index % colors.length] }}
                  ></div>
                  <span className="text-sm text-gray-700 font-medium">{item[dataKey]}</span>
                  <span className="text-sm text-gray-500">({percentage.toFixed(1)}%)</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    stateDistribution: [],
    districtDistribution: [],
    genderDistribution: [],
    classDistribution: [],
    degreeDistribution: [],
    fatherOccupationDistribution: [],
    fatherIncomeDistribution: [],
    instituteTypeDistribution: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [chartTypes, setChartTypes] = useState<Record<string, 'bar' | 'pie'>>({
    state: 'bar',
    district: 'bar',
    gender: 'bar',
    class: 'bar',
    degree: 'bar',
    occupation: 'bar',
    income: 'bar',
    institute: 'bar',
  });
  const [filter, setFilter] = useState('All');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      router.push('/admin/login');
      return;
    }

    const userData = JSON.parse(user);
    if (userData.role !== 'ADMIN' && userData.role !== 'REVIEWER' && userData.role !== 'SUPER_ADMIN') {
      router.push('/admin/login');
      return;
    }

    fetchAnalyticsData();
  }, [router, filter]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching analytics data for filter:', filter);
      
      // Fetch applications data directly
      const appsResponse = await fetch(`http://localhost:3001/applications?page=1&limit=1000`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (appsResponse.ok) {
        const data = await appsResponse.json();
        console.log('Applications API Response:', data);
        
        // Handle different response structures
        let applicationsData = [];
        if (data.data && data.data.applications) {
          applicationsData = data.data.applications;
        } else if (data.applications) {
          applicationsData = data.applications;
        } else if (Array.isArray(data)) {
          applicationsData = data;
        } else if (data.data && Array.isArray(data.data)) {
          applicationsData = data.data;
        }
        
        console.log('Applications data for analytics:', applicationsData);
        
        // Filter applications based on status
        let filteredApplications = applicationsData;
        if (filter !== 'All') {
          filteredApplications = applicationsData.filter(app => {
            const status = app.status;
            return status === filter;
          });
        }
        
        console.log('Filtered applications:', filteredApplications);
        
        if (filteredApplications.length > 0) {
          const processedData = processAnalyticsData(filteredApplications);
          console.log('Processed analytics data:', processedData);
          setAnalyticsData(processedData);
        } else {
          console.log('No applications found for filter:', filter);
          setAnalyticsData({
            stateDistribution: [],
            districtDistribution: [],
            genderDistribution: [],
            classDistribution: [],
            degreeDistribution: [],
            fatherOccupationDistribution: [],
            fatherIncomeDistribution: [],
            instituteTypeDistribution: [],
          });
        }
      } else {
        console.error('Failed to fetch applications:', appsResponse.status);
        setError('Failed to fetch applications data');
        // Fallback to mock data
        setAnalyticsData(getMockAnalyticsData());
      }
    } catch (err: any) {
      console.error('Failed to fetch analytics data:', err);
      setError(err.message || 'Failed to fetch analytics data');
      // Use mock data as fallback
      setAnalyticsData(getMockAnalyticsData());
    } finally {
      setLoading(false);
    }
  };

  const processAnalyticsData = (applications: any[]): AnalyticsData => {
    // State distribution
    const stateCount: Record<string, number> = {};
    const districtCount: Record<string, number> = {};
    const genderCount: Record<string, number> = {};
    const classCount: Record<string, number> = {};
    const degreeCount: Record<string, number> = {};
    const occupationCount: Record<string, number> = {};
    const incomeCount: Record<string, number> = {};
    const instituteCount: Record<string, number> = {};

    applications.forEach(app => {
      // State distribution
      const state = app.student?.state || 'Unknown';
      stateCount[state] = (stateCount[state] || 0) + 1;

      // District distribution (using city as district)
      const district = app.student?.city || 'Unknown';
      districtCount[district] = (districtCount[district] || 0) + 1;

      // Gender distribution
      const gender = app.applicationData?.personalInfo?.gender || 'Unknown';
      genderCount[gender] = (genderCount[gender] || 0) + 1;

      // Class distribution
      const currentYear = app.applicationData?.educationInfo?.currentYear;
      const classType = currentYear ? `Year ${currentYear}` : 'Unknown';
      classCount[classType] = (classCount[classType] || 0) + 1;

      // Degree distribution
      const course = app.applicationData?.educationInfo?.currentCourse || 'Unknown';
      degreeCount[course] = (degreeCount[course] || 0) + 1;

      // Father occupation
      const occupation = app.applicationData?.familyInfo?.fatherOccupation || 'Unknown';
      occupationCount[occupation] = (occupationCount[occupation] || 0) + 1;

      // Father income
      const income = app.applicationData?.familyInfo?.fatherIncome || 0;
      const incomeRange = getIncomeRange(income);
      incomeCount[incomeRange] = (incomeCount[incomeRange] || 0) + 1;

      // Institute type (mock based on institution name)
      const institute = app.applicationData?.educationInfo?.currentInstitution || 'Unknown';
      const instituteType = getInstituteType(institute);
      instituteCount[instituteType] = (instituteCount[instituteType] || 0) + 1;
    });

    return {
      stateDistribution: Object.entries(stateCount).map(([state, count]) => ({ state, count })),
      districtDistribution: Object.entries(districtCount).map(([district, count]) => ({ district, count })),
      genderDistribution: Object.entries(genderCount).map(([gender, count]) => ({ gender, count })),
      classDistribution: Object.entries(classCount).map(([classType, count]) => ({ class: classType, count })),
      degreeDistribution: Object.entries(degreeCount).map(([degree, count]) => ({ degree, count })),
      fatherOccupationDistribution: Object.entries(occupationCount).map(([occupation, count]) => ({ occupation, count })),
      fatherIncomeDistribution: Object.entries(incomeCount).map(([incomeRange, count]) => ({ incomeRange, count })),
      instituteTypeDistribution: Object.entries(instituteCount).map(([type, count]) => ({ type, count })),
    };
  };

  const getIncomeRange = (income: number): string => {
    if (income < 100000) return '<1 L';
    if (income < 200000) return '1L-2L';
    if (income < 300000) return '2L-3L';
    if (income < 400000) return '3L-4L';
    if (income < 500000) return '4L-5L';
    return '>5L';
  };

  const getInstituteType = (institute: string): string => {
    if (institute.toLowerCase().includes('government') || institute.toLowerCase().includes('govt')) {
      return 'Government';
    }
    if (institute.toLowerCase().includes('aided')) {
      return 'Government Aided';
    }
    return 'Private';
  };

  const getMockAnalyticsData = (): AnalyticsData => ({
    stateDistribution: [
      { state: 'Tamil Nadu', count: 350 },
      { state: 'Karnataka', count: 70 },
    ],
    districtDistribution: [
      { district: 'Coimbatore', count: 130 },
      { district: 'Bangalore', count: 95 },
      { district: 'Salem', count: 25 },
      { district: 'Madurai', count: 18 },
      { district: 'Krishnagiri', count: 15 },
      { district: 'Tirunelveli', count: 10 },
      { district: 'Dharmapuri', count: 8 },
      { district: 'Vijayanagar', count: 7 },
      { district: 'Bijapur', count: 6 },
      { district: 'Nilgiris', count: 5 },
      { district: 'Vijayapura', count: 4 },
      { district: 'Chitradurga', count: 3 },
      { district: 'Pudukkottai', count: 2 },
      { district: 'Shimoga', count: 1 },
      { district: 'Udupi', count: 1 },
    ],
    genderDistribution: [
      { gender: 'Male', count: 330 },
      { gender: 'Female', count: 90 },
    ],
    classDistribution: [
      { class: 'Polytechnic/Diploma', count: 420 },
    ],
    degreeDistribution: [],
    fatherOccupationDistribution: [
      { occupation: 'Farmer', count: 78 },
      { occupation: 'Labourer', count: 49 },
      { occupation: 'Business', count: 43 },
      { occupation: 'Electrician', count: 35 },
      { occupation: 'Mechanic', count: 32 },
      { occupation: 'Engineer', count: 15 },
      { occupation: 'Salesperson', count: 13 },
      { occupation: 'Carpenter', count: 8 },
      { occupation: 'Chef', count: 7 },
      { occupation: 'Teacher', count: 6 },
      { occupation: 'Librarian', count: 5 },
      { occupation: 'Painter', count: 4 },
      { occupation: 'Pharmacist', count: 3 },
    ],
    fatherIncomeDistribution: [
      { incomeRange: '<1 L', count: 168 },
      { incomeRange: '1L-2L', count: 140 },
      { incomeRange: '2L-3L', count: 10 },
      { incomeRange: '4L-5L', count: 8 },
      { incomeRange: '>5L', count: 7 },
      { incomeRange: '3L-4L', count: 6 },
    ],
    instituteTypeDistribution: [
      { type: 'Private', count: 195 },
      { type: 'Government Aided', count: 190 },
      { type: 'Government', count: 38 },
    ],
  });

  const handleChartTypeChange = (chartKey: string, type: 'bar' | 'pie') => {
    setChartTypes(prev => ({ ...prev, [chartKey]: type }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="mr-6 text-white hover:text-blue-100 transition-colors duration-200 flex items-center space-x-2"
              >
                <span className="text-xl">←</span>
                <span className="font-medium">Back to Dashboard</span>
              </button>
              <div>
                <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
                <p className="text-blue-100 mt-1">Comprehensive insights into scholarship applications</p>
              </div>
            </div>
            <div className="text-white text-right">
              <div className="text-sm text-blue-100">Total Applications</div>
              <div className="text-2xl font-bold">
                {analyticsData.stateDistribution.reduce((sum, d) => sum + d.count, 0).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Filter Section */}
          <div className="bg-white shadow-lg rounded-xl p-6 mb-8 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Status</label>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="block w-48 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium"
                  >
                    <option value="All">📊 All Applications</option>
                    <option value="SUBMITTED">📝 Submitted</option>
                    <option value="UNDER_REVIEW">🔍 Under Review</option>
                    <option value="APPROVED">✅ Approved</option>
                    <option value="REJECTED">❌ Rejected</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={fetchAnalyticsData}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl flex items-center space-x-2"
                  >
                    <span>🔄</span>
                    <span>Apply Filter</span>
                  </button>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Current Filter</div>
                <div className="text-lg font-semibold text-gray-800">{filter}</div>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <span className="text-2xl">🏛️</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total States</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.stateDistribution.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100">
                  <span className="text-2xl">🏘️</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Districts</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.districtDistribution.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100">
                  <span className="text-2xl">👥</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Gender Groups</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.genderDistribution.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-orange-100">
                  <span className="text-2xl">🎓</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Degree Types</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.degreeDistribution.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* State Distribution */}
            <ChartComponent
              title="Distribution of applications by State"
              data={analyticsData.stateDistribution}
              dataKey="state"
              type={chartTypes.state}
              onTypeChange={(type) => handleChartTypeChange('state', type)}
            />

            {/* District Distribution */}
            <ChartComponent
              title="Distribution of applications by District"
              data={analyticsData.districtDistribution}
              dataKey="district"
              type={chartTypes.district}
              onTypeChange={(type) => handleChartTypeChange('district', type)}
            />

            {/* Gender Distribution */}
            <ChartComponent
              title="Distribution of applications by Gender"
              data={analyticsData.genderDistribution}
              dataKey="gender"
              type={chartTypes.gender}
              onTypeChange={(type) => handleChartTypeChange('gender', type)}
            />

            {/* Class Distribution */}
            <ChartComponent
              title="Distribution of applications by Present Class"
              data={analyticsData.classDistribution}
              dataKey="class"
              type={chartTypes.class}
              onTypeChange={(type) => handleChartTypeChange('class', type)}
            />

            {/* Degree Distribution */}
            <ChartComponent
              title="Distribution of applications by Degree"
              data={analyticsData.degreeDistribution}
              dataKey="degree"
              type={chartTypes.degree}
              onTypeChange={(type) => handleChartTypeChange('degree', type)}
            />

            {/* Father Occupation Distribution */}
            <ChartComponent
              title="Distribution of applications by Father Occupation"
              data={analyticsData.fatherOccupationDistribution}
              dataKey="occupation"
              type={chartTypes.occupation}
              onTypeChange={(type) => handleChartTypeChange('occupation', type)}
            />

            {/* Father Income Distribution */}
            <ChartComponent
              title="Distribution of applications by Father's Income"
              data={analyticsData.fatherIncomeDistribution}
              dataKey="incomeRange"
              type={chartTypes.income}
              onTypeChange={(type) => handleChartTypeChange('income', type)}
            />

            {/* Institute Type Distribution */}
            <ChartComponent
              title="Distribution of applications by Institute Type"
              data={analyticsData.instituteTypeDistribution}
              dataKey="type"
              type={chartTypes.institute}
              onTypeChange={(type) => handleChartTypeChange('institute', type)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
