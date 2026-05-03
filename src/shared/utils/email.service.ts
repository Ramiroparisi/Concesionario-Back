import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ramiroparisi678@gmail.com',
    pass: process.env.NODEMAILER_PASS
  }
});

export const enviarEmailsReserva = async (reserva: any, vehiculoNombre: string) => {
  const mailOptions = {
    from: '"Parisi Motors" <ramiroparisi678@gmail.com>',
    to: [reserva.mail, 'ramiroparisi678@gmail.com'],
    subject: `Confirmación de Reserva - ${vehiculoNombre} - ${reserva.vehiculo.id}`,
    html: `
      <h1>¡Hola ${reserva.nombreCli}!</h1>
      <p>Hemos recibido tu pago por la reserva del vehículo <strong>${vehiculoNombre}</strong>.</p>
      <ul>
        <li><strong>Importe señado:</strong> $${reserva.importe}</li>
        <li><strong>DNI:</strong> ${reserva.dni}</li>
        <li><strong>ID de Pago:</strong> ${reserva.mp_payment_id}</li>
      </ul>
      <p>Nos pondremos en contacto contigo a la brevedad al teléfono ${reserva.telefono}.</p>
    `
  };

  return transporter.sendMail(mailOptions);
};