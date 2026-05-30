1. DownBot Flow Chart
2. El bot responde?
    2.1 Si de forma correcta
    2.2 Si pero con error
        2.2.1 Validar vigencia de los access tokens y conexion con la vps, que el bot haga fetch a los tokens presentes en la mongo db del vps: Si estan expirados actualizarlos en el mongo db entrando a echo usando claude. Funciona ok?
            2.2.1.1 Si - Listo
            2.2.1.2 No - Entrar a claude en el puente del bot, corregir con claude de acuerdo al error y logs
    2.3 No responde
        2.3.1 Tenemos conexión al puente?
            2.3.1.1 Sí
                2.3.1.1 El robot responde por el Tui?
                    2.3.1.1.1 Si, problema de Gateway o canales
                        2.3.1.1.1.1 correr: openclaw gateway restart esperar 1-3 minutos, intentar contactar al bot por whatsapp/tg [Matssa y Argos esperar hasta 5 min]
                        2.3.1.1.1.2 en caso de no funcionar: volver a escanear QR WhatsApp y luego openclaw gateway restart

            2.3.1.2 No = Posible caida de la mini pc o internet