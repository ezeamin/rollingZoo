import React, { Component } from "react";
import { Form } from "react-bootstrap";
import "./itemPrecios.css";

class ItemPrecios extends Component {
  state = {
    actual: 0,
    id: `precio_${this.props.plan}`,
    precio: "",
    error: false,
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  verificar(value) {
    if(isNaN(value) || value.trim() === "" || Number.parseFloat(value) < 0) {
      this.setState({error: true});
      document.getElementById(this.state.id).className = "admin__precios-item-input admin__precios-item-input-invalid";
      return false;
    } 

    this.setState({error: false});
    document.getElementById(this.state.id).className = "admin__precios-item-input";
    return true;
  }

  handleBlur = (e) => {
    const value = e.target.value;
    this.verificar(value);
  };

  handleSubmit = (e) => {
    e.preventDefault();

    if(!this.verificar(this.state.precio)){
      //console.log("error");
      return;
    }
  };


  render() {
    return (
      <div className="col-md-12 col-lg-4">
        <div className="admin__precios-item">
          <div className="admin__precios-item-info">
            <h3 className="admin__precios-item__titulo">{this.props.plan}</h3>
            <p className="admin__precios-item__descripcion mb-0">
              Actual: ${this.state.actual}
            </p>
          </div>
          <Form className="admin__precios-item-new" onSubmit={(e)=>this.handleSubmit(e)}>
              <input
                type="number"
                placeholder="Nuevo precio"
                name="precio"
                id={this.state.id}
                className="admin__precios-item-input"
                value={this.state.precio}
                onChange={(e) => this.handleChange(e)}
                onBlur={(e) => this.handleBlur(e)}
              />
            <button className="admin__precios-item-btn" type="submit">
              <i className="fas fa-save"></i>
            </button>
          </Form>
        </div>
      </div>
    );
  }
}

export default ItemPrecios;