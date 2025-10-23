import escpos = require('escpos');
const device = new escpos.Serial('/dev/ttyUSB0', { baudRate: 9600 });
const printer = new escpos.Printer(device);


type Item = { name: string; qty: number; unit: number; sub: number };


export async function printSaleTicket(data: {
company: string; branch: string; date: string; saleId: string; currency: string;
items: Item[]; subtotal: number; tax: number; total: number;
}) {
return new Promise<void>((resolve, reject) => {
device.open(() => {
printer.encode('cp858').align('CT').style('b')
.text(data.company).style('normal')
.text(data.branch)
.text('------------------------------')
.align('LT')
.text(`Venta: ${data.saleId}`)
.text(`Fecha: ${data.date}`)
.text('------------------------------');


data.items.forEach(i => {
printer.text(`${i.qty} x ${i.name}`)
.text(` ${i.unit.toFixed(2)} -> ${i.sub.toFixed(2)}`);
});


printer.text('------------------------------')
.text(`SubTotal: ${data.subtotal.toFixed(2)} ${data.currency}`)
.text(`Impuestos: ${data.tax.toFixed(2)} ${data.currency}`)
.style('b')
.text(`TOTAL: ${data.total.toFixed(2)} ${data.currency}`)
.style('normal')
.text('Gracias por su compra!')
.cut()
.close(() => resolve());
});
});
}