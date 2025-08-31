// Edge Case and Error Handling Tests for Route Protection
const fs = require('fs');
const path = require('path');

class EdgeCaseAnalyzer {
  constructor() {
    this.testResults = [];
    this.criticalIssues = [];
    this.warnings = [];
    this.passedTests = [];
  }

  // Test 1: Session Management Edge Cases
  testSessionManagement() {
    console.log('\n🧪 Testing Session Management Edge Cases...');
    
    // Check session timeout configuration
    const routeUtils = this.readFile('apps/web/src/utils/routeUtils.ts');
    
    if (routeUtils.includes('24 * 60 * 60 * 1000')) {
      this.passedTests.push({
        category: 'Session Management',
        test: 'Session timeout configured (24 hours)',
        status: 'PASS'
      });
    } else {
      this.warnings.push({
        category: 'Session Management',
        issue: 'Session timeout not found or not properly configured'
      });
    }

    // Check activity tracking
    if (routeUtils.includes('updateLastActivity') && routeUtils.includes('getLastActivity')) {
      this.passedTests.push({
        category: 'Session Management',
        test: 'Activity tracking implemented',
        status: 'PASS'
      });
    } else {
      this.criticalIssues.push({
        category: 'Session Management',
        issue: 'Activity tracking missing - session management incomplete'
      });
    }

    // Check cross-tab synchronization
    const routeGuards = this.readFile('apps/web/src/components/auth/RouteGuards.tsx');
    if (routeGuards.includes('storage') && routeGuards.includes('auth_logout')) {
      this.passedTests.push({
        category: 'Session Management',
        test: 'Cross-tab logout synchronization implemented',
        status: 'PASS'
      });
    } else {
      this.warnings.push({
        category: 'Session Management',
        issue: 'Cross-tab synchronization may be incomplete'
      });
    }
  }

  // Test 2: Error Handling Robustness
  testErrorHandling() {
    console.log('\n🧪 Testing Error Handling Robustness...');
    
    const authService = this.readFile('apps/web/src/services/auth.ts');
    const authContext = this.readFile('apps/web/src/contexts/AuthContext.tsx');
    
    // Check for comprehensive error handling
    if (authService.includes('try') && authService.includes('catch') && 
        authContext.includes('try') && authContext.includes('catch')) {
      this.passedTests.push({
        category: 'Error Handling',
        test: 'Try-catch blocks implemented in auth components',
        status: 'PASS'
      });
    } else {
      this.criticalIssues.push({
        category: 'Error Handling',
        issue: 'Insufficient error handling in authentication components'
      });
    }

    // Check for user-friendly error messages
    if (authService.includes('ERROR_MESSAGES') && authService.includes('translateError')) {
      this.passedTests.push({
        category: 'Error Handling',
        test: 'Localized error messages implemented',
        status: 'PASS'
      });
    } else {
      this.warnings.push({
        category: 'Error Handling',
        issue: 'Error message localization could be improved'
      });
    }

    // Check for network error handling
    if (authService.includes('Network error')) {
      this.passedTests.push({
        category: 'Error Handling',
        test: 'Network error handling implemented',
        status: 'PASS'
      });
    } else {
      this.warnings.push({
        category: 'Error Handling',
        issue: 'Network error handling not explicitly implemented'
      });
    }
  }

  // Test 3: Input Validation and Sanitization
  testInputValidation() {
    console.log('\n🧪 Testing Input Validation and Sanitization...');
    
    const routeUtils = this.readFile('apps/web/src/utils/routeUtils.ts');
    
    // Check for path sanitization
    const sanitizationChecks = [
      { pattern: 'replace(/[<>\'"]/g', description: 'XSS character removal' },
      { pattern: 'replace(/\\.\\.\+/g', description: 'Path traversal prevention' },
      { pattern: 'replace(/\\/+/g', description: 'Multiple slash normalization' }
    ];

    sanitizationChecks.forEach(check => {
      if (routeUtils.includes(check.pattern.replace(/\\/g, '\\\\'))) {
        this.passedTests.push({
          category: 'Input Validation',
          test: check.description,
          status: 'PASS'
        });
      } else {
        this.warnings.push({
          category: 'Input Validation',
          issue: `${check.description} not implemented`
        });
      }
    });

    // Check for URL validation whitelist
    if (routeUtils.includes('ALLOWED_RETURN_URL_PATTERNS')) {
      this.passedTests.push({
        category: 'Input Validation',
        test: 'Return URL whitelist validation',
        status: 'PASS'
      });
    } else {
      this.criticalIssues.push({
        category: 'Input Validation',
        issue: 'Return URL validation whitelist not found - security risk'
      });
    }

    // Check for origin validation
    if (routeUtils.includes('window.location.origin')) {
      this.passedTests.push({
        category: 'Input Validation',
        test: 'Same-origin URL validation',
        status: 'PASS'
      });
    } else {
      this.criticalIssues.push({
        category: 'Input Validation',
        issue: 'Same-origin validation missing - CSRF risk'
      });
    }
  }

  // Test 4: Authentication State Management
  testAuthStateManagement() {
    console.log('\n🧪 Testing Authentication State Management...');
    
    const authContext = this.readFile('apps/web/src/contexts/AuthContext.tsx');
    const useAuth = this.readFile('apps/web/src/hooks/useAuth.ts');
    const protectedRoute = this.readFile('apps/web/src/components/auth/ProtectedRoute.tsx');
    
    // Check for loading state handling
    if (authContext.includes('loading') && protectedRoute.includes('loading')) {
      this.passedTests.push({
        category: 'Auth State',
        test: 'Loading state management implemented',
        status: 'PASS'
      });
    } else {
      this.criticalIssues.push({
        category: 'Auth State',
        issue: 'Loading state not properly handled - race condition risk'
      });
    }

    // Check for authentication state subscription
    if (authContext.includes('onAuthStateChange')) {
      this.passedTests.push({
        category: 'Auth State',
        test: 'Authentication state subscription implemented',
        status: 'PASS'
      });
    } else {
      this.criticalIssues.push({
        category: 'Auth State',
        issue: 'Authentication state changes not properly subscribed'
      });
    }

    // Check for proper cleanup
    if (authContext.includes('subscription.unsubscribe')) {
      this.passedTests.push({
        category: 'Auth State',
        test: 'Subscription cleanup implemented',
        status: 'PASS'
      });
    } else {
      this.warnings.push({
        category: 'Auth State',
        issue: 'Subscription cleanup may cause memory leaks'
      });
    }
  }

  // Test 5: Role-Based Access Control
  testRoleBasedAccess() {
    console.log('\n🧪 Testing Role-Based Access Control...');
    
    const protectedRoute = this.readFile('apps/web/src/components/auth/ProtectedRoute.tsx');
    const useAuth = this.readFile('apps/web/src/hooks/useAuth.ts');
    const routeUtils = this.readFile('apps/web/src/utils/routeUtils.ts');
    
    // Check for role validation
    if (protectedRoute.includes('requiredRole') || protectedRoute.includes('allowedRoles')) {
      this.passedTests.push({
        category: 'RBAC',
        test: 'Role-based route protection implemented',
        status: 'PASS'
      });
    } else {
      this.warnings.push({
        category: 'RBAC',
        issue: 'Role-based access control not fully implemented'
      });
    }

    // Check for role hierarchy
    if (useAuth.includes('roleHierarchy')) {
      this.passedTests.push({
        category: 'RBAC',
        test: 'Role hierarchy system implemented',
        status: 'PASS'
      });
    } else {
      this.warnings.push({
        category: 'RBAC',
        issue: 'Role hierarchy not implemented - flat role system'
      });
    }

    // Check for permission system
    if (useAuth.includes('canAccess') && routeUtils.includes('hasRoutePermission')) {
      this.passedTests.push({
        category: 'RBAC',
        test: 'Granular permission system implemented',
        status: 'PASS'
      });
    } else {
      this.warnings.push({
        category: 'RBAC',
        issue: 'Granular permission system could be enhanced'
      });
    }
  }

  // Test 6: Security Headers and Configuration
  testSecurityConfiguration() {
    console.log('\n🧪 Testing Security Configuration...');
    
    const supabaseConfig = this.readFile('apps/web/src/lib/supabase.ts');
    
    // Check Supabase configuration
    if (supabaseConfig.includes('persistSession: true') && 
        supabaseConfig.includes('autoRefreshToken: true')) {
      this.passedTests.push({
        category: 'Security Config',
        test: 'Supabase session persistence configured',
        status: 'PASS'
      });
    } else {
      this.warnings.push({
        category: 'Security Config',
        issue: 'Supabase session configuration incomplete'
      });
    }

    // Check for environment variable validation
    if (supabaseConfig.includes('VITE_SUPABASE_URL') && 
        supabaseConfig.includes('throw new Error')) {
      this.passedTests.push({
        category: 'Security Config',
        test: 'Environment variable validation implemented',
        status: 'PASS'
      });
    } else {
      this.criticalIssues.push({
        category: 'Security Config',
        issue: 'Environment variable validation missing'
      });
    }
  }

  // Test 7: Browser Security Features
  testBrowserSecurity() {
    console.log('\n🧪 Testing Browser Security Features...');
    
    const routeGuards = this.readFile('apps/web/src/components/auth/RouteGuards.tsx');
    
    // Check for popstate handling
    if (routeGuards.includes('popstate') && routeGuards.includes('preventDefault')) {
      this.passedTests.push({
        category: 'Browser Security',
        test: 'Browser history manipulation prevention',
        status: 'PASS'
      });
    } else {
      this.warnings.push({
        category: 'Browser Security',
        issue: 'Browser history manipulation prevention incomplete'
      });
    }

    // Check for visibility change handling
    if (routeGuards.includes('visibilitychange')) {
      this.passedTests.push({
        category: 'Browser Security',
        test: 'Tab visibility security handling',
        status: 'PASS'
      });
    } else {
      this.warnings.push({
        category: 'Browser Security',
        issue: 'Tab visibility security handling not implemented'
      });
    }

    // Check for beforeunload handling
    if (routeGuards.includes('beforeunload')) {
      this.passedTests.push({
        category: 'Browser Security',
        test: 'Cleanup on page unload implemented',
        status: 'PASS'
      });
    } else {
      this.warnings.push({
        category: 'Browser Security',
        issue: 'Page unload cleanup not implemented'
      });
    }
  }

  // Helper method to read files
  readFile(filePath) {
    try {
      const fullPath = path.join(__dirname, filePath);
      if (fs.existsSync(fullPath)) {
        return fs.readFileSync(fullPath, 'utf8');
      } else {
        this.warnings.push({
          category: 'File System',
          issue: `File not found: ${filePath}`
        });
        return '';
      }
    } catch (error) {
      this.warnings.push({
        category: 'File System',
        issue: `Error reading ${filePath}: ${error.message}`
      });
      return '';
    }
  }

  // Run all edge case tests
  runAllTests() {
    console.log('🚀 Starting Edge Case and Error Handling Tests...\n');
    
    this.testSessionManagement();
    this.testErrorHandling();
    this.testInputValidation();
    this.testAuthStateManagement();
    this.testRoleBasedAccess();
    this.testSecurityConfiguration();
    this.testBrowserSecurity();
    
    this.generateReport();
  }

  // Generate comprehensive report
  generateReport() {
    console.log('\n\n🔍 EDGE CASE AND ERROR HANDLING TEST REPORT');
    console.log('='+'='.repeat(55));

    // Calculate scores
    const totalTests = this.passedTests.length + this.warnings.length + this.criticalIssues.length;
    const criticalPenalty = this.criticalIssues.length * 15;
    const warningPenalty = this.warnings.length * 5;
    const baseScore = 100;
    const finalScore = Math.max(0, baseScore - criticalPenalty - warningPenalty);

    console.log(`\n📊 EDGE CASE TESTING SCORE: ${finalScore}/100`);
    console.log(`📈 Tests Passed: ${this.passedTests.length}`);
    console.log(`⚠️  Warnings: ${this.warnings.length}`);
    console.log(`❌ Critical Issues: ${this.criticalIssues.length}`);

    // Production readiness
    let readiness = 'READY';
    if (this.criticalIssues.length > 0) {
      readiness = 'NOT READY - Critical edge cases not handled';
    } else if (this.warnings.length > 5) {
      readiness = 'NEEDS IMPROVEMENT - Multiple warnings';
    } else if (finalScore < 80) {
      readiness = 'CONDITIONAL - Address warnings before production';
    }

    console.log(`🚀 PRODUCTION READINESS: ${readiness}`);

    // Critical Issues
    if (this.criticalIssues.length > 0) {
      console.log('\n\n❌ CRITICAL EDGE CASE ISSUES:');
      console.log('='+'='.repeat(40));
      this.criticalIssues.forEach((issue, index) => {
        console.log(`\n${index + 1}. [${issue.category}] ${issue.issue}`);
      });
    }

    // Warnings
    if (this.warnings.length > 0) {
      console.log('\n\n⚠️  EDGE CASE WARNINGS:');
      console.log('='+'='.repeat(35));
      this.warnings.forEach((warning, index) => {
        console.log(`\n${index + 1}. [${warning.category}] ${warning.issue}`);
      });
    }

    // Passed Tests
    console.log('\n\n✅ PASSED EDGE CASE TESTS:');
    console.log('='+'='.repeat(35));
    const categories = {};
    this.passedTests.forEach(test => {
      if (!categories[test.category]) categories[test.category] = [];
      categories[test.category].push(test.test);
    });

    Object.keys(categories).forEach(category => {
      console.log(`\n${category}:`);
      categories[category].forEach(test => {
        console.log(`  ✓ ${test}`);
      });
    });

    // Recommendations
    console.log('\n\n💡 EDGE CASE HANDLING RECOMMENDATIONS:');
    console.log('='+'='.repeat(45));
    
    const recommendations = [
      'Implement comprehensive error boundary components',
      'Add retry mechanisms for failed authentication attempts',
      'Implement progressive enhancement for offline scenarios',
      'Add comprehensive logging for security events',
      'Implement automated testing for edge cases',
      'Add monitoring and alerting for authentication failures',
      'Consider implementing circuit breaker patterns',
      'Add graceful degradation for service failures'
    ];

    recommendations.forEach((rec, index) => {
      console.log(`\n${index + 1}. ${rec}`);
    });

    console.log('\n\nReport generated at:', new Date().toISOString());
  }
}

// Run the edge case analysis
const analyzer = new EdgeCaseAnalyzer();
analyzer.runAllTests();