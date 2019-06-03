import React,{Component} from 'react';
import fire from './../../Config/Config';
import ContestRecords from './../ContestRecords/ContestRecords';
import {Collapse} from 'react-bootstrap'
class AddContest extends Component
{
    constructor()
    {
        super();
        this.state={
            Nombre_Votacion:'',
            Carrera:'General',
            Fecha_Inicio:'',
            Hora_Inicio:'',
            Fecha_Termino:'',
            Hora_Termino:'',
            Contraseña:'',
            statusPassword:false,
            countEvents:0,
            Events:[],
            Errors:[],
            ErrorsSummary:false
        }
        this.handleChange=this.handleChange.bind(this);
        this.enablePassword=this.enablePassword.bind(this);
        this.addContest=this.addContest.bind(this);
        this.checkContest=this.checkContest.bind(this);
        this.checkErrors=this.chechErrors.bind(this);
    }
    componentDidMount()
    {
        this.loadContests();
    }
    enablePassword(e)
    {
        if(this.state.statusPassword === true)
            this.setState({statusPassword:false,Contraseña:''});
        else
            this.setState({statusPassword:true});
    }
    handleChange(e)
    { 
        this.setState({[e.target.name]:e.target.value});
    }
    loadContests()
    {
        let {Events} = this.state;
        fire.database().ref().child('Evento').on('child_added',snapshot=>{
            Events.push({
                Id:parseInt(snapshot.key),
                Nombre_Votacion:snapshot.val().Nombre_Votacion,
                Carrera:snapshot.val().Carrera,
                Fecha_Inicio:snapshot.val().Fecha_Inicio,
                Hora_Inicio:snapshot.val().Hora_Inicio,
                Fecha_Termino:snapshot.val().Fecha_Termino,
                Hora_Termino:snapshot.val().Hora_Termino,
                Contraseña:snapshot.val().Contraseña

            })
        })
        this.setState({Events});
        
        fire.database().ref().child('Evento').on('child_removed',snapshot=>{
            for(let i=0;i<Events.length;i++)
                if(Events[i].Id === snapshot.key)
                    Events.splice(i,1)
            this.setState({Events})
        })
        
    }
    chechErrors()
    {
        var Errors=[];
        if(this.state.Nombre_Votacion === '')
            Errors.push("El Nombre del evento no puede qudar vacio.")
        else if (this.checkContest())
            Errors.push("No puedes repetir el nombre del evento")
        if(this.state.Fecha_Inicio ==='')
            Errors.push("El Fecha de Inicio del evento no puede qudar vacio.")
        if(this.state.Hora_Inicio === '')
            Errors.push("El Hora de Inicio del evento no puede qudar vacio.")
        if(this.state.Fecha_Termino ==='')
            Errors.push("El Fecha de Termino del evento no puede qudar vacio.")
        if(this.state.Hora_Termino === '')
            Errors.push("El Hora de Termino del evento no puede qudar vacio.")
        if(this.state.Fecha_Termino<this.state.Fecha_Inicio)
            Errors.push("El Fecha de Termino no puede ser menor a la Fecha de Inicio del evento.")
        if(this.state.Fecha_Inicio === this.state.Fecha_Termino)
            if(this.state.Hora_Inicio === this.state.Hora_Termino || this.state.Hora_Termino < this.state.Hora_Inicio)
                Errors.push("Debe haber una diferencia de tiempo para poder realizar el evento.")
        if(this.state.statusPassword === true)
            if(this.state.Contraseña === '')
                Errors.push("Si habilita la opcion de Contraseña esta no puede quedar vacia.")
        if(Errors.length>0)
        {
            this.setState({Errors,ErrorsSummary:true})
            return false
        }
            
        else
        {
            this.setState({Errors,ErrorsSummary:false})
            return true
        }
            
    }
    checkContest()
    {
        const {Events,Nombre_Votacion} = this.state;
        for(let i=0;i<Events.length;i++)
        {    var NombreR = String(Events[i].Nombre_Votacion).toUpperCase();
            if(NombreR === Nombre_Votacion.toUpperCase())
                return true;  
            else
                return false
        }
    }
    addContest()
    {
        let id=0
        let {Events} = this.state
        if(Events.length > 0)
        {
            id = this.state.Events.map((e=>{return (e.Id+1)}))
            id =id.reverse().shift()
        }
            
        if(window.confirm('¿Los datos son correctos?'))
        {
            if(this.chechErrors())
            {
               fire.database().ref('Evento/'+id).set({
                    Nombre_Votacion:this.state.Nombre_Votacion,
                    Carrera:this.state.Carrera,
                    Fecha_Inicio:this.state.Fecha_Inicio,
                    Hora_Inicio:this.state.Hora_Inicio,
                    Fecha_Termino:this.state.Fecha_Termino,
                    Hora_Termino:this.state.Hora_Termino,
                    Contraseña:this.state.Contraseña,
                    Participantes:'',
                    Votantes:''
                }).then((success)=>{
                    window.alert("Registro Exitoso")
                }).catch((fail)=>{
                    window.alert(fail);
                });
            }  
        }
    }
    render()
    {
        return(
            <>
            <div className="container text-center">
                <div className="jumbotron">
                    <h2 className="text-primary">Registro de Evento de Votación</h2>
                    <table className="table">
                        <tbody>
                            <tr>
                                <td className="text-right">
                                    Nombre de Votación
                                </td>
                                <td>
                                    <input 
                                        type="text" 
                                        className="form-control"
                                        onChange={this.handleChange}
                                        name="Nombre_Votacion" 
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="text-right">Duracion</td>
                                <td>
                                    <div className="form-inline" >
                                        <div>
                                            <input 
                                                type="date" 
                                                className="form-control" 
                                                onChange={this.handleChange}
                                                name="Fecha_Inicio"
                                            />
                                            <input 
                                                type="time" 
                                                className="form-control" 
                                                onChange={this.handleChange}
                                                name="Hora_Inicio"
                                            />
                                            <p className="form-text">Inicio del periodo de la votación</p>
                                        </div>
                                        
                                        <div>
                                            <input 
                                                type="date" 
                                                className="form-control"
                                                onChange={this.handleChange}
                                                name="Fecha_Termino" 
                                            />
                                            <input 
                                                type="time" 
                                                className="form-control"
                                                onChange={this.handleChange}
                                                name="Hora_Termino" 
                                            />
                                            <p className="form-text">Fin del periodo de la votación</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="text-right">
                                    <div className="custom-control custom-checkbox">
                                        <input type="checkbox" className="custom-control-input" value={this.state.statusPassword} onClick={this.enablePassword} name="enableContraseña" id="enableContraseña" />
                                        <label className="custom-control-label" htmlFor="enableContraseña">Contraseña</label>
                                    </div>
                                </td>
                                <td>
                                    {this.state.statusPassword ?
                                    <input 
                                        type="text" 
                                        name="Contraseña" 
                                        placeholder="Contraseña"
                                        onChange={this.handleChange}
                                        className="form-control"
                                    />:null
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td className="text-right">Carrera</td>
                                <td>
                                    <select className="custom-select" name="Carrera" onChange={this.handleChange}>
                                        <option>General</option>
                                        <option>Ing. Sistemas Computacionales</option>
                                        <option>Ing. Industrias Alimentarias</option>
                                        <option>Ing. Mecatronica</option>
                                        <option>Ing. Industrial</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td className="text-left">
                                    
                                </td>
                                <td className="text-right">
                                    <button type="submit" onClick={this.addContest} className="btn btn-success">Guardar</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <br/>
                    <Collapse in={this.state.ErrorsSummary}>
                        <div className="card">
                            <div className="card-header">
                                <h2>Lista de Errores</h2>
                            </div>
                            <div className="card-body bg-danger">
                                    <ul>
                                        {this.state.Errors.map((Error,i)=>{
                                            return (<li key={i}>{Error}</li>)
                                        })}
                                    </ul>
                            </div>
                        </div>
                    </Collapse>
                    
                </div>
            </div>
            <br/>
            <div className="container text-center">
                <div className="center jumbotron">
                    <div className="table">
                        <div className="row bg-dark text-light">
                            <div className="col">
                                <p>Nombre Votación</p>
                            </div>
                            <div className="col">
                                <p>Fecha Inicio</p>
                            </div>
                            <div className="col">
                                <p>Fecha Termino</p>
                            </div>
                            <div className="col">
                                <p>Contraseña</p>
                            </div>
                            <div className="col">
                                <p>Carrera</p>
                            </div>
                            <div className="col">
                             <h3><span className="badge badge-info">{this.state.Events.length}</span></h3>
                            </div>
                        </div>
                        <br/>
                        {this.state.Events.map(event=>
                        {
                            return(
                                <ContestRecords
                                    key={event.Id}
                                    Id={event.Id}
                                    Nombre_Votacion={event.Nombre_Votacion}
                                    Fecha_Inicio={event.Fecha_Inicio+', '+event.Hora_Inicio}
                                    Fecha_Termino={event.Fecha_Termino+', '+event.Hora_Termino}
                                    Contraseña={event.Contraseña}
                                    Carrera={event.Carrera}
                                />
                                
                            )
                        })
                        }
                    </div>
                </div>
            </div>
        </>
        );
    }
}
export default AddContest;