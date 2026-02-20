/**
 * Basic API Test Script
 * 
 * Prueba rápida de los endpoints sin necesidad de Postman
 * Ejecutar con: ts-node tests/api.test.ts
 */

import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

interface TestResult {
  name: string;
  success: boolean;
  message: string;
  data?: any;
}

const results: TestResult[] = [];

const test = (name: string, fn: () => Promise<void>) => {
  return fn()
    .then(() => {
      results.push({ name, success: true, message: 'OK' });
      console.log(`✅ ${name}`);
    })
    .catch((error) => {
      const message = error.response?.data?.message || error.message;
      results.push({ name, success: false, message });
      console.log(`❌ ${name}: ${message}`);
    });
};

async function runTests() {
  console.log('🧪 Starting API tests...\n');

  let token = '';

  // Test 1: Health check
  await test('Health Check', async () => {
    const response = await axios.get(`${API_URL}/health`);
    if (response.status !== 200 || response.data.status !== 'ok') {
      throw new Error('Health check failed');
    }
  });

  // Test 2: Register new user
  await test('Register User', async () => {
    const response = await axios.post(`${API_URL}/auth/register`, {
      nombre: 'Test User',
      email: `test-${Date.now()}@example.com`,
      password: 'TestPassword123',
      ci: `V${Math.random().toString().slice(2, 10)}`,
      role: 'USUARIO',
    });

    if (!response.data.data.token) {
      throw new Error('No token received');
    }
    token = response.data.data.token;
  });

  // Test 3: Login user
  await test('Login User', async () => {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@hospital.com',
      password: 'admin123456',
    });

    if (!response.data.data.token) {
      throw new Error('No token received');
    }
    token = response.data.data.token;
  });

  // Test 4: Get current user
  await test('Get Current User', async () => {
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data.data.id) {
      throw new Error('No user data received');
    }
  });

  // Test 5: Invalid login
  await test('Invalid Login (should fail)', async () => {
    try {
      await axios.post(`${API_URL}/auth/login`, {
        email: 'nonexistent@example.com',
        password: 'wrongpassword',
      });
      throw new Error('Should have failed');
    } catch (error: any) {
      if (error.response?.status !== 401) {
        throw new Error('Should return 401 Unauthorized');
      }
    }
  });

  // Test 6: Missing auth header
  await test('Missing Auth Header (should fail)', async () => {
    try {
      await axios.get(`${API_URL}/auth/me`);
      throw new Error('Should have failed');
    } catch (error: any) {
      if (error.response?.status !== 401) {
        throw new Error('Should return 401 Unauthorized');
      }
    }
  });

  // Summary
  console.log('\n📊 Test Summary:');
  const passed = results.filter((r) => r.success).length;
  const total = results.length;
  console.log(`Passed: ${passed}/${total}`);

  if (passed === total) {
    console.log('\n🎉 All tests passed!');
  } else {
    console.log('\n⚠️  Some tests failed');
    results
      .filter((r) => !r.success)
      .forEach((r) => {
        console.log(`  - ${r.name}: ${r.message}`);
      });
  }
}

runTests().catch(console.error);
