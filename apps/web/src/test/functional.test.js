// Functional Test for Story 1.4 Core Data Management
// This is a basic validation test for QA purposes

// Test localStorage functionality
const testLocalStorage = () => {
  console.log('Testing localStorage functionality...');
  
  // Test customer data
  const testCustomer = {
    id: 'test-123',
    created_at: new Date().toISOString(),
    name: 'Test Company',
    email: 'test@company.com',
    phone: '02-123-4567'
  };

  // Store in localStorage
  localStorage.setItem('crm_customers', JSON.stringify([testCustomer]));
  
  // Retrieve from localStorage
  const retrieved = JSON.parse(localStorage.getItem('crm_customers'));
  
  if (retrieved && retrieved[0] && retrieved[0].name === 'Test Company') {
    console.log('✅ localStorage test passed');
    return true;
  } else {
    console.log('❌ localStorage test failed');
    return false;
  }
};

// Test data validation functions
const testValidation = () => {
  console.log('Testing form validation logic...');
  
  // Test customer validation
  const validateCustomer = (data) => {
    const errors = {};
    
    if (!data.name || data.name.trim().length === 0) {
      errors.name = 'ชื่อบริษัทห้ามเป็นค่าว่าง';
    }
    
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
    }
    
    if (!data.phone || data.phone.trim().length === 0) {
      errors.phone = 'เบอร์โทรศัพท์ห้ามเป็นค่าว่าง';
    }
    
    return errors;
  };

  // Test valid data
  const validData = {
    name: 'บริษัท ทดสอบ จำกัด',
    email: 'test@example.com',
    phone: '02-123-4567'
  };
  
  const validErrors = validateCustomer(validData);
  if (Object.keys(validErrors).length === 0) {
    console.log('✅ Valid data validation passed');
  } else {
    console.log('❌ Valid data validation failed');
    return false;
  }

  // Test invalid data
  const invalidData = {
    name: '',
    email: 'invalid-email',
    phone: ''
  };
  
  const invalidErrors = validateCustomer(invalidData);
  if (Object.keys(invalidErrors).length === 3) {
    console.log('✅ Invalid data validation passed');
    return true;
  } else {
    console.log('❌ Invalid data validation failed');
    return false;
  }
};

// Run tests when loaded
if (typeof window !== 'undefined') {
  console.log('Running functional tests for Story 1.4...');
  
  const localStorageTest = testLocalStorage();
  const validationTest = testValidation();
  
  if (localStorageTest && validationTest) {
    console.log('🎉 All functional tests passed!');
  } else {
    console.log('⚠️ Some functional tests failed');
  }
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testLocalStorage,
    testValidation
  };
}