#!/usr/bin/env python
import http.server
import socketserver
import os

# Configuración del servidor
PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def end_headers(self):
        # Agregar cabeceras para desarrollo
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def log_message(self, format, *args):
        # Mejorar el formato del log
        message = "%s - %s" % (self.address_string(), format % args)
        print(f"\033[94m[INFO]\033[0m {message}")

def run_server(port=PORT):
    try:
        with socketserver.TCPServer(("", port), Handler) as httpd:
            print(f"\n\033[92m[SERVIDOR INICIADO]\033[0m Sitio web iCornudo disponible en:")
            print(f"\033[96m➤ http://localhost:{port}\033[0m")
            print(f"\033[93m[PRESIONA CTRL+C PARA DETENER]\033[0m\n")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\033[91m[SERVIDOR DETENIDO]\033[0m Gracias por usar el servidor de desarrollo iCornudo\n")
    except OSError as e:
        if "Address already in use" in str(e):
            print(f"\n\033[91m[ERROR]\033[0m El puerto {port} ya está en uso. Intenta con otro puerto.")
            run_server(port + 1)  # Probar con el siguiente puerto
        else:
            print(f"\n\033[91m[ERROR]\033[0m {e}")

if __name__ == "__main__":
    run_server()
