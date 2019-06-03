import React, { Component } from 'react';
import fire from '../../Config/Config';
import AddStudent from '../AddStudent/AddStudent.jsx';
import LogoItesg from './../../Resources/escudo.png';
import LogoTec from '../../Resources/tec.png';
import LogoGto from '../../Resources/gto.png';
import apk from './Sistema_Votacion_ITESG.apk'

class Login extends Component {
    constructor() {
        super();
        this.state = {
            Numero_Control: '',
            Contraseña: '',
            statusView: true
        }
        this.handleChange = this.handleChange.bind(this);
        this.login = this.login.bind(this);
        this.viewState = this.viewState.bind(this);
    }
    login(e) {
        e.preventDefault();
        fire.auth().signInWithEmailAndPassword(this.state.Numero_Control + '@tecguanajuato.edu.mx', this.state.Contraseña).then(
            (u) => { }).catch((error) => {
                console.log(error);
            });
    }
    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    viewState() {
        if (this.state.statusView === true)
            this.setState({ statusView: false })
        else
            this.setState({ statusView: true })
    }
    render() {
        return (
            <div>
                {this.state.statusView ?
                    <div className="container text-center loginSize">
                        <div className="center card">
                            <div className="card-header">
                                <h2 className="text-primary">Inicio de Sesión</h2>
                                <br />
                                <img src={LogoItesg} alt="logo" width="150px" />
                            </div>
                            <div className="card-body jumbotron">
                                <table className="table">
                                    <tbody>
                                        <tr>
                                            <td className="text-primary text-right">
                                                Numero de Control:
                                        </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    onChange={this.handleChange}
                                                    name="Numero_Control"
                                                    className="form-control"
                                                    placeholder="Numero de Control"
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="text-primary text-right">
                                                Contraseña:
                                        </td>
                                            <td>
                                                <input
                                                    type="password"
                                                    name="Contraseña"
                                                    onChange={this.handleChange}
                                                    className="form-control"
                                                    placeholder="Contraseña"
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="btn-container text-center">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    onClick={this.login}
                                >Iniciar Sesión
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-link"
                                    onClick={this.viewState}
                                >Registrar</button>
                                <a 
                                    download={apk} 
                                    className="btn btn-link"
                                    href="#apk"
                                >Descargar Aplicación</a>
                            </div>

                            <div className="card-footer">
                                <img src={LogoTec} alt="logo" className="img-responsive" width="100px" />
                                <img src={LogoGto} alt="logo" className="img-responsive" width="100px" />
                            </div>
                        </div>

                    </div>
                    : <AddStudent />}
            </div>
        );
    }
}
export default Login;