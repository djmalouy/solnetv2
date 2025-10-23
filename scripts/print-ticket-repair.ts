import escpos = require('escpos');
// Seleccionar adaptador correcto según conexión:
// const device = new escpos.USB();
const device = new escpos.Serial('/dev/ttyUSB0', { baudRate: 9600 });
const printer = new escpos.Printer(device);


export async function printRepairTicket(data: {
company: string; branch: string; ticket: string; date: string;
customer: string; phone?: string; device: string; notes?: string; deposit?: string;
}) {
return new Promise<void>((resolve, reject) => {
device.open(() => {
printer
.encode('cp858')
.font('a').align('CT').style('b').size(1,1)
.text(data.company)
.style('normal').size(0,0)
.text(data.branch)
.text('------------------------------')
.align('LT')
.text(`Ticket: ${data.ticket}`)
.text(`Fecha: ${data.date}`)
.text(`Cliente: ${data.customer}`)
.text(`Tel: ${data.phone ?? '-'}`)
.text(`Equipo: ${data.device}`)
.text(`Seña: ${data.deposit ?? '0,00'}`)
.text('Notas:')
.text(data.notes ?? '-')
.text('------------------------------')
.align('CT').qrcode(data.ticket, 1, 6, 'l')
.cut()
.close(() => resolve());
});
});
}