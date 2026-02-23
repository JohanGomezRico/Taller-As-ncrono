import nodemailer, { Transporter } from "nodemailer";

const TAMAÑO_LOTE: number = 10;
const TOTAL_CORREOS_A_SIMULAR: number = 50;

async function iniciarSistemaDeCorreos(): Promise<void> {
    console.log("Configurando servidor SMTP...");

    // Crear cuenta de prueba (solo desarrollo)
    const testAccount = await nodemailer.createTestAccount();

    // Crear Transporter con POOL
    const transporter: Transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        pool: true,
        maxConnections: 5,
        maxMessages: 100,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });

    console.log("Servidor listo. Generando lista de destinatarios...");

    const listaDestinatarios: string[] = [];

    for (let i = 1; i <= TOTAL_CORREOS_A_SIMULAR; i++) {
        listaDestinatarios.push(`usuario${i}@ejemplo.com`);
    }

    console.time("Tiempo de Envío");

    for (let i = 0; i < listaDestinatarios.length; i += TAMAÑO_LOTE) {

        const lote = listaDestinatarios.slice(i, i + TAMAÑO_LOTE);
        console.log(`Enviando lote ${i / TAMAÑO_LOTE + 1} (${lote.length} correos)...`);

        const promesasDeEnvio = lote.map((destinatario) =>
            transporter.sendMail({
                from: '"Sistema Node" <no-reply@miempresa.com>',
                to: destinatario,
                subject: "Hola Aviso Importante",
                text: `Hola ${destinatario}, este es un mensaje masivo de prueba.`,
                html: `<b>Hola ${destinatario}</b>, este es un mensaje masivo de prueba.`,
            })
        );

        await Promise.all(promesasDeEnvio);

        console.log("Lote completado.");
    }

    console.timeEnd("Tiempo de Envío");

    console.log("Todos los correos han sido procesados.");

    const info = await transporter.sendMail({
        to: "test@test.com",
        subject: "Test",
        text: "Hola gente"
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);

    console.log("Ver ejemplo del correo aquí:");
    console.log(previewUrl);

    await transporter.close();
}

iniciarSistemaDeCorreos().catch(console.error);