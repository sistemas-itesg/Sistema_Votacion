import React, {Component} from 'react';
import fire from '../../Config/Config';
import {Modal} from 'react-bootstrap';
import UpdateContest from './../UpdateContest/UpdateContest';
class ContestRecords extends Component
{
    constructor(props)
    {
        super(props);
        this.state=
        {
            updateVisibility:false
        }
        this.visibility=this.visibility.bind(this)

    }

    handleRemove()
    {
        if(window.confirm('¿Esta seguro de que quiere eliminar este registro?'))
            fire.database().ref('Evento').child(this.props.Id).remove().then(()=>{
                window.alert('Registro Eliminado Exitosamente!!, Refresque la pagina para ver el cambio')
            }).catch(error=>{
                window.alert('Registro No Eliminado')
            })

    }
    visibility()
    {
        if(this.state.updateVisibility)
            this.setState({updateVisibility:false})
        else
            this.setState({updateVisibility:true})
    }
    render()
    {
        return(<>
            <div className="row">
                <div className="col">
                    <p>{this.props.Nombre_Votacion}</p>
                </div>
                <div className="col">
                    <p>{this.props.Fecha_Inicio}</p>
                </div>
                <div className="col">
                    <p>{this.props.Fecha_Termino}</p>
                </div>
                <div className="col">
                    <p>{this.props.Contraseña}</p>
                </div>
                <div className="col">
                    <p>{this.props.Carrera}</p>
                </div>
                <div className="col">
                    <div className="btn-group mr-2">
                        <button 
                            type="submit" 
                            className="btn btn-warning"
                            onClick={()=> this.state.updateVisibility ? this.setState({updateVisibility:false}) : this.setState({updateVisibility:true})}
                        >Editar</button>
                        <Modal size="lg" show={this.state.updateVisibility} onHide={()=>this.setState({updateVisibility:false})}>
                            <Modal.Header closeButton>
                                <Modal.Title>Actualizar Contenido: {this.props.Nombre_Votacion}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <UpdateContest
                                    Id={this.props.Id}
                                    Fecha_Inicio={this.props.Fecha_Inicio}
                                    Fecha_Termino={this.props.Fecha_Termino}
                                    Carrera={this.props.Carrera}
                                    Contraseña={this.props.Contraseña}
                                    Cerrar={this.visibility}
                                />
                            </Modal.Body>
                        </Modal>
                    </div>
                    <br/>
                    <div className="btn-group mr-2">
                        <button 
                            type="submit" 
                            className="btn btn-danger"
                            onClick={()=>this.handleRemove()}
                        >Eliminar</button>
                    </div> 
                </div>
            </div>
            <br/>
            </>
        );
    }
}
export default ContestRecords;