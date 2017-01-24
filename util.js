function email (email) {
  var e, r, n, i, a = email;
  for (e = "", r = parseInt(a.substr(0, 2), 16), n = 2; a.length - n; n += 2) {
    i = parseInt(a.substr(n, 2), 16) ^ r, e += String.fromCharCode(i);
  }
  return e;
}

function getCategory (s) {
  var mapping = {
    "PC de Escritorio": 7,
    "Laptop": 8,
    "Microprocesador": 9,
    "Monitor": 10,
    "Motherboard": 11,
    "Memoria RAM/FLASH": 12,
    "Disco Duro Interno/Externo": 13,
    "Chasis/Fuente": 14,
    "Tarjeta de Video": 15,
    "Tarjeta de Sonido/Bocinas": 16,
    "Quemador/Lector DVD/CD": 17,
    "Backup/UPS": 18,
    "Impresora/Cartuchos": 19,
    "Modem/Wifi/Red": 20,
    "Webcam/Microf/AudÃ­fono": 21,
    "Teclado/Mouse": 22,
    "Internet/Email": 23,
    "CD/DVD Virgen": 24,
    "Otros": 25,
    "Carros": 26,
    "Motos": 27,
    "Bicicletas": 28,
    "Piezas/Accesorios": 29,
    "Alquiler": 30,
    "MecÃ¡nico": 31,
    "Otros": 32,
    "Celulares/LÃ­neas/Accesorios": 33,
    "Reproductor MP3/MP4/IPOD": 34,
    "Reproductor DVD/VCD/DVR": 35,
    "Televisor": 36,
    "CÃ¡mara Foto/Video": 37,
    "Aire Acondicionado": 38,
    "Consola Videojuego/Juegos": 39,
    "SatÃ©lite": 40,
    "ElectrodomÃ©sticos": 41,
    "Muebles/DecoraciÃ³n": 42,
    "Ropa/Zapato/Accesorios": 43,
    "Intercambio/Regalo": 44,
    "Divisas": 45,
    "Mascotas/Animales": 46,
    "Libros/Revistas": 47,
    "Joyas/Relojes": 48,
    "Antiguedades/ColecciÃ³n": 49,
    "Implementos Deportivos": 50,
    "Arte": 51,
    "Otros": 52,
    "Ofertas de empleo": 53,
    "Busco empleo": 54,
    "Clases/Cursos": 55,
    "InformÃ¡tica/ProgramaciÃ³n": 56,
    "PelÃ­culas/Series/Videos": 57,
    "Limpieza/DomÃ©stico": 58,
    "Foto/Video": 59,
    "ConstrucciÃ³n/Mantenimiento": 60,
    "ReparaciÃ³n ElectrÃ³nica": 61,
    "PeluquerÃ­a/BarberÃ­a/Belleza": 62,
    "Restaurantes/GastronomÃ­a": 63,
    "DiseÃ±o/DecoraciÃ³n": 64,
    "MÃºsica/AnimaciÃ³n/Shows": 65,
    "Relojero/Joyero": 66,
    "Gimnasio/Masaje/Entrenador": 67,
    "Otros": 68,
    "Compra/Venta": 69,
    "Permuta": 70,
    "Alquiler a cubanos": 71,
    "Alquiler a extranjeros": 72,
    "Casa en la playa": 73
  }

  return mapping[s]; 
}

module.exports = {
  email: email,
  getCategory: getCategory
};