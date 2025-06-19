import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import CartUtil from '../utils/CartUtil';
import withRouter from '../utils/withRouter';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import '../App';
import '../css/Mycart.css';

class Mycart extends Component {
  static contextType = MyContext;

  render() {
    const mycart = this.context.mycart.map((item, index) => (
      <tr key={item.product._id} className="cart-item">
        <td>{index + 1}</td>
        <td>{item.product._id}</td>
        <td>{item.product.name}</td>
        <td>{item.product.category.name}</td>
        <td>
          <img
            src={'data:image/jpg;base64,' + item.product.image}
            width="70px"
            height="70px"
            alt={item.product.name}
            className="cart-image"
          />
        </td>
        <td>{item.product.price.toLocaleString()}đ</td>
        <td>
          <input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) =>
              this.handleQuantityChange(item.product._id, parseInt(e.target.value))
            }
            className=" form-control-sm quantity-input"
          />
        </td>

        <td>{(item.product.price * item.quantity).toLocaleString()}đ</td>
        <td>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => this.lnkRemoveClick(item.product._id)}
          >
            <i className="fas fa-trash-alt"></i> Delete
          </button>
        </td>
      </tr>
    ));

    return (
      <div className="mycart-container">
        <div className="container">
          <h2 className="text-center my-4">Cart</h2>
          {this.context.mycart.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="thead-dark">
                  <tr>
                    <th>Number</th>
                    <th>ID</th>
                    <th>Name Product</th>
                    <th>Category</th>
                    <th>Image</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Cost</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>{mycart}</tbody>
                <tfoot>
                  <tr>
                    <td colSpan="7" className="text-right font-weight-bold">Total Cost:</td>
                    <td className="font-weight-bold">
                      {CartUtil.getTotal(this.context.mycart).toLocaleString()}đ
                    </td>
                    <td>
                      <button
                        className="btn btn-primary btn-block"
                        onClick={() => this.lnkPrintInvoiceClick()}
                      >
                        <i className="fas fa-print"></i> Print Invoice
                      </button>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="text-center my-5">
              <h4>Your cart is empty!</h4>
              <a href="/home" className="btn btn-primary mt-3">
                Continue shopping
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  handleQuantityChange(id, newQuantity) {
  if (newQuantity < 1 || isNaN(newQuantity)) return;
  const mycart = [...this.context.mycart];
  const index = mycart.findIndex((x) => x.product._id === id);
  if (index !== -1) {
    mycart[index].quantity = newQuantity;
    this.context.setMycart(mycart);
  }
}

  // Xử lý xóa sản phẩm khỏi giỏ hàng
  lnkRemoveClick(id) {
    const mycart = [...this.context.mycart];
    const index = mycart.findIndex((x) => x.product._id === id);
    if (index !== -1) {
      mycart.splice(index, 1);
      this.context.setMycart(mycart);
    }
  }

  // In hóa đơn PDF
  lnkPrintInvoiceClick() {
    const { mycart, customer } = this.context;

    if (!mycart || mycart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    const rows = mycart.map((item, index) => [
      index + 1,
      item.product.name,
      item.product.price.toLocaleString(),
      item.quantity,
      (item.product.price * item.quantity).toLocaleString(),
    ]);

    const total = mycart.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toLocaleString();
    const dateStr = new Date().toLocaleString();
    const customerName = customer?.name || 'N/A';
    const customerEmail = customer?.email || 'N/A';

    const doc = new jsPDF();
    console.log(typeof doc.autoTable); 
    doc.setFontSize(18);
    doc.text('PURCHASE INVOICE', 70, 20);
    doc.setFontSize(12);
    doc.text(`Date: ${dateStr}`, 14, 30);
    doc.text(`Customer: ${customerName}`, 14, 36);
    doc.text(`Email: ${customerEmail}`, 14, 42);

    // Thay đổi ở đây: gọi autoTable(doc, options) thay vì doc.autoTable(...)
    autoTable(doc, {
      head: [['No.', 'Product Name', 'Unit Price', 'Quantity', 'Subtotal']],
      body: rows,
      startY: 50,
    });

    const finalY = doc.lastAutoTable?.finalY || 60;
    doc.text(`Total: ${total} VND`, 140, finalY + 10);

    doc.save('invoice.pdf');
  }
}

export default withRouter(Mycart);
