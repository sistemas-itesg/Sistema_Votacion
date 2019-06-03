import React,{Component} from 'react';
import fire from '../../Config/Config'
class UpdateContest extends Component
{
    constructor(props)
    {
        super(props);
        this.state=
        {
            Id:this.props.Id,
            Fecha_Inicio:'',
            Hora_Inicio:'',
            Fecha_Termino:'',
            Hora_Termino:'',
            Contraseña:''
        }
        this.handleChange=this.handleChange.bind(this)
        this.GuardarCambios=this.GuardarCambios.bind(this)
    }
    componentDidMount()
    {
        var Tiempo_Inicio = this.props.Fecha_Inicio.split(', ')
        var Tiempo_Termino = this.props.Fecha_Termino.split(', ')
        this.setState({
            Fecha_Inicio:Tiempo_Inicio[0],
            Hora_Inicio:Tiempo_Inicio[1],
            Fecha_Termino:Tiempo_Termino[0],
            Hora_Termino:Tiempo_Termino[1],
            Contraseña:this.props.Contraseña
        })
    }
    GuardarCambios(Id)
    {
        fire.database().ref('Evento/'+Id).update({
            Fecha_Inicio:this.state.Fecha_Inicio,
            Hora_Inicio:this.state.Hora_Inicio,
            Fecha_Termino:this.state.Fecha_Termino,
            Hora_Termino:this.state.Hora_Termino,
            Contraseña:this.state.Contraseña
        }).then(()=>{
            window.alert("Cambios guardados exitosamente")
            this.props.Cerrar()
        }).catch((error)=>
        {
            window.alert("algo salio mal, "+ error)
        })
    }
    handleChange(e)
    {
        this.setState({[e.target.name]:e.target.value})
    }
    render()
    {
        return(
            <div className="container text-center">
                <div className="center jumbotron ">
                    <div className="row">
                        <div className="col-3 text-right">
                            Fecha de Inicio
                        </div>
                        <div className="col-9">
                            <div className="form-inline">
                                <input type="date" className="form-control" onChange={this.handleChange} value={this.state.Fecha_Inicio} name="Fecha_Inicio" id=""/>
                                <input type="time" className="form-control" onChange={this.handleChange} value={this.state.Hora_Inicio} name="Hora_Inicio" id=""/>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-3 text-right">
                        Fecha de Termino
                        </div>
                        <div className="col-9">
                            <div className="form-inline">
                                <input type="date" className="form-control" onChange={this.handleChange} value={this.state.Fecha_Termino} name="Fecha_Termino" id=""/>
                                <input type="time" className="form-control" onChange={this.handleChange} value={this.state.Hora_Termino} name="Hora_Termino" id=""/>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-3 text-right">
                            Contraseña
                        </div>
                        <div className="col-9">
                            <input type="text" className="form-control" value={this.state.Contraseña} onChange={this.handleChange} name="Contraseña" id=""/>
                        </div>
                    </div>  
                </div>
                    <div className="row">
                        <div className="col text-right">
                            <button type="submit" onClick={()=>this.GuardarCambios(this.props.Id)} className="btn btn-success">Guardar Cambios</button>
                        </div>
                    </div>
            </div>
        );
    }
}
export default UpdateContest;