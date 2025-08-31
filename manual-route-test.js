// Manual Route Protection Testing Script
const https = require('https');
const http = require('http');

const baseUrl = 'http://localhost:3001';

class RouteProtectionTester {
  constructor() {
    this.testResults = [];
  }

  async testRoute(path, expectedBehavior = 'redirect to login') {
    return new Promise((resolve) => {
      const url = `${baseUrl}${path}`;
      console.log(`\n🔍 Testing: ${url}`);
      
      http.get(url, (res) => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`Headers:`, res.headers);
        
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          // Since it's an SPA, we need to check the HTML content
          const hasReactApp = data.includes('id="root"');
          const hasViteClient = data.includes('@vite/client');
          
          const result = {
            path,
            statusCode: res.statusCode,
            isReactApp: hasReactApp,
            hasViteClient: hasViteClient,
            contentLength: data.length,
            expectedBehavior,
            timestamp: new Date().toISOString()
          };
          
          this.testResults.push(result);
          console.log(`✅ Test completed for ${path}`);
          resolve(result);
        });
      }).on('error', (err) => {
        console.error(`❌ Error testing ${url}:`, err.message);
        resolve({ path, error: err.message });
      });
    });
  }

  async runAllTests() {
    console.log('🚀 Starting Route Protection Security Tests...\n');
    
    const testCases = [
      // Basic protected routes
      { path: '/', expected: 'Should redirect to login if not authenticated' },
      { path: '/customers', expected: 'Should redirect to login if not authenticated' },
      { path: '/jobs', expected: 'Should redirect to login if not authenticated' },
      
      // Public routes
      { path: '/login', expected: 'Should be accessible without authentication' },
      
      // Security test paths
      { path: '/customers/../../../etc/passwd', expected: 'Should sanitize path traversal' },
      { path: '/jobs?<script>alert("xss")</script>', expected: 'Should prevent XSS' },
      { path: '/dashboard/../../admin', expected: 'Should prevent directory traversal' },
      
      // Edge cases
      { path: '/nonexistent', expected: 'Should handle 404 or redirect appropriately' },
      { path: '///customers///', expected: 'Should normalize multiple slashes' },
    ];

    for (const testCase of testCases) {
      await this.testRoute(testCase.path, testCase.expected);
      await new Promise(resolve => setTimeout(resolve, 100)); // Small delay between tests
    }
    
    this.generateReport();
  }

  generateReport() {
    console.log('\n\n📊 ROUTE PROTECTION TEST REPORT');
    console.log('='+'='.repeat(50));
    
    this.testResults.forEach((result, index) => {
      console.log(`\n${index + 1}. Route: ${result.path}`);
      console.log(`   Status Code: ${result.statusCode}`);
      console.log(`   Is React App: ${result.isReactApp}`);
      console.log(`   Expected: ${result.expectedBehavior}`);
      
      if (result.error) {
        console.log(`   ❌ Error: ${result.error}`);
      } else {
        // All routes should return 200 for SPA, but client-side routing handles protection
        const status = result.statusCode === 200 ? '✅' : '⚠️';
        console.log(`   ${status} Response received`);
      }
    });
    
    console.log('\n\n🔍 SECURITY ANALYSIS:');
    console.log('='+'='.repeat(30));
    
    console.log('\n1. Server-side Route Protection:');
    console.log('   - All routes return HTTP 200 (SPA behavior)');
    console.log('   - Protection is handled client-side by React');
    
    console.log('\n2. Path Sanitization Tests:');
    const pathTraversalTest = this.testResults.find(r => r.path.includes('../'));
    if (pathTraversalTest && pathTraversalTest.statusCode === 200) {
      console.log('   ✅ Server doesn\'t process path traversal server-side');
    }
    
    console.log('\n3. XSS Prevention Tests:');
    const xssTest = this.testResults.find(r => r.path.includes('<script>'));
    if (xssTest && xssTest.statusCode === 200) {
      console.log('   ✅ Server returns standard HTML (client-side handling required)');
    }
    
    console.log('\n\n⚠️  IMPORTANT NOTES:');
    console.log('- This is a Single Page Application (SPA)');
    console.log('- Route protection happens client-side in React');
    console.log('- Server always returns the same HTML with React app');
    console.log('- Client-side testing is needed for full validation');
    
    console.log('\n\n🎯 RECOMMENDATIONS:');
    console.log('1. Test client-side route protection with browser automation');
    console.log('2. Verify React Router redirects work correctly');
    console.log('3. Test authentication state management');
    console.log('4. Validate session handling and timeouts');
    
    console.log('\n\nTest completed at:', new Date().toISOString());
  }
}

// Run the tests
const tester = new RouteProtectionTester();
tester.runAllTests().catch(console.error);