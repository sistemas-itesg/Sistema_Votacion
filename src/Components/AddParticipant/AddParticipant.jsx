import React, {Component} from 'react';
import fire from './../../Config/Config';
import {ProgressBar} from 'react-bootstrap';
import ParticipantsRecords from './../ParticipantsRecords/ParticipantsRecords';
class AddParticipant extends Component
{
    constructor()
    {
        super();
        this.state=
        {
            uploadValue:0,
            valueFile:'Examinar',
            Participante:'',
            Carrera:'General',
            evento:'',
            ImagePath:'Imagenes/Logo',
            alumnoVisibility:false,
            imagenDefault:false,
            Events:[],
            Alumno:'',
            Records:[],
            Participants:[]
        }
        this.handleUploadChange=this.handleUploadChange.bind(this);
        this.getStudents=this.getStudents.bind(this);
        this.getEvents=this.getEvents.bind(this);
        this.compareDate=this.compareDate.bind(this);
        this.handleChange=this.handleChange.bind(this);
        this.addNewParticipant=this.addNewParticipant.bind(this);
        this.checkRecords=this.checkRecords.bind(this);
    }
    compareDate(eventDate)
    {
        var formDate = new Date(eventDate)
        var nowDate = new Date();
        if(formDate.getFullYear()=== nowDate.getFullYear()-1 || formDate.getFullYear()=== nowDate.getFullYear())
            if((nowDate.getMonth()+1)<=(formDate.getMonth()+1))
                if(nowDate.getDate()<(formDate.getDate()+1))
                    return true;
                else return false;
            else return false;
        else return false;

        
    }
    handleChange(e)
    {
        this.setState({[e.target.name]:e.target.value})
        
    }
    componentDidMount()
    {
        this.getEvents();
        this.getRecords();
    }
    getRecords()
    {
        let {Records} =this.state;

        fire.database().ref().child('Evento').on('child_added',snapshot=>{
            fire.database().ref().child('Evento/'+snapshot.key+'/Participantes').on('child_added',snap=>{
                Records.push({
                    EventKey:snapshot.key,
                    Ruta:'Evento/'+snapshot.key+'/Participantes/',
                    ParticipantKey:snap.key,
                    Evento:snapshot.val().Nombre_Votacion,
                    Alias:snap.val().Nombre,
                    Participante:snap.val().Participante
                })
            })
        })
        //console.log(Records)
        this.setState({Records})
    }
    getEvents()
    {
        const {Events} =this.state;
        fire.database().ref().child('Evento').on('child_added',snapshot=>{
            //this.compareDate(snapshot.val().Fecha_Inicio)
           if(this.compareDate(snapshot.val().Fecha_Inicio))
                Events.push({
                    key:snapshot.key,
                    Nombre_Votacion:snapshot.val().Nombre_Votacion,
                    Carrera:snapshot.val().Carrera
                })
        })
       this.setState({Events});
    }
    getStudents()
    {
        var Participants = [];
        const {Carrera} = this.state;
        fire.database().ref().child('Estudiante').on('child_added',snapshot=>{
                if(Carrera === 'General' || snapshot.val().Carrera === Carrera)
                    Participants.push({
                        Numero_Control:snapshot.val().Numero_Control,
                        Nombre:snapshot.val().Nombre +' '+snapshot.val().Apellidos,
                        Carrera:snapshot.val().Carrera
                    })
        })
        this.setState({Participants})
    }
    checkRecords()
    {
        const {Records} = this.state;
        var participant=(this.state.alumnoVisibility?this.state.Alumno.split(','):this.state.Participante);
        for(let i=0;i<Records.length;i++) 
           if(this.state.evento === Records[i].Evento)
                if(participant[0] === Records[i].Participante || participant[1] === Records[i].Participante)
                    {
                        console.log(participant[0],participant[1],Records[i].Participante)
                        return false;
                    }
                else
                    return true;
            else
                return true;
                
    }
    addNewParticipant()
    {
        var participant=(this.state.alumnoVisibility?this.state.Alumno.split(','):this.state.Participante);
        var event = this.state.evento.split(',')
        let count =0
        fire.database().ref().child('Evento/'+event[0]+'/Participantes').once('value',snapshot=>{
            count=Number(snapshot.numChildren())+1;
        })
           fire.database().ref('Evento/'+event[0]+'/Participantes/'+count).set({   
               Participante:this.state.alumnoVisibility?participant[0]:this.state.Participante,
                Nombre:this.state.alumnoVisibility?participant[1]:this.state.Participante,
                ImagePath:this.state.ImagePath,
                Votos:0 
            }).then((success)=>{
                window.alert("Nuevo participante agregado")
            }).catch((fail)=>{
                console.log(fail);
            })
        if(Boolean(this.checkRecords()))
        {
            
        }
        
            
    }
    handleUploadChange(e)
    {
        const file = e.target.files[0];
        this.setState({
            [e.target.name]:file.name,
            ImagePath:'Imagenes/'+(this.state.alumnoVisibility ? this.state.Alumno : this.state.Participante)
        });
        var ext =this.state.valueFile.split('.')
        const storageRef = fire.storage().ref('Imagenes/'+(this.state.alumnoVisibility ? this.state.Alumno : this.state.Participante)+'.'+ext[1]);
        const task = storageRef.put(file);
        task.on('state_changed',snapshot=>{
            let percentage =(snapshot.bytesTransferred/snapshot.totalBytes)*100;
            this.setState({uploadValue:percentage})
        },error => {
            console.log(error.name, error.message)
        },()=>{
            this.setState({uploadValue:100})
        });
    }
    render()
    {
        return(
            <div className="container text-center">
                <div className="center jumbotron">
                    <h2 className="text-primary">Registro de Participante(s)</h2>
                    <br/>
                    <div className="container">
                        <div className="table">
                            <div className="row">
                                <div className="col-3 text-right">
                                    Referencia de Votación
                                </div>
                                <div className="col-9">
                                    <select className="custom-select" name="evento" onClick={this.handleChange} id="">
                                        {this.state.Events.map(Event=>{
                                            return(
                                                <option key={Event.key} value={(Event.key)+','+(Event.Nombre_Votacion)}>{Event.Nombre_Votacion} - ({Event.Carrera})</option>
                                            )
                                        })}
                                        
                                    </select>
                                </div>
                            </div>
                            <br/>
                            <div className="row">
                                <div className="col-3 text-right">
                                    <div className="custom-control custom-checkbox">
                                            <input 
                                                type="checkbox" 
                                                name=""
                                                id="ckb_alumno"
                                                className="custom-control-input" 
                                                onClick=
                                                {
                                                    ()=>this.state.alumnoVisibility ? this.setState({alumnoVisibility:false}) : this.setState({alumnoVisibility:true})
                                                } 
                                            />
                                            <label className="custom-control-label" htmlFor="ckb_alumno">Alumno</label>
                                        </div>
                                </div>
                                <div className="col-9">
                                    {this.state.alumnoVisibility ?
                                    <>
                                    <select className="custom-select" onChange={this.handleChange} onClick={this.getStudents} name="Carrera">
                                        <option value="General">General</option>
                                        <option value="Ing. Sistemas Computacionales">Ing. Sistemas Computacionales</option>
                                        <option value="Ing. Industrias Alimentarias">Ing. Industrias Alimentarias</option>
                                        <option value="Ing. Mecatronica">Ing. Mecatronica</option>
                                        <option value="Ing. Industrial">Ing. Industrial</option>
                                    </select>
                                    <select className="custom-select"  onClick={this.handleChange} name="Alumno">
                                        {this.state.Participants.map(Student =>{
                                            
                                            return(
                                                <option value={(Student.Numero_Control+','+ Student.Nombre)} key={Student.Numero_Control}>({Student.Carrera}) - {Student.Numero_Control} - "{Student.Nombre}"</option>
                                            )
                                        })
                                        }
                                    </select>
                                    </>
                                    :
                                    <input 
                                        type="text" 
                                        className="form-control"
                                        placeholder="Nombre del Paricpante o Elemento"
                                        name="Participante" 
                                        onChange={this.handleChange}
                                    />}
                                    
                                </div>
                            </div>
                            <br/>
                            <div className="row">
                                <div className="col-3 text-right">
                                    <div className="custom-control custom-checkbox">
                                        <input 
                                            type="checkbox" 
                                            className="custom-control-input" 
                                            id="ckb_imagen"
                                            name=""
                                            onClick=
                                            {
                                                ()=>this.state.imagenDefault ? this.setState({imagenDefault:false}): this.setState({imagenDefault:true})
                                            }
                                        />
                                        <label className="custom-control-label" htmlFor="ckb_imagen">Imagen</label>
                                    </div>
                                </div>
                                <div className="col-9">
                                    {this.state.imagenDefault ?
                                    <div className="custom-file">
                                        <input type="file" className="btn custom-file-input" onChange={this.handleUploadChange} name="valueFile" id="valueFile"/>
                                        <label className="custom-file-label" htmlFor="valueFile">{this.state.valueFile}</label>
                                        <ProgressBar animated striped variant="info" now={this.state.uploadValue}/>
                                     </div>
                                    :null}
                                    
                                </div>
                            </div>
                            <br/>
                            <div className="row">
                                <div className="col-12 text-right">
                                    <button type="submit" onClick={this.addNewParticipant} className="btn btn-success">Guardar</button>
                                </div>
                            </div>
    
                        </div>
                    </div>
                </div>
                <br/>
                <div className="center jumbotron">
                    <div className="table">
                        <div className="row bg-dark text-light">
                            <div className="col-3">
                                Participante
                            </div>
                            <div className="col-3">
                                Alias
                            </div>
                            <div className="col-3">
                                Evento
                            </div>
                            <div className="col-3">
                               <h3> <span className="badge badge-info">{this.state.Records.length}</span></h3>
                            </div>
                        </div>
                        <br/>
                        {this.state.Records.map((Record,i)=>{
                            return (
                                <ParticipantsRecords
                                    key={i}
                                    participantId={Record.ParticipantKey}
                                    Ruta={Record.Ruta}
                                    eventKey={Record.EventKey}
                                    Alias={Record.Alias}
                                    Participante={Record.Participante}
                                    Evento={Record.Evento}
                                />
                            )
                        })

                        }
                    </div>
                </div>
            </div>
        );
    }

}
export default AddParticipant;