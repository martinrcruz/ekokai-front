const https = require('https');
const http = require('http');

// Configuración
const config = {
  local: 'http://localhost:8080',
  remote: 'https://ekokai-backend-zqwmi.ondigitalocean.app',
  credentials: {
    email: 'admin@correo.com',
    password: 'admin123'
  }
};

async function makeRequest(url, options = {}) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    
    const req = client.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData, success: true });
        } catch (e) {
          resolve({ status: res.statusCode, data: data, success: true });
        }
      });
    });

    req.on('error', (err) => {
      resolve({ error: err.message, success: false });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ error: 'Timeout', success: false });
    });

    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function testAuth(baseUrl) {
  console.log(`\n🔐 Probando autenticación en ${baseUrl}:`);
  
  // 1. Probar login
  const loginData = JSON.stringify(config.credentials);
  const loginResult = await makeRequest(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: loginData
  });

  if (loginResult.success && loginResult.status === 200) {
    console.log('  ✅ Login exitoso');
    console.log('  📝 Token obtenido:', loginResult.data.token ? 'SÍ' : 'NO');
    
    if (loginResult.data.token) {
      // 2. Probar endpoint protegido con token
             const protectedResult = await makeRequest(`${baseUrl}/cupones`, {
         method: 'GET',
         headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${loginResult.data.token}`,
           'Accept': 'application/json'
         }
       });

      if (protectedResult.success) {
        if (protectedResult.status === 200) {
          console.log('  ✅ Endpoint protegido accesible');
          console.log('  📊 Cupones obtenidos:', protectedResult.data.length || 0);
        } else {
          console.log(`  ❌ Endpoint protegido falló - Status: ${protectedResult.status}`);
        }
      } else {
        console.log('  ❌ Error en endpoint protegido:', protectedResult.error);
      }

      // 3. Probar endpoint de artículos
             const articulosResult = await makeRequest(`${baseUrl}/articulos`, {
         method: 'GET',
         headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${loginResult.data.token}`,
           'Accept': 'application/json'
         }
       });

      if (articulosResult.success) {
        if (articulosResult.status === 200) {
          console.log('  ✅ Endpoint de artículos accesible');
          console.log('  📊 Artículos obtenidos:', articulosResult.data.articulos?.length || 0);
        } else {
          console.log(`  ❌ Endpoint de artículos falló - Status: ${articulosResult.status}`);
        }
      } else {
        console.log('  ❌ Error en endpoint de artículos:', articulosResult.error);
      }
    }
  } else {
    console.log('  ❌ Login falló');
    if (loginResult.error) {
      console.log('  📝 Error:', loginResult.error);
    } else if (loginResult.data) {
      console.log('  📝 Respuesta:', loginResult.data);
    }
  }
}

async function main() {
  console.log('🔍 Probando conexión y autenticación con el backend...\n');

  // Probar conexión básica
  console.log('=== CONEXIÓN BÁSICA ===');
  for (const [name, url] of Object.entries({ local: config.local, remote: config.remote })) {
    const healthResult = await makeRequest(`${url}/health`);
    if (healthResult.success) {
      console.log(`✅ ${name} (${url}) - Status: ${healthResult.status}`);
    } else {
      console.log(`❌ ${name} (${url}) - Error: ${healthResult.error}`);
    }
  }

  // Probar autenticación
  console.log('\n=== AUTENTICACIÓN ===');
  await testAuth(config.local);
  await testAuth(config.remote);

  console.log('\n📋 Resumen:');
  console.log('- Si ves ✅ en login, la autenticación funciona');
  console.log('- Si ves ✅ en endpoints protegidos, la autorización funciona');
  console.log('- Si ves ❌, hay problemas de configuración');
  console.log('\n💡 Para solucionar problemas:');
  console.log('1. Verifica que las credenciales sean correctas');
  console.log('2. Verifica que el backend tenga usuarios administradores');
  console.log('3. Verifica que los endpoints estén configurados correctamente');
}

main().catch(console.error); 