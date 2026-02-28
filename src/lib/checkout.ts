type InvoiceItem = {
  name: string;
  quantity: number;
  price: number;
};

type InvoiceTotals = {
  subtotal: number;
  discount: number;
  gst: number;
  shipping: number;
  total: number;
};

type InvoiceAddress = {
  name: string;
  address_line: string;
  city: string;
};

type InvoicePayload = {
  orderId: number;
  items: InvoiceItem[];
  totals: InvoiceTotals;
  address: InvoiceAddress;
  companyDetails?: any;
};

export const buildInvoiceHtml = ({ orderId, items, totals, address, companyDetails }: InvoicePayload) => {
  const rows = items
    .map(
      (item: InvoiceItem) => `
      <tr>
        <td style="padding:8px 0;">${item.name}</td>
        <td style="padding:8px 0; text-align:right;">${item.quantity}</td>
        <td style="padding:8px 0; text-align:right;">₹${item.price}</td>
        <td style="padding:8px 0; text-align:right;">₹${item.price * item.quantity}</td>
      </tr>`
    )
    .join('');

  const companyHeader = companyDetails ? `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
            <div>
                ${companyDetails.logo_url ? `<img src="${companyDetails.logo_url}" alt="Logo" style="max-height: 60px; margin-bottom: 12px;"/>` : ''}
                <h1 style="margin: 0; font-size: 24px; color: #111827;">${companyDetails.company_name || 'PackMyCake'}</h1>
                <p style="margin: 4px 0 0; font-size: 14px; color: #4b5563;">
                    ${companyDetails.address_line ? companyDetails.address_line + '<br/>' : ''}
                    ${companyDetails.city ? companyDetails.city + ', ' : ''}${companyDetails.state ? companyDetails.state + ' - ' : ''}${companyDetails.zip_code || ''}<br/>
                    ${companyDetails.country || ''}
                </p>
            </div>
            <div style="text-align: right; font-size: 14px; color: #4b5563;">
                ${companyDetails.phone ? `Phone: ${companyDetails.phone}<br/>` : ''}
                ${companyDetails.email ? `Email: ${companyDetails.email}<br/>` : ''}
                ${companyDetails.gst_number ? `GSTIN: ${companyDetails.gst_number}<br/>` : ''}
                ${companyDetails.pan_no ? `PAN: ${companyDetails.pan_no}` : ''}
            </div>
        </div>
    ` : `<h2>PackMyCake Invoice</h2>`;

  return `
  <div style="font-family: Inter, sans-serif; padding: 24px; color: #1f2937; max-width: 800px; margin: 0 auto;">
    ${companyHeader}
    
    <div style="display: flex; justify-content: space-between; border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb; padding: 16px 0; margin-bottom: 24px;">
        <div>
            <p style="margin: 0 0 4px; font-weight: 600; font-size: 14px;">Billed To:</p>
            <p style="margin: 0; color: #4b5563; font-size: 14px;">
                ${address.name}<br/>
                ${address.address_line}<br/>
                ${address.city}
            </p>
        </div>
        <div style="text-align: right;">
            <p style="margin: 0 0 4px; font-weight: 600; font-size: 14px;">Invoice / Order Details:</p>
            <p style="margin: 0; color: #4b5563; font-size: 14px;">
                <strong>Order ID:</strong> #${orderId}<br/>
                <strong>Date:</strong> ${new Date().toLocaleDateString()}
            </p>
        </div>
    </div>
    <table style="width:100%; border-collapse: collapse; margin-top: 16px;">
      <thead>
        <tr>
          <th style="text-align:left; padding-bottom:8px; border-bottom:1px solid #e5e7eb;">Item</th>
          <th style="text-align:right; padding-bottom:8px; border-bottom:1px solid #e5e7eb;">Qty</th>
          <th style="text-align:right; padding-bottom:8px; border-bottom:1px solid #e5e7eb;">Price</th>
          <th style="text-align:right; padding-bottom:8px; border-bottom:1px solid #e5e7eb;">Total</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <div style="margin-top:16px; text-align:right;">
      <p>Subtotal: ₹${totals.subtotal}</p>
      <p>Discount: ₹${totals.discount}</p>
      <p>GST: ₹${totals.gst}</p>
      <p>Shipping: ₹${totals.shipping}</p>
      <p style="font-weight:600;">Grand Total: ₹${totals.total}</p>
    </div>
  </div>`;
};

export const downloadInvoice = ({ orderId, items, totals, address, companyDetails }: InvoicePayload) => {
  const html = buildInvoiceHtml({ orderId, items, totals, address, companyDetails });
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `PackMyCake-Invoice-${orderId}.html`;
  link.click();
  URL.revokeObjectURL(url);
};
