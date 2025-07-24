const https = require('https');
const http = require('http');

// URLs a probar
const urls = [
  'http://localhost:8080',
  'https://ekokai-backend-zqwmi.ondigitalocean.app'
];

async function testConnection(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    
    const req = client.get(url, (res) => {
      console.log(`✅ ${url} - Status: ${res.statusCode}`);
      resolve({ url, status: res.statusCode, success: true });
    });

    req.on('error', (err) => {
      console.log(`❌ ${url} - Error: ${err.message}`);
      resolve({ url, error: err.message, success: false });
    });

    req.setTimeout(5000, () => {
      console.log(`⏰ ${url} - Timeout`);
      req.destroy();
      resolve({ url, error: 'Timeout', success: false });
    });
  });
}

async function testEndpoints(baseUrl) {
  const endpoints = [
    '/cupones',
    '/articulos',
    '/auth/login'
  ];

  console.log(`\n🔍 Probando endpoints en ${baseUrl}:`);
  
  for (const endpoint of endpoints) {
    const url = `${baseUrl}${endpoint}`;
    const client = baseUrl.startsWith('https') ? https : http;
    
    try {
      const result = await new Promise((resolve) => {
        const req = client.get(url, (res) => {
          resolve({ status: res.statusCode, success: true });
        });

        req.on('error', (err) => {
          resolve({ error: err.message, success: false });
        });

        req.setTimeout(3000, () => {
          req.destroy();
          resolve({ error: 'Timeout', success: false });
        });
      });

      if (result.success) {
        console.log(`  ✅ ${endpoint} - Status: ${result.status}`);
      } else {
        console.log(`  ❌ ${endpoint} - Error: ${result.error}`);
      }
    } catch (error) {
      console.log(`  ❌ ${endpoint} - Error: ${error.message}`);
    }
  }
}

async function main() {
  console.log('🔍 Probando conexión con el backend...\n');

  for (const url of urls) {
    const result = await testConnection(url);
    if (result.success) {
      await testEndpoints(url);
    }
  }

  console.log('\n📋 Resumen:');
  console.log('- Si ves ✅ en localhost:8080, el backend local está funcionando');
  console.log('- Si ves ✅ en la URL de Digital Ocean, el backend remoto está funcionando');
  console.log('- Si ves ❌ en ambos, hay problemas de conexión');
  console.log('\n💡 Para solucionar problemas:');
  console.log('1. Verifica que el backend esté corriendo en localhost:8080');
  console.log('2. Verifica tu conexión a internet');
  console.log('3. Verifica que el backend en Digital Ocean esté activo');
}

main().catch(console.error); 